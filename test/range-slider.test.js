import { beforeEach, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { clickTrackEnd, clickTrackStart, listenToEvents, setup } from './utils.js';
import '../src/index.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('range-slider', () => {
  describe('rendering', () => {
    test('default attributes', async () => {
      const { element, track, trackFill, runnableTrack, thumb } = setup();

      await expect.element(element).toBeInTheDocument();
      await expect.element(track).toBeInTheDocument();
      await expect.element(trackFill).toBeInTheDocument();
      await expect.element(runnableTrack).toBeInTheDocument();
      await expect.element(thumb).toBeInTheDocument();

      expect(element).toHaveAttribute('tabindex', '-1');
      expect(thumb).toHaveAttribute('tabindex', '0');
      expect(thumb).toHaveRole('slider');

      expect(thumb).toHaveAttribute('aria-valuenow', '50');
      expect(thumb).toHaveAttribute('aria-valuemin', '0');
      expect(thumb).toHaveAttribute('aria-valuemax', '100');
    });
  });

  describe('form association', () => {
    test('form-associated value state', async () => {
      const { element } = setup('<form><range-slider name="range-slider"></range-slider></form>');

      const form = document.querySelector('form');

      expect(form).toHaveFormValues({ 'range-slider': '50' });
      expect(element).toHaveValue('50');
    });

    test('form-associated disabled state', async () => {
      const { element, thumb } = setup(
        '<form><fieldset disabled><range-slider></range-slider></fieldset></form>',
      );

      const form = document.querySelector('form');
      const fieldset = document.querySelector('fieldset');

      // Initial disabled
      expect(element).not.toHaveAttribute('tabindex', '-1');
      expect(thumb).not.toHaveAttribute('tabindex', '0');
      expect(thumb).toHaveAttribute('aria-disabled', 'true'); // expose disabled state semantically
      // Ensure form values are empty when disabeld
      expect(Object.fromEntries(new FormData(form).entries())).toStrictEqual({});

      // Programmatic enabled
      fieldset.removeAttribute('disabled');
      expect(element).toHaveAttribute('tabindex', '-1');
      expect(thumb).toHaveAttribute('tabindex', '0');
      expect(thumb).not.toHaveAttribute('aria-disabled');

      // Programmatic disabled
      fieldset.setAttribute('disabled', '');
      expect(element).not.toHaveAttribute('tabindex', '-1');
      expect(thumb).not.toHaveAttribute('tabindex', '0');
      expect(thumb).toHaveAttribute('aria-disabled', 'true'); // expose disabled state semantically
    });

    test('form reset restores default value', () => {
      const { element } = setup(`
        <form>
          <range-slider name="slider" value="30"></range-slider>
        </form>
      `);

      const form = document.querySelector('form');

      element.value = 80;
      form.reset();

      expect(element).toHaveValue('30');
    });

    test('restores form state and does not dispatch events', async () => {
      const { element } = setup('<form><range-slider name="slider"></range-slider></form>');
      const { input, change } = listenToEvents(element, ['input', 'change']);
      const form = document.querySelector('form');

      // Simulate browser session/BFCache restore (value, mode)
      element.formStateRestoreCallback('25', 'restore');
      expect(element).toHaveValue('25');
      expect(form).toHaveFormValues({ slider: '25' });

      // Simulate browser autofill (value, mode)
      element.formStateRestoreCallback('70', 'autocomplete');
      expect(element).toHaveValue('70');
      expect(form).toHaveFormValues({ slider: '70' });

      // Should not dispatch events (matches native input restore)
      expect(input).not.toHaveBeenCalled();
      expect(change).not.toHaveBeenCalled();
    });
  });

  describe('attributes', () => {
    test('custom attributes', async () => {
      const { element } = setup(
        '<range-slider min="10" max="60" step="5" value="20"></range-slider>',
      );

      const { input, change } = listenToEvents(element, ['input', 'change']);

      expect(element).toHaveValue('20');

      // Ensure no events fire for initial value attribute
      expect(input).not.toHaveBeenCalled();
      expect(change).not.toHaveBeenCalled();
    });

    test('negative attributes', async () => {
      const { element } = setup(
        '<range-slider min="-10" max="-80" step="10" value="-30"></range-slider>',
      );

      expect(element).toHaveValue('-30');
    });

    test('disabled attribute', async () => {
      const { element, thumb } = setup('<range-slider disabled></range-slider>');

      expect(element).not.toHaveAttribute('tabindex', '-1');
      expect(thumb).not.toHaveAttribute('tabindex', '0');
      expect(thumb).toHaveAttribute('aria-disabled', 'true'); // expose disabled state semantically

      // Programmatic change
      element.disabled = false;
      expect(element).toHaveAttribute('tabindex', '-1');
      expect(thumb).toHaveAttribute('tabindex', '0');
      expect(thumb).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('value updates', () => {
    test('programmatic value property changes', async () => {
      const { element } = setup();
      const { input, change } = listenToEvents(element, ['input', 'change']);

      element.value = 20;
      expect(element).toHaveValue('20');

      // Programmatic updates should not fire events (matching the default browser behavior).
      expect(input).not.toHaveBeenCalled();
      expect(change).not.toHaveBeenCalled();
    });

    test('programmatic value attribute changes', async () => {
      const { element } = setup();
      const { input, change } = listenToEvents(element, ['input', 'change']);

      element.setAttribute('value', 10);
      expect(element).toHaveValue('10');

      // Programmatic attribute changes should not fire events ((matching the default browser behavior).
      expect(input).not.toHaveBeenCalled();
      expect(change).not.toHaveBeenCalled();
    });

    test('aria-valuenow updates when value changes', () => {
      const { element, thumb } = setup();

      element.value = 20;
      expect(thumb).toHaveAttribute('aria-valuenow', '20');
    });

    test('value clamps to min/max', () => {
      const { element } = setup('<range-slider min="10" max="20"></range-slider>');

      // min
      element.value = -100;
      expect(element).toHaveValue('10');

      // max
      element.value = 100;
      expect(element).toHaveValue('20');
    });

    test('value snaps to step', () => {
      const { element } = setup('<range-slider step="10"></range-slider>');

      element.value = 24.5;
      expect(element).toHaveValue('20');
    });
  });

  describe('interaction', () => {
    test('focus behaviour', async () => {
      const { thumb } = setup();

      await userEvent.keyboard('{Tab}');
      expect(thumb).toHaveFocus();
    });

    test('thumb click does not update the value', async () => {
      const { element, thumb } = setup();

      const value = element.value;

      const { input, change } = listenToEvents(element, ['input', 'change']);

      await userEvent.click(thumb);
      expect(element).toHaveValue(String(value));

      // Make sure that no events have been dispatched
      expect(input).not.toHaveBeenCalled();
      expect(change).not.toHaveBeenCalled();
    });

    test('track clicks update the value and dispatch events', async () => {
      const { element } = setup('<range-slider min="10" max="42"></range-slider>');
      const { input, change } = listenToEvents(element, ['input', 'change']);

      // Click start → should go to min
      await clickTrackStart(element);
      expect(element).toHaveValue('10');
      expect(input).toHaveBeenCalledTimes(1);
      expect(change).toHaveBeenCalledTimes(1);

      // Reset spies for next action
      input.mockReset();
      change.mockReset();

      // Click end → should go to max
      await clickTrackEnd(element);
      expect(element).toHaveValue('42');
      expect(input).toHaveBeenCalledTimes(1);
      expect(change).toHaveBeenCalledTimes(1);
    });

    test('dragging thumb updates value and dispatches events', async () => {
      const { element, thumb } = setup();
      const { input, change } = listenToEvents(element, ['input', 'change']);
      const pointerId = 1;

      thumb.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          clientX: 10,
          pointerId,
        }),
      );

      element.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          clientX: 150,
          pointerId,
        }),
      );

      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          pointerId,
        }),
      );

      expect(input).toHaveBeenCalled();
      expect(change).toHaveBeenCalled();
    });
  });

  describe('multi thumb', () => {
    test('multi thumb support', async () => {
      const { element, thumbs } = setup(`
    <form>
      <range-slider value="10,40" name="price-range">
        <div data-track></div>
        <div data-track-fill></div>
        <div data-runnable-track>
          <div data-thumb aria-label="Minimum Price"></div>
          <div data-thumb aria-label="Maximum Price"></div>
        </div>
      </range-slider>
    </form>
  `);

      const [thumb0, thumb1] = thumbs;
      const form = document.querySelector('form');

      for (const thumb of thumbs) {
        expect(thumb).toHaveRole('slider');
        expect(thumb).toHaveAttribute('tabindex', '0');
        expect(thumb).toHaveAttribute('aria-valuemin', '0');
        expect(thumb).toHaveAttribute('aria-valuemax', '100');
      }

      expect(thumb0).toHaveAttribute('aria-valuenow', '10');
      expect(thumb1).toHaveAttribute('aria-valuenow', '40');

      expect(element).toHaveValue('10,40');
      expect(form).toHaveFormValues({ 'price-range': '10,40' });
    });
  });

  describe('api', () => {
    test('Spec compliant step rounding using the min attribute as step base', async () => {
      const { element } = setup('<range-slider min="5" step="2" value="5"></range-slider>');

      element.stepUp();
      expect(element).toHaveValue('7');
    });
  });
});

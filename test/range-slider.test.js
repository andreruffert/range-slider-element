import { userEvent } from '@vitest/browser/context';
import { expect, test, vi } from 'vitest';
import '../src/index.js';

const render = (html) => {
  document.body.innerHTML = html;
};

test('default attributes', async () => {
  render('<range-slider></range-slider>');

  const element = document.querySelector('range-slider');
  const track = element.querySelector('[data-track]');
  const trackFill = element.querySelector('[data-track-fill]');
  const runnableTrack = element.querySelector('[data-runnable-track]');
  const thumb = runnableTrack.querySelector('[data-thumb]');

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

test('HTML form support', async () => {
  render('<form><range-slider name="range-slider"></range-slider></form>');

  const form = document.querySelector('form');
  const element = document.querySelector('range-slider');

  expect(form).toHaveFormValues({ 'range-slider': '50' });
  expect(element).toHaveValue('50');
});

test('custom attributes', async () => {
  render('<range-slider min="10" max="60" step="5" value="20"></range-slider>');

  const element = document.querySelector('range-slider');
  const handleEvent = vi.fn();

  element.addEventListener('input', handleEvent);
  element.addEventListener('change', handleEvent);

  expect(element).toHaveValue('20');

  // Make sure that no events have been dispatched for initial value attribute
  expect(handleEvent).not.toHaveBeenCalled();
});

test('negative attributes', async () => {
  render('<range-slider min="-10" max="-80" step="10" value="-30"></range-slider>');

  const element = document.querySelector('range-slider');
  expect(element).toHaveValue('-30');
});

test('programmatic value property changes', async () => {
  render('<range-slider></range-slider>');

  const element = document.querySelector('range-slider');
  const handleEvent = vi.fn();

  element.addEventListener('input', handleEvent);
  element.addEventListener('change', handleEvent);

  element.value = 20;
  expect(element).toHaveValue('20');

  // Ensure that no events are dispatched for programmatic value changes.
  // Matching the default browser behavior.
  expect(handleEvent).not.toHaveBeenCalled();
});

test('programmatic value attribute changes', async () => {
  render('<range-slider></range-slider>');

  const element = document.querySelector('range-slider');
  const handleEvent = vi.fn();

  element.addEventListener('input', handleEvent);
  element.addEventListener('change', handleEvent);

  element.setAttribute('value', 10);
  expect(element).toHaveValue('10');

  // Ensure that no events are dispatched for programmatic value changes.
  // Matching the default browser behavior.
  expect(handleEvent).not.toHaveBeenCalled();
});

test('disabled attribute', async () => {
  render('<range-slider disabled></range-slider>');

  const element = document.querySelector('range-slider');
  const thumb = element.querySelector('[data-runnable-track] [data-thumb]');

  expect(element).not.toHaveAttribute('tabindex', '-1');
  expect(thumb).not.toHaveAttribute('tabindex', '0');

  // Programmatic change
  element.disabled = false;
  expect(element).toHaveAttribute('tabindex', '-1');
  expect(thumb).toHaveAttribute('tabindex', '0');
});

test('multi thumb support', async () => {
  render(`<form>
    <range-slider value="10,40" name="price-range">
      <div data-track></div>
      <div data-track-fill></div>
      <div data-runnable-track>
        <div data-thumb aria-label="Minimum Price"></div>
        <div data-thumb aria-label="Maximum Price"></div>
      </div>
    </range-slider>
  </form>`);

  const form = document.querySelector('form');
  const element = document.querySelector('range-slider');
  const thumbs = element.querySelectorAll('[data-runnable-track] [data-thumb]');
  const thumb0 = thumbs[0];
  const thumb1 = thumbs[1];

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

test('focus behaviour', async () => {
  render('<range-slider></range-slider>');

  const element = document.querySelector('range-slider');
  const thumb = element.querySelector('[data-runnable-track] [data-thumb]');

  await userEvent.keyboard('{Tab}');
  expect(thumb).toHaveFocus();
});

test('thumb click does not update the value', async () => {
  render('<range-slider></range-slider>');

  const element = document.querySelector('range-slider');
  const thumb = element.querySelector('[data-runnable-track] [data-thumb]');
  const value = element.value;
  const handleEvent = vi.fn();

  element.addEventListener('input', handleEvent);
  element.addEventListener('change', handleEvent);

  await userEvent.click(thumb);
  expect(element).toHaveValue(String(value));

  // Make sure that no events have been dispatched
  expect(handleEvent).not.toHaveBeenCalled();
});

test('track click updates the value and sends events', async () => {
  render('<range-slider max="42"></range-slider>');

  const element = document.querySelector('range-slider');
  const handleInputEvent = vi.fn();
  const handleChangeEvent = vi.fn();

  element.addEventListener('input', handleInputEvent);
  element.addEventListener('change', handleChangeEvent);

  await userEvent.click(element, { position: { x: element.offsetWidth - 1, y: 5 } });
  expect(element).toHaveValue(String(42));

  // Should dispatch "input" event
  expect(handleInputEvent).toHaveBeenCalled();

  // Should dispatch "change" event
  expect(handleChangeEvent).toHaveBeenCalled();
});

test('Spec compliant step rounding using the min attribute as step base', async () => {
  render('<range-slider min="5" step="2" value="5"></range-slider>');

  const element = document.querySelector('range-slider');
  element.stepUp();
  expect(element).toHaveValue('7');
});

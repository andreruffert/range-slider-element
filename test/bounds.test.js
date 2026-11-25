import { beforeEach, describe, expect, test } from 'vitest';
import { listenToEvents, setup } from './utils.js';
import '../src/index.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('bounds changes during dragging', () => {
  test.each([
    { bound: 'max', limit: 60, before: '80', expected: '60' },
    { bound: 'min', limit: 40, before: '20', expected: '40' },
  ])('commits within the updated $bound', ({ bound, limit, before, expected }) => {
    const { element, thumb } = setup('<range-slider value="50"></range-slider>');
    const { change } = listenToEvents(element, ['change']);
    let committed;
    element.addEventListener('change', () => {
      committed = element.value;
    });
    const pointerId = 1;
    thumb.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId }));
    const rect = element.getBoundingClientRect();
    element.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerId,
        clientX: rect.left + (rect.width * Number(before)) / 100,
      }),
    );
    expect(element.value).toBe(before);
    element[bound] = limit;
    window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId }));
    expect(change).toHaveBeenCalledOnce();
    expect(committed).toBe(expected);
    expect(element.value).toBe(expected);
  });
  test('clamps both handles and form data before committing a changed range', () => {
    const { element, thumbs } = setup(`
      <form>
        <range-slider value="20,80" name="price-range">
          <div data-track></div>
          <div data-track-fill></div>
          <div data-runnable-track>
            <div data-thumb></div>
            <div data-thumb></div>
          </div>
        </range-slider>
      </form>
    `);
    let committed;
    element.addEventListener('change', () => {
      committed = element.value;
    });
    const pointerId = 1;
    thumbs[1].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId }));
    const rect = element.getBoundingClientRect();
    element.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerId,
        clientX: rect.left + rect.width * 0.9,
      }),
    );
    element.min = 30;
    element.max = 60;
    window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId }));
    expect(committed).toBe('30,60');
    expect(document.querySelector('form')).toHaveFormValues({ 'price-range': '30,60' });
  });
});

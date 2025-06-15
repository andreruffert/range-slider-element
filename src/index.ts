import type { RangeSliderElement } from './range-slider-element';
export type { RangeSliderElement as default };

/**
 * Augments the global `HTMLElementTagNameMap` to recognize the `<range-slider>`
 * custom element and associate it with the `RangeSliderElement` class.
 *
 * This allows TypeScript to treat:
 * ```ts
 * const el = document.createElement('range-slider');
 * ```
 * as having the type `RangeSliderElement`.
 */
declare global {
  interface HTMLElementTagNameMap {
    'range-slider': RangeSliderElement;
  }
}

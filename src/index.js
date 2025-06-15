import './style.css';
import { RangeSliderElement } from './range-slider-element';

export { RangeSliderElement as default };

if (!new URL(import.meta.url).searchParams.has('define', 'false')) {
  window.RangeSliderElement = RangeSliderElement.define();
}

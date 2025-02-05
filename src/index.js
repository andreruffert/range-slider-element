import './style.css';
import RangeSliderElement from './range-slider-element';
export { RangeSliderElement as default };

const ELEMENT_NAME = 'range-slider';

if (!window.customElements.get(ELEMENT_NAME)) {
  window.RangeSliderElement = RangeSliderElement;
  window.customElements.define(ELEMENT_NAME, RangeSliderElement);
}

import './style.css';
import RangeSliderElement from './range-slider-element';
export { RangeSliderElement as default };

if (!window.customElements.get(RangeSliderElement.tagName)) {
  window.RangeSliderElement = RangeSliderElement;
  window.customElements.define(RangeSliderElement.tagName, RangeSliderElement);
}

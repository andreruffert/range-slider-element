import { getPrescision, setAriaAttribute } from './utils';

const REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled', 'value-precision'];

const KEY_CODE_ACTIONS = {
  stepUp: ['ArrowUp', 'ArrowRight'],
  stepDown: ['ArrowDown', 'ArrowLeft'],
};

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <div data-track></div>
  <div data-track-fill></div>
  <div data-runnable-track>
    <div data-thumb></div>
  </div>
`;

/**
 * A custom element that represents a range slider for selecting numerical values within a defined range.
 * This element supports both single and dual handles for selecting a single value or a range.
 *
 * @element RangeSliderElement
 * @extends HTMLElement
 * @fires input - Fired when the value of the range slider changes.
 * @fires change - Fired when the user stops adjusting the value.
 *
 * @example
 * // Example of using RangeSliderElement in HTML
 * <range-slider min="0" max="100" step="1"></range-slider>
 */
export class RangeSliderElement extends HTMLElement {
  /**
   * Registers the custom element with the global or provided custom element registry.
   *
   * @param {string} [tagName='range-slider'] - The tag name to register the element under.
   * @param {CustomElementRegistry} [registry=window.customElements] - Optional custom element registry.
   * @returns {typeof RangeSliderElement | undefined} - Returns the class constructor if successfully defined, otherwise undefined.
   * @example
   * RangeSliderElement.define();
   * RangeSliderElement.define('my-slider', customElements);
   */
  static define(tagName = 'range-slider', registry = customElements) {
    if (!registry.get(tagName)) {
      registry.define(tagName, RangeSliderElement);
      return RangeSliderElement;
    }
  }

  static observedAttributes = REFLECTED_ATTRIBUTES;
  static formAssociated = true;

  #internals;
  #startValue;
  #value = [];
  #valuePercent = [];
  #thumbIndex = 0;

  /**
   * Creates a new instance of the RangeSliderElement.
   *
   * @constructor
   */
  constructor() {
    super();
    // Get access to the internal form control APIs
    this.#internals = this.attachInternals();

    this.addEventListener('focusin', this.#focusHandler);
    this.addEventListener('pointerdown', this.#startHandler);
    this.addEventListener('keydown', this.#keyboardHandler);
  }

  get min() {
    return this.hasAttribute('min') ? Number(this.getAttribute('min')) : 0;
  }
  get max() {
    return this.hasAttribute('max') ? Number(this.getAttribute('max')) : 100;
  }
  get step() {
    return this.hasAttribute('step') ? Number(this.getAttribute('step')) : 1;
  }
  get value() {
    return this.#value.join(',');
  }
  get disabled() {
    return this.getAttribute('disabled') === '' || false;
  }
  get valuePrecision() {
    return this.getAttribute('value-precision') || '';
  }
  /**
   * @returns {number}
   */
  get minStepsBetweenThumbs() {
    return this.hasAttribute('min-steps-between-thumbs')
      ? Number(this.getAttribute('min-steps-between-thumbs'))
      : 0;
  }
  get #isVertical() {
    return Boolean(this.getAttribute('orientation') === 'vertical');
  }
  get #isRTL() {
    return Boolean(this.#isVertical || this.getAttribute('dir') === 'rtl');
  }
  get #isMultiThumb() {
    return this.#thumbs.length > 1;
  }
  get #thumbs() {
    return this.querySelectorAll('[data-runnable-track] [data-thumb]');
  }
  get #trackFill() {
    return this.querySelector('[data-track-fill]');
  }
  get #size() {
    return this.#isVertical ? this.offsetHeight : this.offsetWidth;
  }

  set min(min) {
    this.setAttribute('min', min);
    for (const thumb of this.#thumbs) {
      setAriaAttribute(thumb, 'min', min);
    }
  }
  set max(max) {
    this.setAttribute('max', max);
    for (const thumb of this.#thumbs) {
      setAriaAttribute(thumb, 'max', max);
    }
  }
  set step(step) {
    this.setAttribute('step', step);
  }
  set value(values) {
    String(values)
      .split(',')
      .map((value, index) => {
        this.#updateValue(index, value);
      });
  }
  set disabled(disabled) {
    if (disabled) {
      this.setAttribute('disabled', '');
      this.removeAttribute('tabindex');
      for (const thumb of this.#thumbs) {
        thumb.removeAttribute('tabindex');
      }
    } else {
      this.removeAttribute('disabled');
      this.setAttribute('tabindex', '-1');
      for (const thumb of this.#thumbs) {
        thumb.setAttribute('tabindex', 0);
      }
    }
  }
  set valuePrecision(precision) {
    this.setAttribute('value-precision', precision);
  }
  /**
   * @param {number} steps
   */
  set minStepsBetweenThumbs(steps) {
    this.setAttribute('min-steps-between-thumbs', steps);
  }

  /**
   * Form data support
   * The following properties and methods aren't strictly required,
   * but browser-level form controls provide them. Providing them helps
   * ensure consistency with browser-provided controls.
   */
  get form() {
    return this.#internals.form;
  }
  get name() {
    return this.getAttribute('name');
  }
  get type() {
    return this.localName;
  }
  get validity() {
    return this.#internals.validity;
  }
  get validationMessage() {
    return this.#internals.validationMessage;
  }
  get willValidate() {
    return this.#internals.willValidate;
  }
  checkValidity() {
    return this.#internals.checkValidity();
  }
  reportValidity() {
    return this.#internals.reportValidity();
  }

  connectedCallback() {
    // Template setup
    if (!this.firstChild) {
      this.appendChild(TEMPLATE.content.cloneNode(true));
    }

    // Keyboard setup
    if (!this.disabled) {
      this.setAttribute('tabindex', '-1');
    }

    // Thumb setup
    this.#thumbs.forEach((thumb, index) => {
      thumb.dataset.thumb = index;
      thumb.setAttribute('role', 'slider');
      setAriaAttribute(thumb, 'min', this.min);
      setAriaAttribute(thumb, 'max', this.max);
      if (!this.disabled) {
        thumb.setAttribute('tabindex', 0);
      }
    });

    // Set initial value
    this.value = this.getAttribute('value') || this.#getDefaultValue();
  }

  disconnectedCallback() {
    this.removeEventListener('focusin', this.#focusHandler);
    this.removeEventListener('pointerdown', this.#startHandler);
    this.removeEventListener('keydown', this.#keyboardHandler);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Value update
    if (name === 'value') {
      this.value = newValue;
    }
    // General update
    else {
      this.value = this.value;
    }
  }

  #focusHandler = (event) => {
    if (event.target.dataset.thumb === undefined) return; // Skip element itself (keyboard support)
    this.#thumbIndex = Number(event.target.dataset.thumb);
  };

  #startHandler = (event) => {
    if (this.disabled) return;

    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this.#moveHandler);
    window.addEventListener('pointerup', this.#endHandler);
    window.addEventListener('pointercancel', this.#endHandler);

    // Update value change reference
    this.#startValue = this.value;

    // Thumb click
    if (event.target.dataset.thumb !== undefined) {
      this.#thumbIndex = Number(event.target.dataset.thumb);
    }
    // Track click
    else {
      const { offsetX, offsetY } = event;
      this.#thumbIndex = this.#getClosestThumb(this.#isVertical ? offsetY : offsetX);
      this.#mirrorValue(this.#isVertical ? offsetY : offsetX);
    }
  };

  #moveHandler = (event) => {
    if (event.target !== this) return; // Limit event.offsetX/Y to self to avoid incorrect calculations
    event.preventDefault(); // Prevent text selection (Safari)
    this.#mirrorValue(this.#isVertical ? event.offsetY : event.offsetX);
  };

  #endHandler = (event) => {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this.#moveHandler);
    window.removeEventListener('pointerup', this.#endHandler);
    window.removeEventListener('pointercancel', this.#endHandler);

    // Trigger change event
    if (this.#startValue !== this.value) {
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  #keyboardHandler = (event) => {
    const actionKeys = Object.keys(KEY_CODE_ACTIONS);
    const action = actionKeys.find((type) => KEY_CODE_ACTIONS[type].includes(event.code) && type);

    if (document.activeElement !== this.#thumbs[this.#thumbIndex]) {
      this.#thumbs[this.#thumbIndex].focus({ focusVisible: false });
    }

    if (action) {
      event.preventDefault();
      this[action]();
    }
  };

  /**
   *
   * @param {number} offset
   */
  #mirrorValue = (offset) => {
    const safeOffset = Math.min(Math.max(offset, 0), this.#size);
    const percent = safeOffset / this.#size;
    const computedValue = this.#getValueFromPercent(this.#isRTL ? 1 - percent : percent);
    this.#updateValue(this.#thumbIndex, computedValue, ['input']);
  };

  #getDefaultValue() {
    return this.max < this.min ? this.min : this.min + (this.max - this.min) / 2;
  }

  /**
   *
   * @param {number} value
   * @returns
   */
  #getPercentFromValue(value) {
    return (100 * (value - this.min)) / (this.max - this.min);
  }

  /**
   * Fit the percentage complete between the range [min,max]
   * by remapping from [0, 1] to [min, min+(max-min)].
   *
   * @param {number} percent
   * @returns
   */
  #getValueFromPercent(percent) {
    return this.min + percent * (this.max - this.min);
  }

  /**
   *
   * @param {number} offset
   * @returns
   */
  #getClosestThumb(offset) {
    let closestThumb;
    const safeOffset = Math.min(Math.max(offset, 0), this.#size);
    const percent = safeOffset / this.#size;
    const value = this.#getValueFromPercent(this.#isRTL ? 1 - percent : percent);

    // First thumb position from the "end"
    const index = this.#value.findIndex((v) => value - v < 0);

    // Pick the first one
    if (index === 0) {
      closestThumb = index;
    }
    // Pick the last one (position is past all the thumbs)
    else if (index === -1) {
      closestThumb = this.#value.length - 1;
    } else {
      const lastStart = this.#value[index - 1];
      const firstEnd = this.#value[index];
      // Pick the first one from the "start" unless they are stacked on top of each other
      if (Math.abs(lastStart - value) < Math.abs(firstEnd - value)) {
        closestThumb = index - 1;
      }
      // Pick the last one from the "end"
      else {
        closestThumb = index;
      }
    }

    return closestThumb;
  }

  /**
   *
   * @param {number} index
   * @param {number} value
   * @param {string[]} dispatchEvents
   */
  #updateValue(index, value, dispatchEvents = []) {
    const oldValue = this.#value[index];
    const valuePrecision = Number(this.valuePrecision) || getPrescision(this.step) || 0;

    let thumbMinValue = this.#value[index - 1] || this.min;
    let thumbMaxValue = this.#value[index + 1] || this.max;

    // Avoid thumbs with equal values
    if (this.#isMultiThumb && this.minStepsBetweenThumbs) {
      // Skip first thumb
      if (index > 0) {
        thumbMinValue = thumbMinValue + this.minStepsBetweenThumbs * this.step;
      }
      // Skip last thumb
      if (index < this.#thumbs.length - 1) {
        thumbMaxValue = thumbMaxValue - this.minStepsBetweenThumbs * this.step;
      }
    }

    // Thumb min, max constrain
    const safeValue = Math.min(Math.max(value, thumbMinValue), thumbMaxValue);

    // Rounding in steps
    const nearestValue = Math.round(safeValue / this.step) * this.step;

    // Value precision
    const newValue = Number(
      valuePrecision ? nearestValue.toFixed(valuePrecision) : Math.round(nearestValue),
    );

    if (oldValue !== newValue) {
      this.#value[index] = newValue;
      this.#valuePercent[index] = this.#getPercentFromValue(newValue);
      this.#internals.setFormValue(this.#value.join(','));
      this.#updateThumb(index, newValue);
      this.#updateTrackFill();
      dispatchEvents.map((event) => {
        this.dispatchEvent(new Event(event, { bubbles: true }));
      });
    }
  }

  /**
   *
   * @param {number} index
   * @param {number} value
   */
  #updateThumb(index, value) {
    if (!this.#thumbs[index]) return;
    this.#thumbs[index].style.setProperty(
      `inset-${this.#isVertical ? 'block' : 'inline'}-${this.#isVertical ? 'end' : 'start'}`,
      `${this.#getPercentFromValue(value)}%`,
    );
    setAriaAttribute(this.#thumbs[index], 'value', value);
  }

  #updateTrackFill() {
    if (!this.#trackFill) return;
    const trackFillStart = this.#isMultiThumb ? `${this.#valuePercent[0]}%` : 0;
    const trackFillEnd = this.#isMultiThumb
      ? `${100 - this.#valuePercent[this.#valuePercent.length - 1]}%`
      : `${100 - this.#valuePercent[0]}%`;
    // Ensure thumb always covers the fill
    const trackFillEndClamp = `clamp(var(--thumb-size) / 2, ${trackFillEnd}, 100% - var(--thumb-size) / 2)`;

    this.#trackFill.style.setProperty(
      `inset-${this.#isVertical ? 'block' : 'inline'}`,
      this.#isVertical
        ? `${trackFillEndClamp} ${trackFillStart}`
        : `${trackFillStart} ${trackFillEndClamp}`,
    );
  }

  /**
   * Increments the value
   * @param {number} amount - The amount to increment by.
   */
  stepUp(amount = this.step) {
    const newValue = this.#value[this.#thumbIndex] + amount;
    this.#updateValue(this.#thumbIndex, newValue, ['change']);
  }

  /**
   * Decrements the value
   * @param {number} amount - The amount to decrement by.
   */
  stepDown(amount = this.step) {
    const newValue = this.#value[this.#thumbIndex] - amount;
    this.#updateValue(this.#thumbIndex, newValue, ['change']);
  }
}

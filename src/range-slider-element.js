const REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled', 'value-precision'];

const ARIA_ATTRIBUTES = {
  value: 'valuenow',
  min: 'valuemin',
  max: 'valuemax',
};

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <div data-track></div>
  <div data-track-fill></div>
  <div data-runnable-track>
    <div data-thumb></div>
  </div>
`;

export default class RangeSliderElement extends HTMLElement {
  static observedAttributes = REFLECTED_ATTRIBUTES;

  // Identify as form-associated custom element
  static formAssociated = true;

  #internals;
  #value;

  #isVertical = this.getAttribute('orientation') === 'vertical';
  #isRTL = this.#isVertical || this.getAttribute('dir') === 'rtl';

  constructor() {
    super();
    // Get access to the internal form control APIs
    this.#internals = this.attachInternals();

    // Set initial value
    this.value = this.getAttribute('value') || this.#getComputedValue();

    // Enable focus
    !this.disabled && this.setAttribute('tabindex', '0');

    // Set aria attributes
    this.setAttribute('role', 'slider');
    setAriaAttribute(this, 'value', this.value);
    setAriaAttribute(this, 'min', this.min);
    setAriaAttribute(this, 'max', this.max);

    if (!this.firstChild) {
      this.append(TEMPLATE.content.cloneNode(true));
    }
  }

  get min() {
    return this.getAttribute('min') || '0';
  }
  get max() {
    return this.getAttribute('max') || '100';
  }
  get step() {
    return this.getAttribute('step') || '1';
  }
  get value() {
    return this.#value;
  }
  get disabled() {
    return this.getAttribute('disabled') === '' || false;
  }
  get valuePrecision() {
    return this.getAttribute('value-precision') || '';
  }

  set min(min) {
    this.setAttribute('min', min);
  }
  set max(max) {
    this.setAttribute('max', max);
  }
  set step(step) {
    this.setAttribute('step', step);
  }
  set value(value) {
    this.#value = this.#getSaveValue(value);
    this.#internals.setFormValue(this.#value);
    this.#update();
  }
  set disabled(disabled) {
    if (disabled) {
      this.setAttribute('disabled', '');
      this.removeAttribute('tabindex');
    } else {
      this.removeAttribute('disabled');
      this.setAttribute('tabindex', 0);
    }
  }
  set valuePrecision(precision) {
    this.setAttribute('value-precision', precision);
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
    this.addEventListener('pointerdown', this.#startHandler);
    this.addEventListener('keydown', this.#keyCodeHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('pointerdown', this.#startHandler);
    this.removeEventListener('keydown', this.#keyCodeHandler);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.#update();
    setAriaAttribute(this, name, newValue);
  }

  #startHandler = (event) => {
    if (this.disabled) return;

    event.stopPropagation();

    // Click and drag
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this.#moveHandler);
    window.addEventListener('pointerup', this.#endHandler);
    window.addEventListener('pointercancel', this.#endHandler);

    // Click jump (ignore thumb clicks)
    if (event.target?.dataset?.thumb !== undefined) return;
    this.#reflectValue(event);
  };

  #moveHandler = (event) => {
    this.#reflectValue(event);
  };

  #endHandler = (event) => {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this.#moveHandler);
    window.removeEventListener('pointerup', this.#endHandler);
    window.removeEventListener('pointercancel', this.#endHandler);

    // TODO: check if value changed
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  #keyCodeHandler = (event) => {
    const code = event.code;
    const up = ['ArrowUp', 'ArrowRight'].includes(code);
    const down = ['ArrowDown', 'ArrowLeft'].includes(code);
    if (up) {
      event.preventDefault();
      this.stepUp();
    } else if (down) {
      event.preventDefault();
      this.stepDown();
    }
  };

  #reflectValue = (event) => {
    const isVertical = Boolean(this.#isVertical);
    const isRTL = Boolean(this.#isRTL);
    const min = Number(this.min);
    const max = Number(this.max);
    const oldValue = this.value;
    const fullSize = isVertical ? this.offsetHeight : this.offsetWidth;
    const offset = Math.min(Math.max(isVertical ? event.offsetY : event.offsetX, 0), fullSize);
    const percentage = offset / fullSize;
    const percentageComplete = isRTL ? 1 - percentage : percentage;

    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    const computedValue = min + percentageComplete * (max - min);

    // Constrain value
    const newValue = this.#constrainValue(computedValue);

    if (oldValue !== newValue) {
      this.value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true }));
      setAriaAttribute(this, 'value', this.value);
    }
  };

  #update() {
    const min = Number(this.min);
    const max = Number(this.max);
    const value = Number(this.value);
    const percentage = (100 * (value - min)) / (max - min);
    this.style.setProperty('--value-percentage', `${percentage}%`);
  }

  #constrainValue(value) {
    const step = Number(this.step);
    const valuePrecision = Number(this.valuePrecision) || getPrescision(this.step) || 0;

    // min, max constrain
    const saveValue = this.#getSaveValue(value);

    // Rounding in steps
    const nearestValue = Math.round(saveValue / step) * step;

    // Value precision
    const newValue = valuePrecision
      ? nearestValue.toFixed(valuePrecision)
      : Math.round(nearestValue).toString();

    return newValue;
  }

  #getComputedValue() {
    const min = Number(this.min);
    const max = Number(this.max);
    return String(max < min ? min : min + (max - min) / 2);
  }

  #getSaveValue(value) {
    const min = Number(this.min);
    const max = Number(this.max);
    return Math.min(Math.max(value, min), max);
  }

  stepUp(amount = this.step) {
    const oldValue = Number(this.value);
    const newValue = this.#constrainValue(oldValue + Number(amount));
    if (oldValue !== newValue) {
      this.value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  stepDown(amount = this.step) {
    const oldValue = Number(this.value);
    const newValue = this.#constrainValue(oldValue - Number(amount));
    if (oldValue !== newValue) {
      this.value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

function getPrescision(value = '') {
  const afterDecimal = value.split('.')[1];
  return afterDecimal ? afterDecimal.length : 0;
}

function setAriaAttribute(element, name, value) {
  const attributeName = ARIA_ATTRIBUTES[name];
  if (!attributeName) return;
  element.setAttribute(`aria-${attributeName}`, value);
}

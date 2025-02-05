const REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled', 'value-precision'];

const ARIA_ATTRIBUTES = {
  value: 'valuenow',
  min: 'valuemin',
  max: 'valuemax',
};

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <div data-track></div>
  <div data-thumb></div>
`;

class RangeSliderElement extends HTMLElement {
  constructor() {
    super();
    this._isVertical = this.getAttribute('orientation') === 'vertical';
    this._isRTL = this._isVertical || this.getAttribute('dir') === 'rtl';
    this._defaultValue = this.value;

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

  static get observedAttributes() {
    return REFLECTED_ATTRIBUTES;
  }

  get _computedValue() {
    const min = Number(this.min);
    const max = Number(this.max);
    return String(max < min ? min : min + (max - min) / 2);
  }

  get min() { return this.getAttribute('min') || '0'; }
  get max() { return this.getAttribute('max') || '100'; }
  get step() { return this.getAttribute('step') || '1'; }
  get value() { return this.getAttribute('value') || this._computedValue; }
  get disabled() { return this.getAttribute('disabled') === '' || false; }
  get valuePrecision() { return this.getAttribute('value-precision') || ''; }
  get defaultValue() { return this._defaultValue; }

  set min(min) { this.setAttribute('min', min); }
  set max(max) { this.setAttribute('max', max); }
  set step(step) { this.setAttribute('step', step); }
  set value(value) { this.setAttribute('value', value); }
  set disabled(disabled) {
    if (disabled) {
      this.setAttribute('disabled', '');
      this.removeAttribute('tabindex');
    } else {
      this.removeAttribute('disabled');
      this.setAttribute('tabindex', 0);
    }
  }
  set valuePrecision(precision) { this.setAttribute('value-precision', precision); }
  set defaultValue(value) { this._defaultValue = value; }

  connectedCallback() {
    this.addEventListener('pointerdown', this._startHandler, false);
    this.addEventListener('pointerup', this._endHandler, false);
    this.addEventListener('keydown', this._keyCodeHandler, false);
    this._update();
  }

  disconnectedCallback() {
    this.removeEventListener('pointerdown', this._startHandler, false);
    this.removeEventListener('pointerup', this._endHandler, false);
    this.removeEventListener('keydown', this._keyCodeHandler, false);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._update();
    setAriaAttribute(this, name, newValue);
  }

  _startHandler = e => {
    if (this.disabled) return;

    // Click and drag
    this.setPointerCapture(e.pointerId);
    this.addEventListener('pointermove', this._moveHandler, false);

    // Click jump (ignore thumb clicks)
    if (e.target?.dataset?.thumb !== undefined) return;
    this._reflectValue(e);
  }

  _moveHandler = e => {
    this._reflectValue(e);
  }

  _endHandler = e => {
    this.releasePointerCapture(e.pointerId);
    this.removeEventListener('pointermove', this._moveHandler, false);

    // TODO: check if value changed
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  _keyCodeHandler = e => {
    const code = e.code;
    const up = ['ArrowUp', 'ArrowRight'].includes(code);
    const down = ['ArrowDown', 'ArrowLeft'].includes(code);

    if (up) {
      e.preventDefault();
      this.stepUp();
    }
    else if (down) {
      e.preventDefault();
      this.stepDown();
    }
  }

  _reflectValue = e => {
    const isVertical = Boolean(this._isVertical);
    const isRTL = Boolean(this._isRTL);
    const min = Number(this.min);
    const max = Number(this.max);
    const oldValue = this.value;
    const fullSize = isVertical ? e.target.offsetHeight : e.target.offsetWidth;
    const offset = Math.min(Math.max(isVertical ? e.offsetY : e.offsetX, 0), fullSize);
    const percent = offset / fullSize;
    const percentComplete = isRTL ? 1 - percent : percent;

    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    const computedValue = min + percentComplete * (max - min);

    // Constrain value
    const newValue = this._constrainValue(computedValue);

    if (oldValue !== newValue) {
      this.value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  _constrainValue(value) {
    const min = Number(this.min);
    const max = Number(this.max);
    const step = Number(this.step);
    const valuePrecision = Number(this.valuePrecision) || getPrescision(this.step) || 0;

    // min, max constrain
    const saveValue = Math.min(Math.max(value, min), max);

    // Rounding in steps
    const nearestValue = Math.round(saveValue / step) * step;

    // Value precision
    const newValue = valuePrecision ? nearestValue.toFixed(valuePrecision) : Math.round(nearestValue).toString();

    return newValue;
  }

  _update() {
    const isRTL = Boolean(this._isRTL);
    const min = Number(this.min);
    const max = Number(this.max);
    const value = Number(this.value);
    const percent = (100 * (value - min)) / (max - min);
    const percentComplete = isRTL ? 100 - percent : percent;
    this.style.setProperty('--value-percentage', `${percentComplete}%`);
  }

  stepUp(amount = this.step) {
    const oldValue = Number(this.value);
    const newValue = this._constrainValue(oldValue + Number(amount));
    if (oldValue !== newValue) {
      this.value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  stepDown(amount = this.step) {
    const oldValue = Number(this.value);
    const newValue = this._constrainValue(oldValue - Number(amount));
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

export default RangeSliderElement;

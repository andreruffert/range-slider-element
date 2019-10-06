import * as style from './styles.css';

const UPDATE_EVENTS = ['input', 'change'];
const REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled', 'value-precision'];

const ARIA_ATTRIBUTES = {
  value: 'valuenow',
  min: 'valuemin',
  max: 'valuemax',
};

const TEMPLATE = `
  <div class="thumb-wrapper">
    <div class="thumb"></div>
  </div>
`;

class RangeSliderElement extends HTMLElement {
  constructor() {
    super();
    this._ignoreChange = false;

    // Aria attributes
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'slider');
    setAriaAttribute(this, 'value', this.value);
    setAriaAttribute(this, 'min', this.min);
    setAriaAttribute(this, 'max', this.max);
  }

  static get observedAttributes() {
    return REFLECTED_ATTRIBUTES;
  }

  get _defaultValue() {
    const min = Number(this.min);
    const max = Number(this.max);
    return String(max < min ? min : min + (max - min) / 2);
  }

  get min() { return this.getAttribute('min') || '0'; }
  get max() { return this.getAttribute('max') || '100'; }
  get step() { return this.getAttribute('step') || '1'; }
  get value() { return this.getAttribute('value') || this._defaultValue; }
  get disabled() { return this.getAttribute('disabled') || false }
  get valuePrecision() { return this.getAttribute('value-precision') || ''; }

  set min(min) { this.setAttribute('min', min); }
  set max(max) { this.setAttribute('max', max); }
  set step(step) { this.setAttribute('step', step); }
  set value(value) { this.setAttribute('value', value); }
  set disabled(disabled) { this.setAttribute('disabled', disabled); }
  set valuePrecision(precision) { this.setAttribute('value-precision', precision); }

  connectedCallback() {
    if (!this.firstChild) {
      this.innerHTML = TEMPLATE;
    }

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
    if (oldValue === newValue || this._ignoreChange) return;
    this._update();
    setAriaAttribute(this, name, newValue);
  }

  _startHandler = e => {
    this.classList.add('touch-active');
    this.focus();
    // Click and drag
    this.setPointerCapture(e.pointerId);
    this.addEventListener('pointermove', this._moveHandler, false);

    // Click jump
    if (!e.target.matches('.thumb')) {
      this._reflectValue(e);
    }
  }

  _moveHandler = e => {
    this._reflectValue(e);
  }

  _endHandler = e => {
    // alert(e.type);
    this.classList.remove('touch-active');
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

  _reflectValue = event => {
    const min = Number(this.min);
    const max = Number(this.max);
    const step = Number(this.step);
    const oldValue = this.value;
    const valuePrecision = Number(this.valuePrecision) || getPrescision(this.step) || 0;
    const fullWidth = event.target.offsetWidth;
    const offsetX = Math.min(Math.max(event.offsetX, 0), fullWidth);
    const percentComplete = offsetX / fullWidth;

    // TODO: RTL support
    // if (this.adapter_.isRTL()) {
    //   percentComplete = 1 - percentComplete;
    // }

    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    const computedValue = min + percentComplete * (max - min);

    // Rounding in steps
    const nearestValue = Math.round(computedValue / step) * step;

    // Value precision
    const newValue = valuePrecision ? nearestValue.toFixed(valuePrecision) : Math.round(nearestValue).toString();

    // console.log({ fullWidth, offsetX, oldValue, computedValue, newValue});

    if (oldValue !== newValue) {
      this.value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  _constrainValue(value) {
    const min = Number(this.min);
    const max = Number(this.max);
    return Math.min(Math.max(value, min), max);
  }

  _update() {
    const min = Number(this.min);
    const max = Number(this.max);
    const value = Number(this.value);
    const percent = (100 * (value - min)) / (max - min);

    console.log('update', { value });

    this.style.setProperty('--value-percent', percent + '%');
    this.style.setProperty('--value-width', '' + this.value.length);
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

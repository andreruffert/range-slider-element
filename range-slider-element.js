import * as style from './styles.css';

const UPDATE_EVENTS = ['input', 'change'];
const REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled'];

class RangeSliderElement extends HTMLElement {
  constructor() {
    super();
    this._ignoreChange = false;
    // this._shadowRoot = this.attachShadow({ mode: 'open' });
    // this._shadowRoot.innerHTML = '<div class="wrapper"></div>';
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
  get valuePrecision() { return this.getAttribute('label-precision') || ''; }

  set min(min) { this.setAttribute('min', min); }
  set max(max) { this.setAttribute('max', max); }
  set step(step) { this.setAttribute('step', step); }
  set value(value) { this.setAttribute('value', value); }
  set valuePrecision(precision) { this.setAttribute('label-precision', precision); }

  connectedCallback() {
    if (this.firstChild) return;

    this.addEventListener('pointerdown', this._startHandler, false);
    this.addEventListener('pointerup', this._endHandler, false);

    this.innerHTML = `
      <div class="thumb-wrapper">
        <div class="thumb"></div>
        <div class="value-display"></div>
      </div>
    `;

    this._valueDisplay = this.querySelector('.value-display');
    this._update();
  }

  disconnectedCallback() {
    this.removeEventListener('pointerdown', this._startHandler, false);
    this.removeEventListener('pointerup', this._endHandler, false);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._ignoreChange) return;
    this._update();
  }

  _startHandler = e => {
    this.setPointerCapture(e.pointerId);
    this.addEventListener('pointermove', this._moveHandler, false);
    this.classList.add('touch-active');

    console.log(e);
    if (e.target.matches('.thumb')) return;
    this._reflectValue(e);
  }

  _moveHandler = e => {
    // e.preventDefault();
    this._reflectValue(e);
  }

  _endHandler = e => {
    this.releasePointerCapture(e.pointerId);
    this.removeEventListener('pointermove', this._moveHandler, false);
    this.classList.remove('touch-active');

    // TODO: check if value changed
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  _reflectValue = event => {
    const min = Number(this.min);
    const max = Number(this.max);
    const step = Number(this.step);
    const oldValue = Number(this.value);
    const valuePrecision = Number(this.valuePrecision) || getPrescision(this.step) || 0;
    const fullWidth = event.target.offsetWidth;
    const offsetX = event.offsetX;
    const stepInPixels = (max > 0) ? fullWidth / max : fullWidth / min;
    const tmpValue = Math.min(Math.max(offsetX / stepInPixels, min), max);
    const nearestValue = Math.ceil(tmpValue / step) * step; // Rounding in steps
    const newValue = valuePrecision
      ? nearestValue.toFixed(valuePrecision)
      : Math.round(nearestValue).toString()
    ;

    console.log({ fullWidth, offsetX, stepInPixels, oldValue, newValue});

    if (oldValue !== newValue) {
      this.value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  _update() {
    const min = Number(this.min);
    const max = Number(this.max);
    const value = Number(this.value);
    const percent = (max > 0) ? (100 * (value - min)) / (max - min) : (100 * (value - max)) / (min - max);

    if (this._valueDisplay) {
      this._valueDisplay.textContent = value;
    }

    this.style.setProperty('--value-percent', percent + '%');
    this.style.setProperty('--value-width', '' + this.value.length);
  }
}

function getPrescision(value = '') {
  const afterDecimal = value.split('.')[1];
  return afterDecimal ? afterDecimal.length : 0;
}

export default RangeSliderElement;

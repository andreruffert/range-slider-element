import * as style from './styles.css';

const UPDATE_EVENTS = ['input', 'change'];
const REFLECTED_ATTRIBUTES = ['name', 'min', 'max', 'step', 'value', 'disabled'];

class RangeSliderElement extends HTMLElement {
  constructor() {
    super();
    this._ignoreChange = false;
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
  get labelPrecision() { return this.getAttribute('label-precision') || ''; }

  set min(min) { this.setAttribute('min', min); }
  set max(max) { this.setAttribute('max', max); }
  set step(step) { this.setAttribute('step', step); }
  set value(value) { this.setAttribute('value', value); }
  set labelPrecision(precision) { this.setAttribute('label-precision', precision); }

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
    this._reflectValue(e);
  }

  _moveHandler = e => {
    this._reflectValue(e);
  }

  _endHandler = e => {
    this.releasePointerCapture(e.pointerId);
    this.removeEventListener('pointermove', this._moveHandler, false);
    this.classList.remove('touch-active');
  }

  _reflectValue(event) {
    const min = Number(this.min);
    const max = Number(this.max);
    const step = Number(this.step);
    const oldValue = Number(this.value);
    const fullWidth = event.target.offsetWidth;
    const offsetX = Math.round(Math.min(Math.max(event.offsetX, 0), fullWidth));
    const percentage = offsetX / fullWidth;
    const newValue = (step * Math.round((percentage * (this.max - this.min)) / this.step) + this.min) / 10;

    console.log({offsetX, newValue, oldValue});

    if (oldValue !== newValue) {
      this.value = newValue;
    }
  }

  _update() {
    const min = Number(this.min);
    const max = Number(this.max);
    const value = Number(this.value);
    const labelPrecision = Number(this.labelPrecision) || getPrescision(this.step) || 0;
    const percent = (100 * (value - min)) / (max - min);
    const displayValue = labelPrecision ? value.toFixed(labelPrecision) : Math.round(value).toString();

    if (this._valueDisplay) {
      this._valueDisplay.textContent = displayValue;
    }

    this.style.setProperty('--value-percent', percent + '%');
    this.style.setProperty('--value-width', '' + displayValue.length);
  }
}

function getPrescision(value = '') {
  const afterDecimal = value.split('.')[1];
  return afterDecimal ? afterDecimal.length : 0;
}

export default RangeSliderElement;

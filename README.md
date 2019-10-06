# &lt;range-slider&gt; element

> A custom element drop in replacement for the input type range element.   

[![npm version](https://img.shields.io/npm/v/range-slider-element.svg)](https://www.npmjs.com/package/range-slider-element)

Accessible range slider custom element with keyboard support.
Follows the [ARIA best practices guide on sliders](https://www.w3.org/TR/wai-aria-practices/#slider).

* No dependencies
* Customizable styling
* Keyboard accessible

## Install

```console
$ npm install range-slider-element
```


## Usage

```js
import 'range-slider-element';
```

```html
<range-slider min="0" max="100" step="1"></range-slider>
```


## Events

### `input`

The `input` event gets fired from the `<range-slider>` element when the value updates.

This event bubbles, and can be canceled.

```js
document.addEventListener('input', event => {
  event.preventDefault();
});
```


## License

MIT © [André Ruffert](https://andreruffert.com)

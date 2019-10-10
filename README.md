# &lt;range-slider&gt; element

> A custom range slider element.

[![CI status](https://github.com/andreruffert/range-slider-element/workflows/CI/badge.svg)](https://github.com/andreruffert/range-slider-element/actions?workflow=CI)
[![npm version](https://img.shields.io/npm/v/range-slider-element.svg)](https://www.npmjs.com/package/range-slider-element)

Accessible range slider custom element with keyboard support.        
Follows the [ARIA best practices guide on sliders](https://www.w3.org/TR/wai-aria-practices/#slider).

* No dependencies
* Customizable styling
* Keyboard accessible

<div align="center">
  <br>
  <br>
  <img src="https://user-images.githubusercontent.com/464300/66577218-443e1400-eb79-11e9-9e66-a8b62bbc97ba.png" alt="range slider element preview example" width="300">
  <br>
  <br>
</div>


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


### Styling

Exposed CSS custom properties scoped within the `range-slider` element.

* `--value-percent` - The current value in percentage, e.g. 50%

```css
range-slider {}
range-slider .thumb-wrapper {}
range-slider .thumb {}
```


### Events

* `input` - Pointer move, value updated. Bubbles.
* `change` - Pointer up, value updated. Bubbles.




## Browser support

Browsers without native [custom element support][support] require a [polyfill][].

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/custom-elements


## License

MIT © [André Ruffert](https://andreruffert.com)

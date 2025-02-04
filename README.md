# &lt;range-slider&gt; element

> A cross browser customizable range slider element.

[![CI status](https://github.com/andreruffert/range-slider-element/workflows/CI/badge.svg)](https://github.com/andreruffert/range-slider-element/actions?workflow=CI)
[![npm version](https://img.shields.io/npm/v/range-slider-element.svg)](https://www.npmjs.com/package/range-slider-element)
[![npm downloads](https://img.shields.io/npm/dm/range-slider-element?logo=npm)](https://www.npmjs.com/package/range-slider-element)

Accessible range slider custom element with keyboard support.        
Follows the [ARIA best practices guide on sliders](https://www.w3.org/TR/wai-aria-practices/#slider).

* No dependencies
* Customizable styling
* Touchscreen friendly
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

### Attributes

* `min` The minimum permitted value. The default is 0.
* `max` The maximum permitted value. The default is 100.
* `step` The stepping interval. The default is 1.
* `value` The value. The default is `min + (max - min) / 2`.
* [`dir`][dir] Directionality. The default is ltr.

[dir]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir

### Styling

Exposed CSS custom properties scoped within the `range-slider` element.

* `--value-percentage` - The current value in percentage, e.g. 50%

```css
range-slider {}
range-slider:active {}
range-slider:focus {}
range-slider [data-track] {}
range-slider [data-thumb] {}
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

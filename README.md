# &lt;range-slider&gt; element

> A custom range slider element.

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

### Events

* `input` - Pointer move, value updated. Bubbles.
* `change` - Pointer up, value updated. Bubbles.


## Browser support

Browsers without native [custom element support][support] require a [polyfill][].

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/custom-elements


## License

MIT © [André Ruffert](https://andreruffert.com)

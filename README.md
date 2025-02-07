# &lt;range-slider&gt; element

> A cross browser customizable range slider element.

[![Test status](https://github.com/andreruffert/range-slider-element/actions/workflows/test.yml/badge.svg)](https://github.com/andreruffert/range-slider-element/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/range-slider-element.svg)](https://www.npmjs.com/package/range-slider-element)
[![npm downloads](https://img.shields.io/npm/dm/range-slider-element?logo=npm)](https://www.npmjs.com/package/range-slider-element)

Accessible range slider custom element with keyboard support.        
Follows the [ARIA best practices guide on sliders](https://www.w3.org/TR/wai-aria-practices/#slider).

* No dependencies
* Customizable styling
* Touchscreen friendly
* Keyboard accessible
* Form data support

<div align="center">
  <br>
  <br>
  <img src="https://user-images.githubusercontent.com/464300/66577218-443e1400-eb79-11e9-9e66-a8b62bbc97ba.png" alt="range slider element preview example" width="300">
  <br>
  <br>
</div>

## Install

```shell
npm install range-slider-element
```

## Usage

Make sure to load the base styles exported via `range-slider-element.css`.

```js
import 'range-slider-element';
```

Or via CDN

```html
<link rel="stylesheet" href="https://unpkg.com/range-slider-element@latest/dist/range-slider-element.css">
<script type="module" src="https://unpkg.com/range-slider-element@latest/dist/range-slider-element.js"></script>
```

HTML

```html
<range-slider min="0" max="100" step="1"></range-slider>
```

### Attributes

* `min` The minimum permitted value. The default is `0`.
* `max` The maximum permitted value. The default is `100`.
* `step` The stepping interval. The default is `1`.
* `value` The value. The default is `min + (max - min) / 2`.
* [`dir`][dir] Directionality. The default is ltr. Allowed options `rtl`.
* `orientation` The default is horizontal. Allowed options `vertical`.

[dir]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir

### Styling

#### CSS custom properties

Exposed CSS custom properties scoped within the `range-slider` element.

* `--track-size` - The track size. The default is `0.3em`. Can be overwritten for customization.
* `--thumb-size` - The thumb size. The default is `1em`. Can be overwritten for customization.
* `--value-percentage` - The current value in percentage, e.g. `50%`. Will be updated via JS.

Advanced customization

* `--track-fill-clamp` - The track fill size. The default is `clamp(0% + var(--thumb-size) / 2, var(--value-percentage, 0%), 100% - var(--thumb-size) / 2)`.

#### DOM selectors

```css
range-slider {}
range-slider [data-track] {}
range-slider [data-track-fill] {}
range-slider [data-thumb] {}

/* Advanced customization */
range-slider [data-runnable-track] {}
```

For examples of how to customize the default styling, see the [docs][docs].

[docs]: https://andreruffert.github.io/range-slider-element

### Events

* `input` - Pointer move, value updated. Bubbles.
* `change` - Pointer up, value updated. Bubbles.

## Browser support

Browsers without native [custom element support][support] require a [polyfill][].

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/custom-elements

## License

MIT © [André Ruffert](https://andreruffert.com)

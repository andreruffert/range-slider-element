# &lt;range-slider&gt; element

> A cross browser customizable and accessible &lt;range-slider&gt; web component.

[![Test status](https://img.shields.io/github/actions/workflow/status/andreruffert/range-slider-element/test.yml?label=Test&logo=github&color=4a46e0&labelColor=212121)](https://github.com/andreruffert/range-slider-element/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/range-slider-element?color=4a46e0&labelColor=212121)](https://www.npmjs.com/package/range-slider-element)
[![gzip size](https://img.shields.io/badge/gzip-2.5kB-4a46e0?labelColor=212121)](https://pkg-size.dev/range-slider-element)
[![npm downloads](https://img.shields.io/npm/dm/range-slider-element?logo=npm&color=4a46e0&labelColor=212121)](https://www.npmjs.com/package/range-slider-element)

## Features

* Framework agnostic [web component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (no dependencies)
* Cross browser customizable styling
* Single and multi thumb
* Horizontal and vertical orientations
* Works like a built-in HTML form element (uses [ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals))
* Keyboard accessible (use arrow keys)
* Touch friendly
* Follows the [ARIA best practices guide on sliders](https://www.w3.org/WAI/ARIA/apg/patterns/slider)

## Install

Install via npm

```shell
npm install range-slider-element
```

## Usage

### JavaScript

Import as ES module

```js
import 'range-slider-element';
```

Or via CDN

```html
<script type="module" src="https://unpkg.com/range-slider-element@latest/dist/range-slider-element.js"></script>
```

### HTML

```html
<range-slider min="0" max="100" step="1" value="50"></range-slider>
```

### CSS

Make sure to load the base styles exported via `range-slider-element/style.css`.

Or via CDN

```html
<link rel="stylesheet" href="https://unpkg.com/range-slider-element@latest/dist/range-slider-element.css">
```

## Attributes

* `min` The minimum permitted value. The default is `0`.
* `max` The maximum permitted value. The default is `100`.
* `step` The stepping interval. The default is `1`.
* `value` The value. The default is `min + (max - min) / 2`.
* [`dir`][dir] Directionality. The default is ltr. Allowed options `rtl`.
* `orientation` The default is horizontal. Allowed options `vertical`.

[dir]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir

## Styling

**CSS custom properties**

Exposed CSS custom properties scoped within the `range-slider` element.

* `--track-size` - The track size. The default is `0.2rem`. Can be overwritten for customization.
* `--thumb-size` - The thumb size. The default is `1.2rem`. Can be overwritten for customization.

**DOM selectors**

```css
range-slider {}
range-slider [data-track] {}
range-slider [data-track-fill] {}
range-slider [data-thumb] {}

/* Advanced customization */
range-slider [data-runnable-track] {}
```

For examples of how to customize the default styling, check out the [docs][docs].

[docs]: https://andreruffert.github.io/range-slider-element

## Events

* `input` - Pointer move, value changed. Bubbles.
* `change` - Pointer up, key up, value changed. Bubbles.

## Browser support

Browsers without native [custom element support][support] require a [polyfill][].

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/custom-elements

## License

Distributed under the MIT license. See LICENSE for details. 

© [André Ruffert](https://andreruffert.com)

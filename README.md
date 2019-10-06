# &lt;range-slider&gt; element

> A custom element drop in replacement for the input type range element.

Accessible range slider custom element with keyboard support. Follows the [ARIA best practices guide on sliders](https://www.w3.org/TR/wai-aria-practices/#slider).

## Usage

```html
<range-slider min="0" max="100" step="1" value="50" dir="ltr" value-precision="0"></range-slider>
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

# [2.0.0](https://github.com/andreruffert/range-slider-element/compare/v1.1.0...v2.0.0) (2025-03-02)

### Features

- Multi thumb support
- Vertical orientation support
- HTML form support


### Breaking changes

* **CSS custom properties** scoped under the range-slider element
  ```diff
  - --value-percent 
  - --element-height
  - --track-height

  /* The track size based on the orientation */
  + --track-size
  ```
  With v2 the value percent is automatically applied to the track fill and thumbs.

* **DOM selectors**
  
  Track/-fill
  ```diff
  - range-slider::before {}
  
  + range-slider [data-track] {}
  + range-slider [data-track-fill] {}
  ```

  ```diff
  - range-slider .thumb-wrapper {}

  /* Advanced customization */
  + range-slider [data-runnable-track]
  ```

  Thumb
  ```diff
  - range-slider .thumb {}
  
  + range-slider [data-thumb] {}
  ```

  Focus state
  ```diff
  - range-slider:focus .thumb {}
  
  + range-slider [data-thumb]:focus {}
  ```
  Instead of the element itself, the thumb is focusable.

  Active state
  ```diff
  - range-slider.touch-active .thumb-wrapper .thumb {}
  
  + range-slider thumb:active {}
  ````


### Bug fixes

* Fix disabled state
* Fix rtl direction track fill



# [1.1.0](https://github.com/andreruffert/range-slider-element/compare/v1.0.0...v1.1.0) (2021-05-28)


### Features

* **perf:** parse html template only once ([36a769a](https://github.com/andreruffert/range-slider-element/commit/36a769a58d2b277d295de297107c4de808bfdae9))



# [1.0.0](https://github.com/andreruffert/range-slider-element/compare/593d4a4478bfb2d8ec272ca2ba2b98943400a861...v1.0.0) (2020-12-21)




## [2.1.1](https://github.com/andreruffert/range-slider-element/compare/v2.1.0-rc.0...v2.1.1) (2025-09-22)


### Bug Fixes

* Spec compliant step rounding to use min as step base ([98f01b5](https://github.com/andreruffert/range-slider-element/commit/98f01b5106c39399e9dbece03caa225c9d505d28))



# [2.1.0](https://github.com/andreruffert/range-slider-element/compare/v2.1.0-rc.0...v2.1.0) (2025-07-13)



# [2.1.0-rc.0](https://github.com/andreruffert/range-slider-element/compare/v2.0.0...v2.1.0-rc.0) (2025-06-15)


### Features

* allow opt-out of define() ([5fe0ca7](https://github.com/andreruffert/range-slider-element/commit/5fe0ca70e6f1f77bb388728839caaf779d9c055a))
* **dx:** introduce typescript types support ([3191744](https://github.com/andreruffert/range-slider-element/commit/3191744165bb949b96673459038ae07dbb7b0500))



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




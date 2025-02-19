const basic = `<range-slider aria-label="Choose a value"></range-slider>`;

const verticalOrientation = `<range-slider aria-label="Choose a value" orientation="vertical"></range-slider>`;

const rtlDir = `<range-slider aria-label="Choose a value" dir="rtl"></range-slider>`;

const dualThumb = `<range-slider value="10,40" name="price-range" aria-label="Choose your price range">
  <div data-track></div>
  <div data-track-fill></div>
  <div data-runnable-track>
    <div data-thumb aria-label="Minimum Price"></div>
    <div data-thumb aria-label="Maximum Price"></div>
  </div>
</range-slider>`;

const multiThumb = `<range-slider value="10,40,80" name="level-range" aria-label="Choose your range">
  <div data-track></div>
  <div data-track-fill></div>
  <div data-runnable-track>
    <div data-thumb aria-label="Level 1"></div>
    <div data-thumb aria-label="Level 2"></div>
    <div data-thumb aria-label="Level 3"></div>
  </div>
</range-slider>`;

export const examplePresets = {
  Basic: basic,
  'Vertical Orientation': verticalOrientation,
  'Right to Left Directionality': rtlDir,
  'Dual Thumb': dualThumb,
  'Multi Thumb': multiThumb,
};

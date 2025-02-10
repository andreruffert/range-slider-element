const DEFAULT_PROPERTIES = `--track-size: 0.2rem;
  --thumb-size: 1.2rem;`;

const DEFAULT_STYLES = `width: 100%;
  outline: 0;`;

const debug = `range-slider {
  ${DEFAULT_PROPERTIES}

  ${DEFAULT_STYLES}

  [data-runnable-track] {
    outline: 1px dotted;
  }

  [data-thumb] {
    opacity: 0.4;
  }
}`;

const example_1 = `range-slider {
  ${DEFAULT_PROPERTIES}

  ${DEFAULT_STYLES}

  [data-track] {
    background: #a3a8ff;
  }

  [data-track-fill] {
    background: #535bf2;
  }

  [data-thumb] {
    background: #535bf2;
    border: 2px solid white;
    transition: transform 200ms ease;
    will-change: transform;
  }

  &:active [data-thumb] {
    box-shadow: none;
    transform: scale(1.5);
  }

  &:focus [data-thumb] {
    outline: 0.2rem solid #636bff;
  }
}`;

const rangeslider_js = `range-slider {
  --track-size: .8em;
  --thumb-size: 2em;

  ${DEFAULT_STYLES}

  [data-track] {
    background: #e6e6e6;
    box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);
  }

  [data-track-fill] {
    background: lime;
    box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);
  }

  [data-thumb] {
    background: white linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1));
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
    border: 1px solid #ccc;
  }

  [data-thumb]:after {
    content: "";
    display: block;
    width: 18px;
    height: 18px;
    margin: auto;
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(0, 0, 0, 0.13), rgba(255, 255, 255, 0));
    border-radius: 100%;
  }

  &:active [data-thumb] {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.12));
  }
}`;

export const themes = {
  'Example 1': example_1,
  'rangeslider.js': rangeslider_js,
  Debug: debug,
};

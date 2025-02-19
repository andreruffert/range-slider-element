const DEFAULT_PROPERTIES = `--track-size: 0.2rem;
  --thumb-size: 1.2rem;`;

const DEFAULT_STYLES = `&:not([orientation="vertical"]) {
    inline-size: 100%;
  }`;

const _default = `range-slider {
  ${DEFAULT_PROPERTIES}

  border-radius: var(--track-size);
  margin: 2px;

  ${DEFAULT_STYLES}

  &:active {
    opacity: 0.8;
  }

  &[disabled] {
    filter: grayscale(1);
    opacity: 0.4;
  }

  [data-track] {
    background-color: lightgray;
    background-color: ButtonFace;
  }

  [data-track-fill] {
    background-color: #0075ff;
  }

  [data-thumb] {
    background-color: #0075ff;
    border-radius: 100%;
  }
}`;

const example1 = `range-slider {
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

  [data-thumb]:active {
    box-shadow: none;
    transform: scale(1.5);
  }

  [data-thumb]:focus {
    outline: 0.2rem solid #636bff;
  }
}`;

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

export const themePresets = {
  'Example 1': example1,
  Default: _default,
  Debug: debug,
};

import '../../index.js';

describe('element creation', function() {
  it('creates from document.createElement', function() {
    const el = document.createElement('range-slider');
    assert.equal('RANGE-SLIDER', el.nodeName);
    assert.isTrue(el instanceof window.RangeSliderElement);
  });

  it('creates from constructor', function() {
    const el = new window.RangeSliderElement();
    assert.equal('RANGE-SLIDER', el.nodeName);
  });
});

describe('properties', function() {
  it('fallback to default properties', function() {
    const el = document.createElement('range-slider');
    assert.equal(50, el.value, 'value');
    assert.equal(0, el.min , 'min');
    assert.equal(100, el.max, 'max');
    assert.equal(1, el.step, 'step');
  });
});

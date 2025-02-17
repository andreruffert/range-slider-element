import { expect, test } from 'vitest';
import '../src/index.js';

const render = (html) => {
  document.body.innerHTML = html;
};

test('default attributes', async () => {
  render('<range-slider></range-slider>');

  const element = document.querySelector('range-slider');
  const track = element.querySelector('[data-track]');
  const trackFill = element.querySelector('[data-track-fill]');
  const runnableTrack = element.querySelector('[data-runnable-track]');
  const thumb = runnableTrack.querySelector('[data-thumb]');

  await expect.element(element).toBeInTheDocument();
  await expect.element(track).toBeInTheDocument();
  await expect.element(trackFill).toBeInTheDocument();
  await expect.element(runnableTrack).toBeInTheDocument();
  await expect.element(thumb).toBeInTheDocument();

  expect(thumb).toHaveRole('slider');
  expect(thumb).toHaveAttribute('tabindex', '0');
  expect(thumb).toHaveAttribute('aria-valuenow', '50');
  expect(thumb).toHaveAttribute('aria-valuemin', '0');
  expect(thumb).toHaveAttribute('aria-valuemax', '100');
});

test('HTML form support', async () => {
  render('<form><range-slider name="range-slider"></range-slider></form>');

  const form = document.querySelector('form');
  const element = document.querySelector('range-slider');

  expect(form).toHaveFormValues({ 'range-slider': '50' });
  expect(element).toHaveValue('50');
});

test('programmatic value changes', async () => {
  render('<range-slider></range-slider>');

  const element = document.querySelector('range-slider');

  element.value = 20;
  expect(element).toHaveValue('20');

  element.setAttribute('value', 10);
  expect(element).toHaveValue('10');
});

test('disabled attribute', async () => {
  render('<range-slider disabled></range-slider>');

  const element = document.querySelector('range-slider');
  const thumb = element.querySelector('[data-runnable-track] [data-thumb]');
  expect(thumb).not.toHaveAttribute('tabindex', '0');

  // Programmatic change
  element.disabled = false;
  expect(thumb).toHaveAttribute('tabindex', '0');
});

test('multi thumb support', async () => {
  render(`<form>
    <range-slider value="10,40" name="price-range">
      <div data-track></div>
      <div data-track-fill></div>
      <div data-runnable-track>
        <div data-thumb aria-label="Minimum Price"></div>
        <div data-thumb aria-label="Maximum Price"></div>
      </div>
    </range-slider>
  </form>`);

  const form = document.querySelector('form');
  const element = document.querySelector('range-slider');
  const thumbs = element.querySelectorAll('[data-runnable-track] [data-thumb]');
  const thumb0 = thumbs[0];
  const thumb1 = thumbs[1];

  for (const thumb of thumbs) {
    expect(thumb).toHaveRole('slider');
    expect(thumb).toHaveAttribute('tabindex', '0');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
  }

  expect(thumb0).toHaveAttribute('aria-valuenow', '10');
  expect(thumb1).toHaveAttribute('aria-valuenow', '40');

  expect(element).toHaveValue('10,40');
  expect(form).toHaveFormValues({ 'price-range': '10,40' });
});

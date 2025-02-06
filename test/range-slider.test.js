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

  expect(element).toHaveAttribute('tabindex', '0');
  expect(element).toHaveRole('slider');
  expect(element).toHaveAttribute('aria-valuenow', '50');
  expect(element).toHaveAttribute('aria-valuemin', '0');
  expect(element).toHaveAttribute('aria-valuemax', '100');
  expect(element).toHaveStyle({ '--value-percentage': '50%' });
});

test('basic form data support', async () => {
  render('<form><range-slider name="range-slider"></range-slider></form>');

  const form = document.querySelector('form');
  const element = document.querySelector('range-slider');

  expect(form).toHaveFormValues({ 'range-slider': 50 });
  expect(element).toHaveValue(50);
});

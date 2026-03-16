import { userEvent } from '@vitest/browser/context';
import { vi } from 'vitest';

export function setup(html = '<range-slider></range-slider>') {
  document.body.innerHTML = html;

  const element = document.querySelector('range-slider');
  const track = element?.querySelector('[data-track]');
  const trackFill = element?.querySelector('[data-track-fill]');
  const runnableTrack = element?.querySelector('[data-runnable-track]');
  const thumbs = element ? [...element.querySelectorAll('[role="slider"]')] : [];
  const thumb = thumbs[0];

  return {
    element,
    track,
    trackFill,
    runnableTrack,
    thumbs,
    thumb,
  };
}

export function listenToEvents(element, events) {
  const handlers = {};

  for (const event of events) {
    handlers[event] = vi.fn();
    element.addEventListener(event, handlers[event]);
  }

  return handlers;
}

export async function clickTrackEnd(element) {
  await userEvent.click(element, {
    position: { x: element.offsetWidth - 1, y: 1 },
  });
}

export async function clickTrackStart(element) {
  await userEvent.click(element, {
    position: { x: 1, y: 1 },
  });
}

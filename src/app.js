import zoom from './modules/zoom.js';
import pan from './modules/pan.js';

const optionalZoomFactor = 0.1,
  container = document.querySelector('.container'),
  object = document.querySelector('object'),
  img = document.querySelector('img'),
  button = document.querySelector('button');

function reset(elements) {
  elements.forEach(el => el.removeAttribute('style'));
}

// If embedding an SVG using an <object> tag, it's necessary to wait until the
// page has loaded before querying its `contentDocument`, otherwise it will be
// `null`.

window.addEventListener('load', function () {
  const svg = object.contentDocument.querySelector('svg'),
    pannableAndZoomableElements = [img, svg];

  button.addEventListener('click', () => {
    [button, container].forEach(el => el.classList.toggle('switch'));
    reset(pannableAndZoomableElements);
  });

  pannableAndZoomableElements.forEach(el => {
    el.addEventListener('wheel', e => zoom(el, e, optionalZoomFactor), { passive: false });
    el.addEventListener('pointerdown', e => pan(el, e), { passive: false });
  });
});

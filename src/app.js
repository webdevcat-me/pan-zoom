import zoom from './modules/zoom.js';
import pan from './modules/pan.js';

const optionalZoomFactor = 0.1,
  object = document.querySelector('object');

// If embedding an SVG using an <object> tag, it's necessary to wait until the
// page has loaded before querying its `contentDocument`, otherwise it will be
// `null`.

window.addEventListener('load', function () {
  const svg = object.contentDocument.querySelector('svg'),
    targetEl = svg.querySelector('g'),
    pointer = svg.querySelector('#pointer'),
    options = { passive: false };

  svg.addEventListener('wheel', e => zoom(targetEl, e, optionalZoomFactor), options);
  svg.addEventListener('pointerdown', e => pan(svg, targetEl, e), options);

  svg.addEventListener('pointermove', e => {
    const pt = new DOMPoint(e.clientX, e.clientY),
      svgP = pt.matrixTransform(targetEl.getScreenCTM().inverse());

    pointer.setAttributeNS(null, 'cx', svgP.x);
    pointer.setAttributeNS(null, 'cy', svgP.y);
  });
});

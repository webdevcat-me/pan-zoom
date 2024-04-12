import zoom from './modules/zoom.js';
import pan from './modules/pan.js';

window.addEventListener('load', function () {
  const svg = document.querySelector('object').contentDocument.querySelector('svg');

  svg.addEventListener('wheel', e => {
    e.preventDefault();

    svg.setAttributeNS(null, 'viewBox', zoom(svg, e));
  }, { passive: false });

  svg.addEventListener('pointerdown', e => {
    e.preventDefault();

    pan(svg, e);
  }, { passive: false });
});

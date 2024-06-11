import getComputedTransformMatrix from './utils.js';

const minDistanceThreshold = 5;

function distanceBetween({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function minDistanceThresholdIsMet(startPt, endPt) {
  return distanceBetween(startPt, endPt) >= minDistanceThreshold;
}

function stopEventPropagationToChildren(el, type) {
  el.addEventListener(type, e => e.stopPropagation(), { capture: true, once: true });
}

function getTranslateMatrix(startPt, movePt) {
  const translateMatrix = new DOMMatrix();

  return translateMatrix.translate(movePt.x - startPt.x, movePt.y - startPt.y);
}

export default function (svg, el, e) {
  e.preventDefault();

  const mtx = getComputedTransformMatrix(el),
    inverseScreenCTM = el.getScreenCTM().inverse();

  let startPt = new DOMPoint(e.clientX, e.clientY),
    movePt = new DOMPoint(),
    isPanning = false;

  function pointerMove(e) {
    movePt.x = e.clientX;
    movePt.y = e.clientY;

    if (!isPanning && minDistanceThresholdIsMet(startPt, movePt)) {
      isPanning = true;
      e.target.setPointerCapture(e.pointerId);

      startPt.x = e.clientX;
      startPt.y = e.clientY;
      startPt = startPt.matrixTransform(inverseScreenCTM);

      stopEventPropagationToChildren(el, 'click');
    }

    if (isPanning) {
      movePt.x = e.clientX;
      movePt.y = e.clientY;
      movePt = movePt.matrixTransform(inverseScreenCTM);

      el.style.transform = mtx.multiply(getTranslateMatrix(startPt, movePt));
    }
  }

  svg.addEventListener('pointermove', pointerMove);

  svg.addEventListener(
    'pointerup',
    () => svg.removeEventListener('pointermove', pointerMove),
    { once: true }
  );
}

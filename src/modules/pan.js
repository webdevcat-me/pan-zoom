import getComputedTransformMatrix from './utils.js';

const minDistanceThreshold = 5;

function setToCurrentPointerCoords(point, e) {
  point.x = e.clientX;
  point.y = e.clientY;

  return point;
}

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

export default function (el, e) {
  e.preventDefault();

  const mtx = getComputedTransformMatrix(el),
    startPt = new DOMPoint(e.clientX, e.clientY),
    movePt = new DOMPoint();

  let isPanning = false;

  function pointerMove(e) {
    setToCurrentPointerCoords(movePt, e);

    if (!isPanning && minDistanceThresholdIsMet(startPt, movePt)) {
      isPanning = true;
      e.target.setPointerCapture(e.pointerId);
      setToCurrentPointerCoords(startPt, e);
      stopEventPropagationToChildren(el, 'click');
    }

    if (isPanning) {
      el.style.transform = getTranslateMatrix(startPt, movePt).multiply(mtx);
    }
  }

  el.addEventListener('pointermove', pointerMove);

  el.addEventListener(
    'pointerup',
    () => el.removeEventListener('pointermove', pointerMove),
    { once: true }
  );
}

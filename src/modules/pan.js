const minDistanceThreshold = 5;

function distanceBetween({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function minDistanceThresholdIsMet(startPt, endPt) {
  return distanceBetween(startPt, endPt) >= minDistanceThreshold;
}

function getPositionChangeInLocalCoords(svg, startPt, endPt) {
  const matrix = svg.getScreenCTM().inverse(),
    localStartPt = startPt.matrixTransform(matrix),
    localEndPt = endPt.matrixTransform(matrix);

  return {
    x: localStartPt.x - localEndPt.x,
    y: localStartPt.y - localEndPt.y
  };
}

function stopEventPropagationToChildren(svg, type) {
  svg.addEventListener(type, e => e.stopPropagation(), { capture: true, once: true });
}

function setToCurrentPointerCoords(point, e) {
  point.x = e.clientX;
  point.y = e.clientY;

  return point;
}

function getPanCoords(svg, startPt, movePt, initialPos) {
  const posChange = getPositionChangeInLocalCoords(svg, startPt, movePt);

  return {
    x: initialPos.x + posChange.x,
    y: initialPos.y + posChange.y
  };
}

function setViewBoxPosition(svg, { x, y }) {
  const { width, height } = svg.viewBox.baseVal;

  svg.setAttributeNS(null, 'viewBox', `${x} ${y} ${width} ${height}`);
}

export default function (svg, e) {
  const { x, y } = svg.viewBox.baseVal,
    startPt = setToCurrentPointerCoords(new DOMPoint(), e),
    movePt = new DOMPoint();

  let isPanning = false;

  function pointerMove(e) {
    setToCurrentPointerCoords(movePt, e);

    if (!isPanning && minDistanceThresholdIsMet(startPt, movePt)) {
      isPanning = true;
      e.target.setPointerCapture(e.pointerId);
      setToCurrentPointerCoords(startPt, e);
      stopEventPropagationToChildren(svg, 'click');
    }

    if (isPanning) {
      setViewBoxPosition(svg, getPanCoords(svg, startPt, movePt, { x, y }));
    }
  }

  svg.addEventListener('pointermove', pointerMove);

  svg.addEventListener(
    'pointerup',
    () => svg.removeEventListener('pointermove', pointerMove),
    { once: true }
  );
}

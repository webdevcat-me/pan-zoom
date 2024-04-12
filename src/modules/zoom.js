const zoomStepRatio = 0.25,
  positive = 1,
  negative = -1;

function toLocalCoords(svg, x, y) {
  const clientP = new DOMPoint(x, y);

  return clientP.matrixTransform(svg.getScreenCTM().inverse());
}

function zoomIn(deltaY) {
  return deltaY < 0;
}

function calcSizeChangeAmounts(width, height) {
  return {
    width: width * zoomStepRatio,
    height: height * zoomStepRatio
  };
}

function calcValChangeRatios(focusPoint, x, y, width, height) {
  return {
    x: (focusPoint.x - x) / width,
    y: (focusPoint.y - y) / height,
    width: (width + x - focusPoint.x) / width,
    height: (height + y - focusPoint.y) / height
  };
}

function calcValChangeAmounts(focusPoint, x, y, width, height) {
  const changeAmount = calcSizeChangeAmounts(width, height),
    valChangeRatio = calcValChangeRatios(focusPoint, x, y, width, height);

  return {
    x: valChangeRatio.x * changeAmount.width,
    y: valChangeRatio.y * changeAmount.height,
    width: valChangeRatio.width * changeAmount.width,
    height: valChangeRatio.height * changeAmount.height
  };
}

export default function (svg, e) {
  const pointerPosition = toLocalCoords(svg, e.clientX, e.clientY),
    sign = zoomIn(e.deltaY) ? positive : negative,
    { x, y, width, height } = svg.viewBox.baseVal,
    changeAmount = calcValChangeAmounts(pointerPosition, x, y, width, height),

    attr = {
      x: x + sign * changeAmount.x,
      y: y + sign * changeAmount.y,
      width: width + sign * (-changeAmount.x - changeAmount.width),
      height: height + sign * (-changeAmount.y - changeAmount.height)
    };

  return `${attr.x} ${attr.y} ${attr.width} ${attr.height}`;
}

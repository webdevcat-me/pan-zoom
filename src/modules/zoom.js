import getComputedTransformMatrix from './utils.js';

function zoomIn(deltaY) {
  return deltaY < 0;
}

function getScale(e, factor) {
  return zoomIn(e.deltaY) ? 1 + factor : 1 - factor;
}

function getFocalPointBeforeTransform(el, e, inverseScreenCTM) {
  const { x, y, width, height } = el.getBoundingClientRect(),
    pointer = (new DOMPoint(e.clientX, e.clientY)).matrixTransform(inverseScreenCTM),
    origin = (new DOMPoint(x, y)).matrixTransform(inverseScreenCTM),
    terminus = (new DOMPoint(x + width, y + height)).matrixTransform(inverseScreenCTM);

  return {
    x: pointer.x,
    y: pointer.y,
    relativeToImageSize: {
      x: (pointer.x - origin.x) / (terminus.x - origin.x),
      y: (pointer.y - origin.y) / (terminus.y - origin.y)
    }
  };
}

function getFocalPointAfterTransform(el, fpBeforeTrans, inverseScreenCTM) {
  const { x, y, width, height } = el.getBoundingClientRect(),
    origin = (new DOMPoint(x, y)).matrixTransform(inverseScreenCTM),
    terminus = (new DOMPoint(x + width, y + height)).matrixTransform(inverseScreenCTM),
    relativeFocalPoint = fpBeforeTrans.relativeToImageSize;

  return {
    x: origin.x + (terminus.x - origin.x) * relativeFocalPoint.x,
    y: origin.y + (terminus.y - origin.y) * relativeFocalPoint.y
  };
}

function getTranslateMatrix(el, e, scaleMatrix) {
  const inverseScreenCTM = el.getScreenCTM().inverse(),
    fpBeforeTrans = getFocalPointBeforeTransform(el, e, inverseScreenCTM);

  el.style.transform = scaleMatrix;

  const fpAfterTrans = getFocalPointAfterTransform(el, fpBeforeTrans, inverseScreenCTM),
    translateMatrix = new DOMMatrix();

  return translateMatrix.translate(
    fpBeforeTrans.x - fpAfterTrans.x,
    fpBeforeTrans.y - fpAfterTrans.y
  );
}

export default function (el, e, factor = 0.1) {
  e.preventDefault();

  const mtx = getComputedTransformMatrix(el),
    scale = getScale(e, factor),
    transMtx = getTranslateMatrix(el, e, mtx.scale(scale));

  el.style.transform = mtx.multiply(transMtx).scale(scale);
}

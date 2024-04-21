import getComputedTransformMatrix from './utils.js';

function zoomIn(deltaY) {
  return deltaY < 0;
}

function getScale(e, factor) {
  return zoomIn(e.deltaY) ? 1 + factor : 1 - factor;
}

function getFocalPointBeforeTransform(el, e) {
  const { x, y, width, height } = el.getBoundingClientRect();

  return {
    x: e.clientX,
    y: e.clientY,
    relativeToImageSize: {
      x: (e.clientX - x) / width,
      y: (e.clientY - y) / height
    }
  };
}

function getFocalPointAfterTransform(el, fpBeforeTrans) {
  const { x, y, width, height } = el.getBoundingClientRect(),
    relativeFocalPoint = fpBeforeTrans.relativeToImageSize;

  return {
    x: x + width * relativeFocalPoint.x,
    y: y + height * relativeFocalPoint.y
  };
}

function getTranslateMatrix(el, e, scaleMatrix) {
  const fpBeforeTrans = getFocalPointBeforeTransform(el, e);

  el.style.transform = scaleMatrix;

  const fpAfterTrans = getFocalPointAfterTransform(el, fpBeforeTrans),
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

  el.style.transform = transMtx.multiply(mtx).scale(scale);
}

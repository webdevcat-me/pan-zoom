const digits = /-?\d+\.?\d*/g;

export default function getComputedTransformMatrix(el) {
  const matrixSequence = getComputedStyle(el).transform.match(digits),
    identityMatrix = '';

  return new DOMMatrix(matrixSequence || identityMatrix);
}

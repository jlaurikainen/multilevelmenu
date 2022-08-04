export function findFocusIndex<T extends (HTMLElement | null)[]>(els: T) {
  return els.findIndex((el) => el === document.activeElement);
}

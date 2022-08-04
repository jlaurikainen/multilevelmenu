export function focusedChildIndex<T extends (HTMLElement | null)[]>(els: T) {
  return els.findIndex((el) => el === document.activeElement);
}

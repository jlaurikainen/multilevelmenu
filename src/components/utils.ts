export function queryMenuItems<T extends HTMLElement>(el: T | null) {
  return Array.from<HTMLElement>(
    el?.querySelectorAll("[role='menuitem']") ?? []
  );
}

export function findActiveChildIndex<T extends HTMLElement[]>(els: T) {
  return els.findIndex((el) => el === document.activeElement);
}

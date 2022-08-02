import { RefObject, useEffect } from "react";

export function useOnClickOutside(
  refs: RefObject<HTMLElement>[],
  handler: (event?: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const refMatches = refs.filter((ref) => {
        return (
          !ref.current || ref.current.contains(event.target as HTMLElement)
        );
      });

      if (refMatches.length) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [...refs, handler]);
}

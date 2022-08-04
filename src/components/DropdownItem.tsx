import {
  forwardRef,
  KeyboardEvent,
  Ref,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDropdownContext } from "./DropdownContext";
import { DropdownMenu } from "./DropdownMenu";
import { DropdownMenuItem } from "./types";

type DropdownItemProps = {
  item: DropdownMenuItem;
};

export const DropdownItem = forwardRef(
  ({ item }: DropdownItemProps, ref: Ref<HTMLButtonElement | null>) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { closeDropdown } = useDropdownContext();
    const { label, subMenuItems, ...buttonProps } = item;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hasSubMenu = !!subMenuItems;

    useImperativeHandle(ref, () => buttonRef.current);

    function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      switch (event.key) {
        case "ArrowRight": {
          event.preventDefault();
          event.stopPropagation();

          hasSubMenu && setMenuOpen(true);
          break;
        }
      }
    }

    return (
      <div
        className="menu-item"
        onKeyDown={onKeyDown}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <button
          {...buttonProps}
          onClick={(event) => {
            setMenuOpen(true);
            buttonProps.onClick?.(event);
            !hasSubMenu && closeDropdown();
          }}
          ref={buttonRef}
          role="menuitem"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: 8,
            width: "100%",
            border: 0,
            backgroundColor: "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
          {hasSubMenu && <span style={{ marginLeft: "auto" }}>{">"}</span>}
        </button>

        {hasSubMenu && (
          <DropdownMenu
            closeSubMenu={() => {
              setMenuOpen(false);
              buttonRef.current?.focus();
            }}
            isSubMenu
            menuItems={subMenuItems}
            menuIsOpen={menuOpen}
            parent={buttonRef}
          />
        )}
      </div>
    );
  }
);

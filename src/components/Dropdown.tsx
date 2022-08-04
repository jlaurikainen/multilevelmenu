import {
  ButtonHTMLAttributes,
  KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";
import { useOnClickOutside } from "../useOnClickOutside";
import { DropdownContext } from "./DropdownContext";
import { DropdownMenu } from "./DropdownMenu";
import { DropdownMenuItem } from "./types";

type DropdownProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  menuItems: DropdownMenuItem[];
};

export default function Dropdown({ label, menuItems, ...rest }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuRef, setMenuRef] = useState<HTMLDivElement | null>(null);
  const menuItemsRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dropdownRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useOnClickOutside([dropdownRef, { current: menuRef }], closeDropdown);

  function closeDropdown() {
    setOpen(false);
  }

  function closeMainMenu() {
    closeDropdown();
    dropdownRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();

        !open ? setOpen(true) : menuItemsRefs.current[0]?.focus();

        break;
      }

      case "ArrowUp": {
        event.preventDefault();

        const lastIndex = menuItemsRefs.current.length - 1;
        !open ? setOpen(true) : menuItemsRefs.current[lastIndex]?.focus();

        break;
      }

      case "Escape":
        closeDropdown();
        break;

      case "Tab":
        if (!event.shiftKey && open) {
          event.preventDefault();
          menuItemsRefs.current[0]?.focus();
        }

        break;
    }
  }

  function toggleDropdown() {
    setOpen(!open);
  }

  return (
    <DropdownContext.Provider value={{ closeMainMenu }}>
      <button
        {...rest}
        aria-controls={open ? `dropdown-${id}-menu` : ""}
        aria-expanded={open}
        id={`dropdown-${id}`}
        onClick={toggleDropdown}
        onKeyDown={onKeyDown}
        ref={dropdownRef}
        role="switch"
        type="button"
      >
        {label}
      </button>

      <DropdownMenu
        aria-labelledby={`dropdown-${id}`}
        id={`dropdown-${id}-menu`}
        menuItemRefs={menuItemsRefs}
        menuItems={menuItems}
        menuIsOpen={open}
        parent={dropdownRef}
        ref={setMenuRef}
      />
    </DropdownContext.Provider>
  );
}

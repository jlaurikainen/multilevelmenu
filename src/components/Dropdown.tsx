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
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuRef, setMenuRef] = useState<HTMLDivElement | null>(null);
  const menuItemsRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useOnClickOutside([buttonRef, { current: menuRef }], () =>
    setMenuOpen(false)
  );

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown": {
        if (!menuOpen) {
          event.preventDefault();
          setMenuOpen(true);
          break;
        }

        if (menuOpen && menuItemsRefs.current) {
          event.preventDefault();
          menuItemsRefs.current[0]?.focus();
        }
        break;
      }
      case "ArrowUp": {
        if (!menuOpen) {
          event.preventDefault();
          setMenuOpen(true);
          break;
        }

        if (menuOpen && menuRef) {
          event.preventDefault();
          menuItemsRefs.current[menuItemsRefs.current.length - 1]?.focus();
        }
        break;
      }
    }
  }

  return (
    <DropdownContext.Provider
      value={{
        closeDropdown: () => {
          setMenuOpen(false);
          buttonRef.current?.focus();
        },
      }}
    >
      <button
        {...rest}
        aria-controls={`dropdown-${id}-menu`}
        aria-expanded={menuOpen}
        id={`dropdown-${id}`}
        onClick={() => setMenuOpen(!menuOpen)}
        onKeyDown={onKeyDown}
        ref={buttonRef}
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
        menuIsOpen={menuOpen}
        parent={buttonRef}
        ref={setMenuRef}
      />
    </DropdownContext.Provider>
  );
}

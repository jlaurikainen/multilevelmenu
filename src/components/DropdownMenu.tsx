import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  Ref,
  RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { useDropdownContext } from "./DropdownContext";
import DropdownItem from "./DropdownItem";
import { DropdownMenuItem } from "./types";
import { findActiveChildIndex, queryMenuItems } from "./utils";

type DropdownMenuProps = HTMLAttributes<HTMLElement> & {
  closeSubMenu?: () => void;
  isSubMenu?: boolean;
  menuItems?: DropdownMenuItem[];
  menuIsOpen: boolean;
  parent: RefObject<HTMLElement>;
};

function DropdownMenu(
  {
    closeSubMenu,
    isSubMenu,
    menuItems,
    menuIsOpen,
    parent,
    ...rest
  }: DropdownMenuProps,
  ref: Ref<HTMLDivElement | null>
) {
  const [menuRef, setMenuRef] = useState<HTMLDivElement | null>(null);
  const { closeDropdown } = useDropdownContext();

  useImperativeHandle(ref, () => menuRef);

  const { attributes, styles } = usePopper(parent.current, menuRef, {
    placement: isSubMenu ? "right-start" : "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: isSubMenu ? [0, -2] : [0, 4],
        },
      },
    ],
  });

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        event.stopPropagation();

        if (menuRef) {
          const listItems = queryMenuItems(menuRef);
          const activeChildIndex = findActiveChildIndex(listItems);

          listItems[(activeChildIndex + 1) % listItems.length]?.focus();
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        event.stopPropagation();

        isSubMenu && closeSubMenu?.();
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        event.stopPropagation();

        if (menuRef) {
          const listItems = queryMenuItems(menuRef);
          const activeChildIndex = findActiveChildIndex(listItems);

          listItems[
            activeChildIndex === 0 ? listItems.length - 1 : activeChildIndex - 1
          ]?.focus();
        }
        break;
      }
      case "Escape": {
        event.preventDefault();
        event.stopPropagation();

        isSubMenu ? closeSubMenu?.() : closeDropdown();
        break;
      }
      case "Tab": {
        event.preventDefault();
        break;
      }
    }
  }

  useLayoutEffect(() => {
    if (isSubMenu && menuIsOpen && menuRef) {
      const listItems = queryMenuItems(menuRef);
      listItems[0]?.focus();
    }
  }, [isSubMenu, menuIsOpen, menuRef]);

  function renderMenu() {
    return (
      <div
        {...rest}
        {...attributes.popper}
        onKeyDown={onKeyDown}
        ref={setMenuRef}
        role="menu"
        style={{
          ...styles.popper,
          margin: 0,
          padding: 0,
          minWidth: isSubMenu ? "auto" : parent.current?.offsetWidth,
          backgroundColor: "white",
          boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
          listStyleType: "none",
        }}
      >
        {menuItems?.map((item, i) => (
          <DropdownItem item={item} key={i} />
        ))}
      </div>
    );
  }

  if (!menuItems || !menuIsOpen) return null;

  if (!isSubMenu) {
    return createPortal(renderMenu(), document.body);
  }

  return renderMenu();
}

export default forwardRef(DropdownMenu);

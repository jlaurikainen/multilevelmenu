import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  Ref,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { useDropdownContext } from "./DropdownContext";
import { DropdownItem } from "./DropdownItem";
import { DropdownMenuItem } from "./types";
import { findFocusIndex } from "./utils";

type DropdownMenuProps = HTMLAttributes<HTMLElement> & {
  closeSubMenu?: () => void;
  isSubMenu?: boolean;
  menuItemRefs?: RefObject<(HTMLButtonElement | null)[]>;
  menuItems?: DropdownMenuItem[];
  menuIsOpen: boolean;
  parent: RefObject<HTMLElement>;
};

export const DropdownMenu = forwardRef(
  (
    {
      closeSubMenu,
      isSubMenu,
      menuItemRefs: itemRefs,
      menuItems,
      menuIsOpen,
      parent,
      ...rest
    }: DropdownMenuProps,
    ref: Ref<HTMLDivElement | null>
  ) => {
    const [menuRef, setMenuRef] = useState<HTMLDivElement | null>(null);
    const menuItemsRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useImperativeHandle(itemRefs, () => menuItemsRefs.current);
    useImperativeHandle(ref, () => menuRef);

    const { closeMainMenu } = useDropdownContext();
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

          const focusIndex = findFocusIndex(menuItemsRefs.current);
          const newIndex = (focusIndex + 1) % menuItemsRefs.current.length;
          menuItemsRefs.current[newIndex]?.focus();

          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          event.stopPropagation();

          if (isSubMenu) {
            closeSubMenu?.();
          }

          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          event.stopPropagation();

          const activeIndex = findFocusIndex(menuItemsRefs.current);
          const newIndex =
            activeIndex === 0
              ? menuItemsRefs.current.length - 1
              : activeIndex - 1;
          menuItemsRefs.current[newIndex]?.focus();

          break;
        }
        case "Escape": {
          event.preventDefault();
          event.stopPropagation();

          isSubMenu ? closeSubMenu?.() : closeMainMenu();

          break;
        }
        case "Tab": {
          event.preventDefault();
          break;
        }
      }
    }

    function renderMenu() {
      return (
        <Menu
          {...rest}
          {...attributes.popper}
          onKeyDown={onKeyDown}
          ref={setMenuRef}
          role="menu"
          style={{
            ...styles.popper,
            minWidth: isSubMenu ? "auto" : parent.current?.offsetWidth,
          }}
        >
          {menuItems?.map((item, i) => (
            <DropdownItem
              item={item}
              key={i}
              ref={(instance) => (menuItemsRefs.current[i] = instance)}
            />
          ))}
        </Menu>
      );
    }

    if (!menuItems || !menuIsOpen) return null;

    if (!isSubMenu) {
      return createPortal(renderMenu(), document.body);
    }

    return renderMenu();
  }
);

const Menu = styled.div({
  margin: 0,
  padding: 0,
  backgroundColor: "white",
  boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
});

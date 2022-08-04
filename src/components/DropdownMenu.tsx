import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  Ref,
  RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { useDropdownContext } from "./DropdownContext";
import { DropdownItem } from "./DropdownItem";
import { DropdownMenuItem } from "./types";
import { focusedChildIndex } from "./utils";

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
    const { closeDropdown } = useDropdownContext();

    useImperativeHandle(ref, () => menuRef);
    useImperativeHandle(itemRefs, () => menuItemsRefs.current);

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
            const activeChildIndex = focusedChildIndex(menuItemsRefs.current);

            menuItemsRefs.current[
              (activeChildIndex + 1) % menuItemsRefs.current.length
            ]?.focus();
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
            const activeChildIndex = focusedChildIndex(menuItemsRefs.current);

            menuItemsRefs.current[
              activeChildIndex === 0
                ? menuItemsRefs.current.length - 1
                : activeChildIndex - 1
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
      if (isSubMenu && menuIsOpen && menuItemsRefs.current) {
        menuItemsRefs.current[0]?.focus();
      }
    }, [isSubMenu, menuIsOpen, menuItemsRefs]);

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
            <DropdownItem
              item={item}
              key={i}
              ref={(instance) => (menuItemsRefs.current[i] = instance)}
            />
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
);

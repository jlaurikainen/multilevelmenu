import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  Ref,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useDropdownContext } from "./DropdownContext";
import { DropdownMenu } from "./DropdownMenu";
import { DropdownMenuItem } from "./types";

type DropdownItemProps = HTMLAttributes<HTMLDivElement> & {
  item: DropdownMenuItem;
};

export const DropdownItem = forwardRef(
  (
    { item, ...rest }: DropdownItemProps,
    ref: Ref<HTMLButtonElement | null>
  ) => {
    const [open, setOpen] = useState(false);
    const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => buttonRef.current);

    const { closeMainMenu } = useDropdownContext();
    const { label, menuItems, ...buttonProps } = item;
    const hasSubMenu = menuItems !== undefined;

    function closeSubMenu() {
      setOpen(false);
    }

    function openSubMenu() {
      setOpen(true);
    }

    function closeCurrentMenu() {
      closeSubMenu();
      buttonRef.current?.focus();
    }

    function onClick(event: MouseEvent<HTMLButtonElement>) {
      buttonProps.onClick?.(event);
      closeMainMenu();
    }

    function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      switch (event.key) {
        case "ArrowRight": {
          event.preventDefault();
          event.stopPropagation();

          if (!hasSubMenu) return;

          openSubMenu();
          setTimeout(() => menuItemRefs.current[0]?.focus(), 0);

          break;
        }
      }
    }

    return (
      <MenuItem
        {...rest}
        onKeyDown={onKeyDown}
        onMouseEnter={openSubMenu}
        onMouseLeave={closeSubMenu}
      >
        <MenuButton
          {...buttonProps}
          onClick={onClick}
          ref={buttonRef}
          role="menuitem"
        >
          {label}
          {hasSubMenu && <SubMenuIndicator />}
        </MenuButton>

        {hasSubMenu && (
          <DropdownMenu
            closeSubMenu={closeCurrentMenu}
            isSubMenu
            menuItemRefs={menuItemRefs}
            menuItems={menuItems}
            menuIsOpen={open}
            parent={buttonRef}
          />
        )}
      </MenuItem>
    );
  }
);

const MenuItem = styled.div({
  ":hover, :focus-within": {
    backgroundColor: "lightsteelblue",
  },
});

const MenuButton = styled.button({
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: 8,
  width: "100%",
  border: 0,
  backgroundColor: "transparent",
  whiteSpace: "nowrap",

  ":focus": {
    outline: "none",
  },
});

const SubMenuIndicator = styled.span({
  marginLeft: "auto",

  "::after": {
    content: "'>'",
  },
});

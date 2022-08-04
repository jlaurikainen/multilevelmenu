import { ButtonHTMLAttributes } from "react";

export type DropdownMenuItem = {
  label: string;
  menuItems?: DropdownMenuItem[];
} & ButtonHTMLAttributes<HTMLElement>;

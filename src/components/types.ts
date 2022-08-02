import { ButtonHTMLAttributes } from "react";

export type DropdownMenuItem = {
  label: string;
  subMenuItems?: DropdownMenuItem[];
} & ButtonHTMLAttributes<HTMLElement>;

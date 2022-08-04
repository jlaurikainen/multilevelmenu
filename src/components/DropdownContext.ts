import { createContext, useContext } from "react";

type DropdownContextProps = {
  closeMainMenu: () => void;
};

export const DropdownContext = createContext<DropdownContextProps | null>(null);

export function useDropdownContext() {
  const c = useContext(DropdownContext);

  if (!c) throw new Error("Dropdown context error!");

  return c!;
}

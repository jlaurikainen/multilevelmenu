import { Fragment } from "react";
import Dropdown from "./components/Dropdown";
import { DropdownMenuItem } from "./components/types";

const menuItems: DropdownMenuItem[] = [
  {
    label: "Item 1",
    subMenuItems: [
      {
        label: "Item 1_1",
        onClick: () => console.log("Item 1_1 clicked"),
      },
      {
        label: "Item 1_2",
        onClick: () => console.log("Item 1_2 clicked"),
      },
    ],
  },
  {
    label: "Item 2",
    onClick: () => console.log("Item 2 clicked"),
  },
  {
    label: "Item 3",
    subMenuItems: [
      {
        label: "Item 1_1",
        subMenuItems: [
          {
            label: "Item 1_1_1",
            onClick: () => console.log("Item 1_1_1 clicked"),
          },
          {
            label: "Item 1_1_2",
            onClick: () => console.log("Item 1_1_2 clicked"),
          },
        ],
      },
      {
        label: "Item 1_2",
        onClick: () => console.log("Item 1_2 clicked"),
      },
    ],
  },
  {
    label: "Item 4",
    onClick: () => console.log("Item 4 clicked"),
  },
];

export default function App() {
  return (
    <Fragment>
      <Dropdown label="Dropdown test" menuItems={menuItems} />
    </Fragment>
  );
}

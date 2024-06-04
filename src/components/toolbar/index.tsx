import { ChangeEvent } from "react";
import { TDimensions } from "../card/card.types";

export type ToolbarProps = {
  value: TDimensions;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
export default function Toolbar({ value, handleChange }: ToolbarProps) {
  return null;
  return (
    <div>
      <input
        type="number"
        name="width"
        id="width"
        value={value.width}
        onChange={handleChange}
      />
      <input
        type="number"
        name="height"
        id="height"
        value={value.height}
        onChange={handleChange}
      />
    </div>
  );
}

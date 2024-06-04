import { TDimensions } from "./card.types";
import { useResizable } from "../../../hooks/useResizable";

export type CardProps = {
  dimensions: TDimensions;
};

export default function Card({ dimensions }: CardProps) {
  const [ref] = useResizable();

  return (
    <div ref={ref} className="border-black relative h-32 w-32">
      <div className="resizer resize--r absolute h-full w-1 right-0 top-1/2 -translate-y-1/2 bg-indigo-500/50 cursor-ew-resize" />
      <div className="resizer resize--b absolute h-1 w-full bottom-0 left-1/2 -translate-x-1/2 bg-indigo-500/50 cursor-ns-resize" />
    </div>
  );
}

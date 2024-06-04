import { useRef } from "react";
import { TDimensions } from "./card.types";

export type CardProps = {
  dimensions: TDimensions;
};

enum Direction {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

export default function Card({ dimensions }: CardProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const handleMouseDown = (e: MouseEvent) => {
    const el = elementRef.current;
    if (!el) return;
    console.log({ el });

    const direction = (e.target as HTMLElement).classList.contains("resize--r")
      ? Direction.Horizontal
      : Direction.Vertical;

    console.log({ direction });

    const startPos = {
      x: e.clientX,
      y: e.clientY,
    };

    console.log({ startPos });

    const styles = window.getComputedStyle(el);
    const width = parseInt(styles.width, 10);
    const height = parseInt(styles.height, 10);

    console.log({ width, height });

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;

      direction === Direction.Horizontal
        ? (el.style.width = `${width + dx}px`)
        : (el.style.height = `${height + dy}px`);
      updateCursor(direction);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      resetCursor();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: TouchEvent) => {
    const el = elementRef.current;

    if (!el) return;
    const direction = (e.target as HTMLElement).classList.contains("resize--r")
      ? Direction.Horizontal
      : Direction.Vertical;

    const touch = e.touches[0];
    const startPos = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const styles = window.getComputedStyle(el);
    const w = parseInt(styles.width, 10);
    const h = parseInt(styles.height, 10);

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = touch.clientX - startPos.x;
      const dy = touch.clientY - startPos.y;

      direction === Direction.Horizontal
        ? (el.style.width = `${w + dx}px`)
        : (el.style.height = `${h + dy}px`);
      updateCursor(direction);
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      resetCursor();
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const updateCursor = (direction: Direction) => {
    document.body.style.cursor =
      direction === Direction.Horizontal
        ? "cursor-ew-resize"
        : "cursor-ns-resize";
  };
  const resetCursor = () => {
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
  };

  return (
    <div ref={elementRef} className="border-black relative h-32 w-32">
      <div
        className="resizer resize--r absolute h-full w-1 right-0 top-1/2 -translate-y-1/2 bg-indigo-500/50 cursor-ew-resize"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
      <div
        className="resizer resize--b absolute h-1 w-full bottom-0 left-1/2 -translate-x-1/2 bg-indigo-500/50 cursor-ns-resize"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
    </div>
  );
}

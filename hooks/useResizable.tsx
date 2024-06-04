import { useCallback, useEffect, useState } from "react";

enum Direction {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

export const useResizable = () => {
  const [node, setNode] = useState<HTMLElement>();
  const ref = useCallback((nodeEl: HTMLDivElement) => {
    setNode(nodeEl);
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!node) {
        return;
      }

      const direction = (e.target as HTMLElement).classList.contains(
        "resize--r",
      )
        ? Direction.Horizontal
        : Direction.Vertical;

      const startPos = {
        x: e.clientX,
        y: e.clientY,
      };

      const styles = window.getComputedStyle(node);
      const width = parseInt(styles.width, 10);
      const height = parseInt(styles.height, 10);
      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;

        direction === Direction.Horizontal
          ? (node.style.width = `${width + dx}px`)
          : (node.style.height = `${height + dy}px`);
        updateCursor(direction);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [node],
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!node) {
        return;
      }

      const direction = (e.target as HTMLElement).classList.contains(
        "resize--r",
      )
        ? Direction.Horizontal
        : Direction.Vertical;

      const touch = e.touches[0];

      const startPos = {
        x: touch.clientX,
        y: touch.clientY,
      };

      const styles = window.getComputedStyle(node);
      const width = parseInt(styles.width, 10);
      const height = parseInt(styles.height, 10);

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.x;
        const dy = touch.clientY - startPos.y;
        direction === Direction.Horizontal
          ? (node.style.width = `${width + dx}px`)
          : (node.style.height = `${height + dy}px`);
        updateCursor(direction);
      };

      const handleTouchUp = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchUp);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchUp);
    },
    [node],
  );
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

  useEffect(() => {
    if (!node) return;
    const resizerElements = node.querySelectorAll(".resizer");
    console.log(resizerElements);
    resizerElements.forEach((resizeEl) => {
      resizeEl.addEventListener("mousedown", handleMouseDown);
      resizeEl.addEventListener("touchStart", handleTouchStart);
    });

    return () => {
      resizerElements.forEach((resizeEl) => {
        resizeEl.removeEventListener("mousedown", handleMouseDown);
        resizeEl.removeEventListener("touchStart", handleTouchStart);
      });
    };
  }, [node, handleMouseDown, handleTouchStart]);

  return [ref];
};

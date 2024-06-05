import { TDimensions } from "@/components/card/card.types";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

enum Direction {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

export const useResizable = (
  setDimensions: Dispatch<SetStateAction<TDimensions>>,
) => {
  const [node, setNode] = useState<HTMLElement>();
  const ref = useCallback((nodeEl: HTMLDivElement) => {
    setNode(nodeEl);
  }, []);

  const getDirection = (target: HTMLElement) =>
    target && target.classList.contains("resize--r")
      ? Direction.Horizontal
      : Direction.Vertical;

  const getStartPos = (e: MouseEvent | React.Touch) => ({
    x: e.clientX,
    y: e.clientY,
  });

  const getNodeDimensions = (node: HTMLElement) => {
    const styles = window.getComputedStyle(node);
    const width = parseInt(styles.width, 10);
    const height = parseInt(styles.height, 10);
    return { height, width };
  };

  const getDistances = (
    e: MouseEvent | React.Touch,
    startPos: { x: number; y: number },
  ) => {
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    return { dx, dy };
  };

  const updateNodeDimensions = useCallback(
    (
      direction: Direction,
      node: HTMLElement,
      width: number,
      height: number,
      dx: number,
      dy: number,
    ) => {
      if (direction === Direction.Horizontal) {
        setDimensions((dimensions: TDimensions) => {
          return { ...dimensions, width: width + dx };
        });
        node.style.width = `${width + dx}px`;
      } else {
        setDimensions((prev: TDimensions) => ({
          width: prev.width,
          height: height + dy,
        }));
        node.style.height = `${height + dy}px`;
      }
    },
    [setDimensions],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!node) {
        return;
      }

      const direction = getDirection(e.target as HTMLElement);
      const startPos = getStartPos(e);
      const { width, height } = getNodeDimensions(node);

      const handleMouseMove = (e: MouseEvent) => {
        const { dx, dy } = getDistances(e, startPos);
        updateNodeDimensions(direction, node, width, height, dx, dy);
        updateCursor(direction);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        resetCursor();
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [node, updateNodeDimensions],
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!node) {
        return;
      }
      const touch = e.touches[0];
      const direction = getDirection(e.target as HTMLElement);
      const startPos = getStartPos(touch);
      const { width, height } = getNodeDimensions(node);

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const { dx, dy } = getDistances(touch, startPos);
        updateNodeDimensions(direction, node, width, height, dx, dy);
        updateCursor(direction);
      };

      const handleTouchUp = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchUp);
        resetCursor();
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchUp);
    },
    [node, updateNodeDimensions],
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
    const resizerElements = node.querySelectorAll<HTMLElement>(".resizer");
    resizerElements.forEach((resizeEl: HTMLElement) => {
      if (resizeEl) {
        resizeEl.addEventListener("mousedown", handleMouseDown);
        resizeEl.addEventListener("touchstart", handleTouchStart);
      }
    });

    return () => {
      resizerElements.forEach((resizeEl: HTMLElement) => {
        if (resizeEl) {
          resizeEl.removeEventListener("mousedown", handleMouseDown);
          resizeEl.removeEventListener("touchstart", handleTouchStart);
        }
      });
    };
  }, [node, handleMouseDown, handleTouchStart]);

  return [ref];
};

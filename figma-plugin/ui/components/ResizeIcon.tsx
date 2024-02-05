import * as React from "react";
import { emit } from "@create-figma-plugin/utilities";

import { ResizeWindowHandler } from "main/code";

export const ResizeIcon = () => {
  const iconRef = React.useRef<SVGSVGElement | null>(null);
  const [isResizing, setIsResizing] = React.useState(false);

  function resizeWindow(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const size = {
      w: Math.max(50, Math.floor(e.clientX + 5)),
      h: Math.max(50, Math.floor(e.clientY + 5)),
    };
    emit<ResizeWindowHandler>("RESIZE_WINDOW", size.w, size.h);
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    setIsResizing(true);
    iconRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerUp(e: React.PointerEvent<SVGSVGElement>) {
    setIsResizing(false);
    iconRef.current?.releasePointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (isResizing) {
      resizeWindow(e);
    }
  }

  return (
    <svg
      ref={iconRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed right-[2px] bottom-[2px] cursor-nwse-resize z-50"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Resize</title>
      <path d="M16 0V16H0L16 0Z" fill="white" />
      <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C" />
      <path d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z" fill="#8C8C8C" />
    </svg>
  );
};

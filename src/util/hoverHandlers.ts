import type { ThreeEvent } from "@react-three/fiber";

export const hoverHandlers = {
  onPointerOver: (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  },
  onPointerOut: (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  },
} as const;

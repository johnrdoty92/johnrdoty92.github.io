import type { ThreeElements } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { brickGeometry } from "../util/brickGeometry";
import {
  canvasTextureSize,
  drawCanvasTexture,
  type CanvasDrawingOptions,
} from "../util/canvasTexture";
import { Color, MeshPhysicalMaterial, SRGBColorSpace } from "three";
import { useToggleAnimationState } from "../hooks/useToggleAnimationState";
import { theme } from "../constants/styles";

export type BrickProps = {
  visibility: "normal" | "dimmed" | "selected";
} & CanvasDrawingOptions &
  Omit<ThreeElements["mesh"], "position">;

const visible = new Color("white");
const dimmed = new Color(theme.dark);

export const Brick = ({ label, icon, color, visibility, ...props }: BrickProps) => {
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    node.width = canvasTextureSize;
    node.height = canvasTextureSize;
    const ctx = node.getContext("2d")!;
    drawCanvasTexture(ctx, { label, icon, color });
    return node;
  }, [label, icon, color]);

  const material = useRef<MeshPhysicalMaterial>(null!);

  useToggleAnimationState(visibility === "dimmed", (alpha) => {
    material.current.color.lerpColors(visible, dimmed, alpha);
  });

  return (
    <mesh {...props} geometry={brickGeometry}>
      <meshPhysicalMaterial
        ref={material}
        ior={1.4}
        specularIntensity={0.25}
        roughness={0.1}
        metalness={0.02}
        clearcoat={0.6}
        clearcoatRoughness={0.6}
      >
        <canvasTexture attach="map" args={[canvas]} colorSpace={SRGBColorSpace} />
      </meshPhysicalMaterial>
    </mesh>
  );
};

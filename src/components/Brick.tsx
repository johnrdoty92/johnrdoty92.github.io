import { type ThreeElements } from "@react-three/fiber";
import { useMemo } from "react";
import { brickGeometry } from "../util/brickGeometry";
import {
  canvasTextureSize,
  drawCanvasTexture,
  type CanvasDrawingOptions,
} from "../util/canvasTexture";

export type BrickProps = CanvasDrawingOptions & ThreeElements["mesh"];

export const Brick = ({ label, icon, color, ...props }: BrickProps) => {
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    node.width = canvasTextureSize;
    node.height = canvasTextureSize;
    const ctx = node.getContext("2d")!;
    drawCanvasTexture(ctx, { label, icon, color });
    return node;
  }, [label, icon, color]);

  return (
    <>
      <mesh {...props} geometry={brickGeometry}>
        <meshStandardMaterial>
          <canvasTexture attach="map" args={[canvas]} />
        </meshStandardMaterial>
      </mesh>
    </>
  );
};

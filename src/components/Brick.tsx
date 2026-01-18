import type { ThreeElements } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { brickGeometry } from "../util/brickGeometry";
import {
  canvasTextureSize,
  drawCanvasTexture,
  type CanvasDrawingOptions,
} from "../util/canvasTexture";
import {
  Color,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  SRGBColorSpace,
  type Vector3Tuple,
} from "three";
import { useToggleAnimationState } from "../hooks/useToggleAnimationState";

export type BrickProps = {
  visibility: "normal" | "dimmed" | "selected";
  position: Vector3Tuple;
  delay: number;
} & CanvasDrawingOptions &
  Omit<ThreeElements["mesh"], "position">;

const visible = new Color("white");
const dimmed = new Color(0.04, 0.05, 0.2);
const startingRotation = Math.PI / 3;
const targetRotation = 0;
const startingHeight = 8;

export const Brick = ({ label, icon, color, visibility, delay, ...props }: BrickProps) => {
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    node.width = canvasTextureSize;
    node.height = canvasTextureSize;
    const ctx = node.getContext("2d")!;
    drawCanvasTexture(ctx, { label, icon, color });
    return node;
  }, [label, icon, color]);

  const brick = useRef<Mesh>(null!);
  const material = useRef<MeshPhysicalMaterial>(null!);

  useToggleAnimationState(visibility === "dimmed", (alpha) => {
    material.current.color.lerpColors(visible, dimmed, alpha);
  });

  useToggleAnimationState(
    true,
    (alpha) => {
      const targetY = props.position[1];
      const currentY = MathUtils.lerp(targetY + startingHeight, targetY, alpha);
      brick.current.position.y = currentY;
      brick.current.rotation.z = MathUtils.lerp(
        startingRotation,
        targetRotation,
        MathUtils.smoothstep(alpha, 0.75, 1),
      );
    },
    { delay: 250 * delay },
  );

  return (
    <mesh
      {...props}
      position={[props.position[0], props.position[1] + startingHeight, props.position[2]]}
      geometry={brickGeometry}
      ref={brick}
      rotation-z={startingRotation}
    >
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

import { useFrame, useLoader, type ThreeElements, type ThreeEvent } from "@react-three/fiber";
import {
  MathUtils,
  Matrix4,
  type Mesh,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
  TextureLoader,
  Vector3,
  type Vector3Tuple,
} from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "../hooks/useGLTF";
import { getAssetUrl } from "../util/getAssetUrl";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { useModalContext } from "../contexts/Modal";
import { useTargetFocusedPosition } from "../hooks/useTargetFocusedPosition";
import { hoverHandlers } from "../util/hoverHandlers";

type LaptopGraph = {
  nodes: { laptop: Mesh; stool: Mesh };
  materials: { laptop: MeshPhysicalMaterial; black: MeshStandardMaterial };
};

const laptopModelPath = getAssetUrl("Laptop");
const GENERATED_LAPTOP_ORIGIN: Vector3Tuple = [0, 1.88, 0.168];
const GENERATED_LAPTOP_SCALE = 0.623;
const GENERATED_STOOL_ORIGIN: Vector3Tuple = [0, 0.704, 0];
const GENERATED_STOOL_SCALE = 0.703;
const laptopOrigin = new Vector3(...GENERATED_LAPTOP_ORIGIN);
const facingCenter = (5 * Math.PI) / 4;

const amplitude = 0.1;
const frequency = 2;
const getTransforms = (length: number, spacing: number) =>
  ({
    left: { position: [-length, 0, -length - spacing], rotation: [0, (3 * Math.PI) / 2, 0] },
    right: { position: [-length - spacing, 0, -length], rotation: [0, Math.PI, 0] },
    center: { position: [-length, 0, -length], rotation: [0, facingCenter, 0] },
  } as const);

const MIN_OBJECT_CLEARANCE = 2;

export function Laptop({
  screen,
  position,
  ...props
}: Omit<ThreeElements["group"], "position"> & {
  screen: string;
  position: "left" | "right" | "center";
}) {
  const { width } = useRotatingDisplayContext();
  const { open } = useModalContext();

  const laptop = useRef<Mesh>(null!);
  const screenTexture = useLoader(TextureLoader, getAssetUrl(screen, ".png"));
  const { nodes, materials } = useGLTF<LaptopGraph>(laptopModelPath);
  const laptopMaterial = useMemo(() => materials.laptop.clone(), [materials]);
  useEffect(() => () => laptopMaterial.dispose(), [laptopMaterial]);

  const [isFocused, setIsFocused] = useState(false);

  const length = Math.max(width, MIN_OBJECT_CLEARANCE);
  const spacing = Math.max(MIN_OBJECT_CLEARANCE, width / 2 - 0.5);
  const transforms = getTransforms(length, spacing)[position];
  const focusedPosition = useTargetFocusedPosition(0.85, { x: 0, y: 0.25, z: 0 });
  const { x, y, z } = focusedPosition;
  focusedPosition.set(z, y, x);

  const parentMatrix = new Matrix4();
  const targetPosition = new Vector3();

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setIsFocused((f) => !f);
    open("TODO: handle modal open key", () => setIsFocused(false));
  };

  const handleMiss = () => {
    setIsFocused(false);
    // TODO: handle modal close
  };

  const accumulator = useRef(0);
  useFrame(({ clock }, delta) => {
    // TODO: refactor for readability and performance
    parentMatrix.copy(laptop.current.parent!.matrixWorld).invert();
    targetPosition.copy(focusedPosition).applyMatrix4(parentMatrix);
    const multiplier = 2;
    const scaledDelta = multiplier * (isFocused ? delta : -delta);
    accumulator.current = MathUtils.clamp(accumulator.current + scaledDelta, 0, 1);
    const alpha = MathUtils.smoothstep(accumulator.current, 0, 1);
    laptop.current.position.lerpVectors(laptopOrigin, targetPosition, alpha);
    const elapsed = clock.getElapsedTime();
    laptop.current.position.y += amplitude * Math.sin(elapsed * frequency) * accumulator.current;
    if (!isFocused) {
      const heightAmplitude = 2;
      laptop.current.position.y += heightAmplitude * Math.sin(MathUtils.lerp(0, Math.PI, alpha));
    }
    const rotationDiff = transforms.rotation[1] - facingCenter;
    laptop.current.rotation.y = MathUtils.lerp(0, -rotationDiff, alpha);
  });

  useEffect(() => () => laptopMaterial.dispose(), [laptopMaterial]);

  return (
    <group
      {...props}
      {...hoverHandlers}
      dispose={null}
      {...transforms}
      onClick={handleClick}
      onPointerMissed={handleMiss}
    >
      <mesh
        ref={laptop}
        geometry={nodes.laptop.geometry}
        material={laptopMaterial}
        material-map={screenTexture}
        material-map-flipY={false}
        position={GENERATED_LAPTOP_ORIGIN}
        scale={GENERATED_LAPTOP_SCALE}
      />
      <mesh
        geometry={nodes.stool.geometry}
        material={materials.black}
        position={GENERATED_STOOL_ORIGIN}
        rotation-y={position === "center" ? Math.PI / 4 : 0}
        scale={GENERATED_STOOL_SCALE}
      />
    </group>
  );
}

useGLTF.preload(laptopModelPath);

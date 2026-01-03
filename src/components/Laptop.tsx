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

type LaptopGraph = {
  nodes: { laptop: Mesh; stool: Mesh };
  materials: { laptop: MeshPhysicalMaterial; black: MeshStandardMaterial };
};

const laptopModelPath = getAssetUrl("Laptop");
const GENERATED_LAPTOP_ORIGIN: Vector3Tuple = [0, 1.88, 0.168];
const laptopOrigin = new Vector3(...GENERATED_LAPTOP_ORIGIN);
// TODO: make responsive: either to left of modal, or above
const focusedPosition = new Vector3(8.5, 3, 8.5);
const facingCenter = (5 * Math.PI) / 4;

const amplitude = 0.1;
const frequency = 2;
const offset = 1.5;
const getTransforms = (planePosition: number) =>
  ({
    left: {
      position: [-planePosition, 0, -planePosition - offset],
      rotation: [0, (3 * Math.PI) / 2, 0],
    },
    right: {
      position: [-planePosition - offset, 0, -planePosition],
      rotation: [0, Math.PI, 0],
    },
    center: {
      position: [-planePosition, 0, -planePosition],
      rotation: [0, facingCenter, 0],
    },
  } as const);

export function Laptop({
  screen,
  position,
  ...props
}: Omit<ThreeElements["group"], "position"> & {
  screen: string;
  position: "left" | "right" | "center";
}) {
  const { width } = useRotatingDisplayContext().dimensions;
  const planePosition = width + width / 2;
  const laptop = useRef<Mesh>(null!);
  const screenTexture = useLoader(TextureLoader, getAssetUrl(screen, ".png"));
  const { nodes, materials } = useGLTF<LaptopGraph>(laptopModelPath);
  const laptopMaterial = useMemo(() => materials.laptop.clone(), [materials]);
  const [isFocused, setIsFocused] = useState(false);

  const transforms = getTransforms(planePosition)[position];
  const parentMatrix = new Matrix4();
  const targetPosition = new Vector3();

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setIsFocused((f) => !f);
    // TODO: handle modal open, may need to pass a callback to handle resetting state on close
  };

  const handleMiss = () => {
    setIsFocused(false);
    // TODO: handle modal close
  };

  const accumulator = useRef(0);
  useFrame(({ clock }, delta) => {
    // TODO: refactor for readability and performance
    targetPosition
      .copy(focusedPosition)
      .applyMatrix4(parentMatrix.copy(laptop.current.parent!.matrixWorld).invert());
    const multiplier = 2;
    const scaledDelta = multiplier * (isFocused ? delta : -delta);
    accumulator.current = MathUtils.clamp(accumulator.current + scaledDelta, 0, 1);
    const alpha = MathUtils.smoothstep(accumulator.current, 0, 1);
    laptop.current.position.lerpVectors(laptopOrigin, targetPosition, alpha);
    const elapsed = clock.getElapsedTime();
    laptop.current.position.y += amplitude * Math.sin(elapsed * frequency) * accumulator.current;
    if (!isFocused) {
      const y = laptop.current.position.y;
      // TODO: adjust for responsive screen
      const heightAmplitude = 2;
      laptop.current.position.setY(
        y + heightAmplitude * Math.sin(MathUtils.lerp(0, Math.PI, alpha))
      );
    }
    const rotationDiff = transforms.rotation[1] - facingCenter;
    laptop.current.rotation.y = MathUtils.lerp(0, -rotationDiff, alpha);
  });

  useEffect(() => () => laptopMaterial.dispose(), [laptopMaterial]);

  return (
    <group
      {...props}
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
        scale={0.623}
      />
      <mesh
        geometry={nodes.stool.geometry}
        material={materials.black}
        position={[0, 0.704, 0]}
        scale={0.703}
      />
    </group>
  );
}

useGLTF.preload(laptopModelPath);

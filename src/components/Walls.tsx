import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Color,
  MathUtils,
  Matrix4,
  MeshStandardMaterial,
  type PerspectiveCamera,
  Vector2,
  Vector3,
  type InstancedMesh,
} from "three";
import { brickGeometry, brickHeight, brickLength } from "../util/brickGeometry";
import { useFrame, useThree, type ThreeElements } from "@react-three/fiber";

const POSITIVE_X = new Vector3(1, 0, 0);
const POSITIVE_Y = new Vector3(0, 1, 0);

const wallMaterial = new MeshStandardMaterial();
const color = new Color();
const lightblue = new Color(Color.NAMES.dodgerblue).lerp(new Color(Color.NAMES.white), 0.5);
const mtx = new Matrix4();
const target = new Vector3();

const getTargetPosition = (
  index: number,
  bricksPerRow: number,
  startZero: boolean,
  out: Vector3
) => {
  const rowLevel = Math.floor(index / bricksPerRow);
  const y = rowLevel * brickHeight;
  const offset = rowLevel % 2 === (startZero ? 0 : 1) ? 1 : 0;
  const z = (index % bricksPerRow) * brickLength + offset;
  out.set(0, y, z);
};

const useWallDimensions = () => {
  const camera = useThree(({ camera }) => camera as PerspectiveCamera);
  const renderer = useThree(({ gl }) => gl);

  const calculateDimensions = useCallback(() => {
    const cameraDistance = camera.position.length();
    const { x: viewWidth, y: viewHeight } = camera.getViewSize(cameraDistance, new Vector2());
    const cameraPlaneNormal = camera.position.clone().negate().normalize();
    const projectedX = POSITIVE_X.clone().projectOnPlane(cameraPlaneNormal);
    const planeOrthogonal = new Vector3(1, 0, -1).normalize();
    projectedX.setLength(viewWidth / 2 / Math.cos(projectedX.angleTo(planeOrthogonal)));
    const alpha = Math.abs(projectedX.z / (Math.abs(projectedX.z) + Math.abs(camera.position.z)));
    const width = Math.floor(projectedX.lerp(camera.position, alpha).length() / 2);

    const theta = MathUtils.degToRad(camera.fov / 2);
    const beta = Math.PI / 2 - camera.position.angleTo(POSITIVE_Y);
    const gamma = Math.PI / 2 - theta;
    const height =
      Math.floor((viewHeight / 2) * Math.sin(gamma)) / Math.sin(Math.PI - gamma - beta);
    return { width, height };
  }, [camera]);

  const [dimensions, setDimensions] = useState(calculateDimensions);

  useEffect(() => {
    const observer = new ResizeObserver(() => setDimensions(calculateDimensions()));
    observer.observe(renderer.domElement);
    return observer.disconnect;
  }, [calculateDimensions, renderer]);

  return dimensions;
};

export const Walls = () => {
  const dimensions = useWallDimensions();
  return (
    <>
      {/* TODO: store props as array and map */}
      <Wall {...dimensions} delay={0.125} position={[0.5, 0, 1]} />
      <Wall
        {...dimensions}
        delay={0.125 / 2}
        startZero
        position={[1, 0, 0.5]}
        rotation-y={Math.PI / 2}
      />
      <Wall {...dimensions} delay={0.125} position={[-1, 0, -0.5]} rotation-y={(3 * Math.PI) / 2} />
      <Wall {...dimensions} delay={0.25} startZero position={[-0.5, 0, -1]} rotation-y={Math.PI} />
    </>
  );
};

type WallProps = {
  height: number;
  width: number;
  startZero?: boolean;
  delay?: number;
} & ThreeElements["group"];

const Wall = ({
  height,
  width: bricksPerRow,
  startZero = false,
  delay = 1,
  ...props
}: WallProps) => {
  const instances = useRef<InstancedMesh>(null!);

  const layerCount = Math.floor(height / brickHeight - 1);
  const count = layerCount * bricksPerRow;
  const progress = useRef(-delay);
  const stagger = 0.05;
  const duration = 0.75;

  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) {
      getTargetPosition(i, bricksPerRow, startZero, target);
      target.add(new Vector3(0, 10, 0));
      mtx.setPosition(target);
      instances.current.setMatrixAt(i, mtx);
      color.set(Color.NAMES.dodgerblue).lerp(lightblue, MathUtils.seededRandom(i));
      instances.current.setColorAt(i, color);
    }
  }, [count, layerCount, bricksPerRow]);

  useFrame((_, delta) => {
    progress.current += delta;
    // TODO: bail out early if animation is complete
    for (let i = 0; i < count; i++) {
      const threshold = progress.current - i * stagger;
      if (threshold < 0) continue;
      const alpha = MathUtils.smootherstep(threshold, 0, duration);
      getTargetPosition(i, bricksPerRow, startZero, target);
      const currentY = MathUtils.lerp(height, target.y, alpha);
      instances.current.setMatrixAt(i, mtx.setPosition(target.setY(currentY)));
    }
    instances.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group {...props}>
      <instancedMesh ref={instances} args={[brickGeometry, wallMaterial, count]} />
    </group>
  );
};

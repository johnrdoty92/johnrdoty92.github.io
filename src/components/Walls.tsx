import { useLayoutEffect, useRef } from "react";
import {
  Color,
  MathUtils,
  Matrix4,
  MeshStandardMaterial,
  Vector3,
  type InstancedMesh,
} from "three";
import { brickGeometry, brickHeight, brickLength } from "../util/brickGeometry";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";

const wallMaterial = new MeshStandardMaterial({ roughness: 0.2, metalness: 0 });
const color = new Color();
const lightblue = new Color(Color.NAMES.midnightblue).lerp(
  new Color(Color.NAMES.mediumturquoise),
  0.33
);
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

type WallProps = {
  startZero?: boolean;
  delay?: number;
} & ThreeElements["group"];

const Wall = ({ startZero = false, delay = 1, ...props }: WallProps) => {
  const { width: bricksPerRow, height } = useRotatingDisplayContext().dimensions;
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
      color.set(Color.NAMES.midnightblue).lerp(lightblue, MathUtils.seededRandom(i));
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
    instances.current.computeBoundingSphere();
  });

  return (
    <group
      {...props}
      onPointerOver={(e) => e.stopPropagation()}
      onPointerOut={(e) => e.stopPropagation()}
    >
      <instancedMesh ref={instances} args={[brickGeometry, wallMaterial, count]} />
    </group>
  );
};

const walls: WallProps[] = [
  { delay: 0.125, position: [0.5, 0, 1] },
  { delay: 0.125 / 2, startZero: true, position: [1, 0, 0.5], rotation: [0, Math.PI / 2, 0] },
  { delay: 0.125, position: [-1, 0, -0.5], rotation: [0, (3 * Math.PI) / 2, 0] },
  { delay: 0.25, startZero: true, position: [-0.5, 0, -1], rotation: [0, Math.PI, 0] },
];

export const Walls = () => walls.map((props, i) => <Wall key={i} {...props} />);

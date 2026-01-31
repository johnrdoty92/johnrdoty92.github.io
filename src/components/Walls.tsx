import { useLayoutEffect, useRef } from "react";
import { Color, InstancedMesh, MathUtils, Matrix4, MeshStandardMaterial, Vector3 } from "three";
import { brickGeometry, brickHeight, brickLength } from "../util/brickGeometry";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { theme } from "../constants/styles";

const mtx = new Matrix4();
const startingHeightOffset = 20;
const target = new Vector3();
const wallMaterial = new MeshStandardMaterial({ roughness: 0.2, metalness: 0 });
const color = new Color();
const gradientStops = [theme.dark, theme.secondary, theme.primary, theme.light].map(
  (c) => new Color(c),
);

const getTargetPosition = (
  index: number,
  bricksPerRow: number,
  startZero: boolean,
  // TODO: probably don't need an out?
  out: Vector3,
) => {
  const rowLevel = Math.floor(index / bricksPerRow);
  const y = rowLevel * brickHeight;
  const offset = rowLevel % 2 === (startZero ? 0 : 1) ? 1 : 0;
  const isOddRow = rowLevel % 2 === 1;
  const rowIndex = isOddRow ? index % bricksPerRow : bricksPerRow - 1 - (index % bricksPerRow);
  const z = rowIndex * brickLength + offset;
  out.set(0, y, z);
};

const getGradientColor = (index: number, total: number, colors: Color[], out: Color) => {
  const sectionLength = total / (colors.length - 1);
  const colorIndex1 = Math.floor(index / sectionLength);
  const colorIndex2 = Math.min(colors.length - 1, colorIndex1 + 1);
  out.lerpColors(colors[colorIndex1], colors[colorIndex2], MathUtils.seededRandom(index));
};

const wallsProps: ThreeElements["mesh"][] = [
  { position: [0.5, 0, 1] },
  { position: [1, 0, 0.5], rotation: [0, Math.PI / 2, 0] },
  { position: [-1, 0, -0.5], rotation: [0, (3 * Math.PI) / 2, 0] },
  { position: [-0.5, 0, -1], rotation: [0, Math.PI, 0] },
];

export const Walls = () => {
  const instances = wallsProps.map(() => useRef<InstancedMesh>(null!));
  const { width: bricksPerRow, height } = useRotatingDisplayContext();

  const layerCount = Math.floor(height / brickHeight - 1);
  const count = layerCount * bricksPerRow;
  const progress = useRef(0);
  const overlap = 0.1;
  const duration = 5;

  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < instances.length; j++) {
        getTargetPosition(i, bricksPerRow, j % 2 === 1, target);
        target.y += startingHeightOffset;
        mtx.setPosition(target);
        instances[j].current.setMatrixAt(i, mtx);
        getGradientColor(i, count, gradientStops, color);
        instances[j].current.setColorAt(i, color);
      }
    }
  }, [count, layerCount, bricksPerRow]);

  // TODO: pull this into a useImperativeHandle to control from the outside
  // totalProgress will be passed in, removing the need for the progress ref
  useFrame((_, delta) => {
    progress.current = MathUtils.clamp(progress.current + delta, 0, duration);
    const totalProgress = progress.current / duration;
    for (let j = 0; j < instances.length; j++) {
      for (let i = 0; i < count; i++) {
        const chunk = 1 / count;
        const start = chunk * i - chunk * i * overlap;
        const stop = chunk * (i + 1) + overlap * (1 - chunk * (i + 1));
        const alpha = MathUtils.smootherstep(totalProgress, start, stop);
        getTargetPosition(i, bricksPerRow, j % 2 === 1, target);
        // TODO: adjust fog for height?
        const startingHeight = 15;
        const offsetY = (1 - alpha) * startingHeight + target.y;
        instances[j].current.setMatrixAt(i, mtx.setPosition(target.setY(offsetY)));
      }
      instances[j].current.instanceMatrix.needsUpdate = true;
      instances[j].current.computeBoundingSphere();
    }
  });

  return wallsProps.map((props, i) => (
    <instancedMesh
      key={i}
      {...props}
      ref={instances[i]}
      args={[brickGeometry, wallMaterial, count]}
    />
  ));
};

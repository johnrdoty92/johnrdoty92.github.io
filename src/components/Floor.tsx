import { useThree } from "@react-three/fiber";
import {
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Vector2,
  Vector3,
  type PerspectiveCamera,
} from "three";
import { brickWidth, studGeometry, brickHeight } from "../util/brickGeometry";
import { useCallback, useEffect, useState } from "react";

const floorColor = 0x004a2d;
const studMaterial = new MeshStandardMaterial({ color: floorColor, roughness: 0.4, metalness: 0 });

const mtx = new Matrix4();
const position = new Vector3();
const PADDING = 4;

export const Floor = () => {
  const camera = useThree((state) => state.camera as PerspectiveCamera);
  const renderer = useThree((state) => state.gl);

  const getGridSize = useCallback(() => {
    const { x } = camera.getViewSize(camera.position.length(), new Vector2());
    const diagonal = Math.ceil(Math.sqrt(x ** 2 / 2));
    return diagonal + (1 - (diagonal % 2)) + PADDING;
  }, [camera]);

  const [gridSize, setGridSize] = useState(getGridSize());
  const studCount = gridSize ** 2;

  const ref = useCallback(
    (instances: InstancedMesh) => {
      if (!instances) return;
      const offset = Math.floor(gridSize / 2);
      for (let i = 0; i < studCount; i++) {
        const x = (i % gridSize) - offset + brickWidth / 2;
        const z = Math.floor(i / gridSize) - offset;
        mtx.setPosition(position.set(x, 0, z));
        instances.setMatrixAt(i, mtx);
      }
    },
    [gridSize],
  );

  useEffect(() => {
    const observer = new ResizeObserver(() => setGridSize(getGridSize()));
    observer.observe(renderer.domElement);
    return observer.disconnect;
  }, [renderer, getGridSize]);

  return (
    <group>
      <instancedMesh
        args={[studGeometry, studMaterial, studCount]}
        position={[-0.5, -brickHeight, -0.5]}
        ref={ref}
      />
      <mesh rotation-x={-Math.PI / 2} material={studMaterial}>
        <planeGeometry args={[gridSize, gridSize]} />
      </mesh>
    </group>
  );
};

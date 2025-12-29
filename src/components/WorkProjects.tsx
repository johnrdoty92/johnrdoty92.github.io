import type { ThreeElements } from "@react-three/fiber";
import { CylinderGeometry } from "three";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";

const OFFSET = 1.5;

const placeholderGeometry = new CylinderGeometry(0.5, 0.5, 2).translate(0, 1, 0);

const Placeholder = (props: ThreeElements["mesh"]) => (
  <mesh {...props} geometry={placeholderGeometry}>
    <meshNormalMaterial />
  </mesh>
);

export const WorkProjects = () => {
  const { width } = useRotatingDisplayContext().dimensions;
  const planePosition = width + width / 2;
  return (
    <>
      <Placeholder position={[-planePosition, 2, -planePosition]} />
      <Placeholder position={[-planePosition - OFFSET, 1, -planePosition]} />
      <Placeholder position={[-planePosition, 0, -planePosition - OFFSET]} />
    </>
  );
};

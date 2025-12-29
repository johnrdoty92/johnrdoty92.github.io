import type { ThreeElements } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { BoxGeometry } from "three";

const OFFSET = 1.5;

const placeholderGeometry = new BoxGeometry(1, 2, 1).translate(0, 1, 0);

const Placeholder = (props: ThreeElements["mesh"]) => (
  <mesh {...props} geometry={placeholderGeometry}>
    <meshNormalMaterial />
  </mesh>
);

export const WorkExperience = () => {
  const { width } = useRotatingDisplayContext().dimensions;
  const planePosition = width + width / 2;
  return (
    <>
      <Placeholder position={[planePosition, 2, -planePosition]} />
      <Placeholder position={[planePosition + OFFSET, 1, -planePosition]} />
      <Placeholder position={[planePosition, 0, -planePosition - OFFSET]} />
    </>
  );
};

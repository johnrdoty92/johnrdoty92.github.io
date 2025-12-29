import type { ThreeElements } from "@react-three/fiber";
import { BoxGeometry, Vector3 } from "three";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";

const placeholderGeometry = new BoxGeometry(1, 2, 1).translate(0, 1, 0);

const COUNT = 4;

const Placeholder = (props: ThreeElements["mesh"]) => (
  <mesh {...props} geometry={placeholderGeometry}>
    <meshNormalMaterial />
  </mesh>
);

const models = Array(COUNT)
  .fill(0)
  .map((_, index) => index);

export const SocialLinks = () => {
  const { width } = useRotatingDisplayContext().dimensions;
  const planePosition = width * 2 + 1;
  const leftEdge = new Vector3(-planePosition, 0, 1);
  const rightEdge = new Vector3(-1, 0, planePosition);
  return models.map((index) => (
    <Placeholder position={new Vector3().lerpVectors(leftEdge, rightEdge, index / COUNT + 0.125)} />
  ));
};

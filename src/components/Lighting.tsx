import type { Vector3Tuple } from "three";

const keyLight: Vector3Tuple = [2, 1, 0];
const fillLight: Vector3Tuple = [0.5, 0, 3];
const backLight: Vector3Tuple = [-0.2, 1, 0];

export const Lighting = () => {
  return (
    <>
      <directionalLight position={keyLight} args={["rgb(254, 136, 40)", 10]} />
      <directionalLight position={fillLight} args={["rgb(34, 251, 255)", 0.5]} />
      <directionalLight position={backLight} args={["rgb(255, 41, 241)", 2]} />
    </>
  );
};

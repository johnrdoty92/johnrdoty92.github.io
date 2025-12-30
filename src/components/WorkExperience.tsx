import type { ThreeElements } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { BoxGeometry } from "three";
import { useModalContext } from "../contexts/Modal";

const OFFSET = 1.5;

const placeholderGeometry = new BoxGeometry(1, 2, 1).translate(0, 1, 0);

const Placeholder = (props: ThreeElements["mesh"]) => {
  const { open, close } = useModalContext();
  return (
    <mesh
      {...props}
      geometry={placeholderGeometry}
      onClick={() => open("placeholder" + props.userData!.value)}
    >
      <meshNormalMaterial />
    </mesh>
  );
};

export const WorkExperience = () => {
  const { width } = useRotatingDisplayContext().dimensions;
  const planePosition = width + width / 2;
  return (
    <>
      <Placeholder userData={{ value: " A" }} position={[planePosition, 2, -planePosition]} />
      <Placeholder
        userData={{ value: " B" }}
        position={[planePosition + OFFSET, 1, -planePosition]}
      />
      <Placeholder
        userData={{ value: " C" }}
        position={[planePosition, 0, -planePosition - OFFSET]}
      />
    </>
  );
};

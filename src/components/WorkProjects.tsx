import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { Suspense } from "react";
import { Laptop } from "./Laptop";

const OFFSET = 1.5;

export const WorkProjects = () => {
  const { width } = useRotatingDisplayContext().dimensions;
  const planePosition = width + width / 2;
  return (
    // TODO: handle fallback
    <Suspense fallback={<></>}>
      <Laptop screen="hashport" position={[-planePosition, 0, -planePosition]} />
      <Laptop screen="digital_toolbox" position={[-planePosition - OFFSET, 0, -planePosition]} />
      <Laptop screen="hashport_metrics" position={[-planePosition, 0, -planePosition - OFFSET]} />
    </Suspense>
  );
};

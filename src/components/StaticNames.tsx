import { Suspense } from "react";
import { Name } from "./Name";

export const StaticNames = () => {
  return (
    <Suspense>
      <Name />
      <Name rotation-y={-Math.PI / 2} position={[-1, 0, -1]} />
      <Name rotation-y={-Math.PI} />
    </Suspense>
  );
};

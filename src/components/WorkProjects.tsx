import { Suspense } from "react";
import { Laptop } from "./Laptop";

export const WorkProjects = () => {
  return (
    // TODO: handle fallback
    <Suspense fallback={<></>}>
      <Laptop position="left" screen="hashport" />
      <Laptop position="center" screen="digital_toolbox" />
      <Laptop position="right" screen="hashport_metrics" />
    </Suspense>
  );
};

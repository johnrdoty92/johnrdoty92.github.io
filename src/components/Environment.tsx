import { useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { EquirectangularReflectionMapping } from "three";
import { UltraHDRLoader } from "three/examples/jsm/loaders/UltraHDRLoader.js";
import hdri from "../assets/bambanani_sunset_1k.jpg?url";

const LoadEnvironment = () => {
  const scene = useThree((state) => state.scene);
  const map = useLoader(UltraHDRLoader, hdri);

  useEffect(() => {
    map.mapping = EquirectangularReflectionMapping;
    scene.environment = map;
    scene.environmentIntensity = 1;
  }, [scene, map]);

  return null;
};

export const Environment = () => {
  return (
    <Suspense fallback={null}>
      <LoadEnvironment />
    </Suspense>
  );
};

useLoader.preload(UltraHDRLoader, hdri);

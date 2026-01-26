import { useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { EquirectangularReflectionMapping } from "three";
import { UltraHDRLoader } from "three/examples/jsm/loaders/UltraHDRLoader.js";
import hdri from "../assets/bambanani_sunset_2k.jpg?url";

export const Environment = () => {
  return (
    <Suspense fallback={<></>}>
      <EnvironmentMap />
    </Suspense>
  );
};

const EnvironmentMap = () => {
  const scene = useThree((state) => state.scene);
  const map = useLoader(UltraHDRLoader, hdri);

  useEffect(() => {
    map.mapping = EquirectangularReflectionMapping;
    scene.environment = map;
    scene.environmentIntensity = 0.8;
  }, [scene, map]);

  return null;
};

useLoader.preload(UltraHDRLoader, hdri);

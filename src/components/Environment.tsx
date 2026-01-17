import { useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { EquirectangularReflectionMapping } from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import hdri from "../assets/bambanani_sunset_2k.hdr?url";

export const Environment = () => {
  return (
    <Suspense fallback={<></>}>
      <EnvironmentMap />
    </Suspense>
  );
};

const EnvironmentMap = () => {
  const scene = useThree((state) => state.scene);
  const map = useLoader(HDRLoader, hdri);

  useEffect(() => {
    map.mapping = EquirectangularReflectionMapping;
    scene.environment = map;
    scene.environmentIntensity = 0.8;
  }, [scene, map]);

  return null;
};

useLoader.preload(HDRLoader, hdri);

import { useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { EquirectangularReflectionMapping, TextureLoader } from "three";
import ggsHouse from "../assets/ggs_house.webp";

export const Environment = () => {
  return (
    <Suspense fallback={<></>}>
      <EnvironmentMap />
    </Suspense>
  );
};

const EnvironmentMap = () => {
  const scene = useThree((state) => state.scene);
  const map = useLoader(TextureLoader, ggsHouse);

  useEffect(() => {
    map.mapping = EquirectangularReflectionMapping;
    scene.environment = map;
    scene.environmentIntensity = 1.5;
  }, [scene, map]);

  return null;
};

useLoader.preload(TextureLoader, ggsHouse);

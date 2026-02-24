import { useLoader, useThree } from "@react-three/fiber";
import { useEffect, useImperativeHandle, useRef, type RefObject } from "react";
import { EquirectangularReflectionMapping } from "three";
import { UltraHDRLoader } from "three/examples/jsm/loaders/UltraHDRLoader.js";
import hdri from "@/assets/bambanani_sunset_1k.jpg?url";

export interface EnvironmentHandle {
  checkIsLoaded: () => boolean;
}

export const Environment = ({ ref }: { ref: RefObject<EnvironmentHandle | null> }) => {
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);
  const map = useLoader(UltraHDRLoader, hdri);
  const isLoaded = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      checkIsLoaded: () => isLoaded.current,
    }),
    [],
  );

  useEffect(() => {
    gl.initTexture(map);
    map.mapping = EquirectangularReflectionMapping;
    scene.environment = map;
    scene.environmentIntensity = 1;
    isLoaded.current = true;
    document.querySelector(".initials")?.classList.add("hidden");
  }, [scene, map, gl]);

  return null;
};

useLoader.preload(UltraHDRLoader, hdri);

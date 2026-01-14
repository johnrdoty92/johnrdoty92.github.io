import { useFrame, useLoader, type ThreeElements } from "@react-three/fiber";
import { MathUtils, Sprite, TextureLoader } from "three";
import { getAssetUrl } from "../util/getAssetUrl";
import { useRef } from "react";
import { IS_TOUCH_DEVICE } from "../constants/device";

export const ClickIndicator = (props: ThreeElements["group"]) => {
  const cursorTexture = useLoader(
    TextureLoader,
    getAssetUrl(IS_TOUCH_DEVICE ? "pointer" : "arrow", ".webp")
  );
  const ref = useRef<Sprite>(null!);

  // TODO: abstract wave util
  const frequency = 4;
  const amplitude = 0.5;
  const phaseShift = 0;
  const verticalShift = 0.5;

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const wave = amplitude * (Math.sin(elapsed * frequency) + phaseShift) + verticalShift;
    ref.current.position.y = wave / 4;
    ref.current.material.opacity = MathUtils.smoothstep(1 - wave, 0.1, 0.9);
    ref.current.material.rotation = MathUtils.lerp(Math.PI / 4, Math.PI / 8, wave);
  });

  return (
    <group {...props}>
      <sprite ref={ref} material-map={cursorTexture} material-transparent scale={0.45} />
    </group>
  );
};

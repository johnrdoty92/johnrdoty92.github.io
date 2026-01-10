import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";

type ToggleAnimationConfig = {
  speed: number;
};

const defaultConfig: ToggleAnimationConfig = {
  speed: 2,
} as const;

export const useToggleAnimationState = (
  isToggled: boolean,
  animate: (alpha: number) => void,
  config: Partial<ToggleAnimationConfig> = {}
) => {
  const accumulator = useRef(0);
  const { speed } = { ...defaultConfig, ...config };

  useFrame((_, delta) => {
    const scaledDelta = speed * (isToggled ? delta : -delta);
    accumulator.current = MathUtils.clamp(accumulator.current + scaledDelta, 0, 1);
    const alpha = MathUtils.smoothstep(accumulator.current, 0, 1);
    animate(alpha);
  });
};

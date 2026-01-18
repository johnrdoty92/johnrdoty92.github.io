import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";

type ToggleAnimationConfig = {
  speed: number;
  delay: number;
};

const defaultConfig: ToggleAnimationConfig = {
  speed: 2,
  delay: 0,
} as const;

export const useToggleAnimationState = (
  isToggled: boolean,
  animate: (alpha: number) => void,
  config: Partial<ToggleAnimationConfig> = {},
) => {
  const accumulator = useRef(0);
  const delayAccumulator = useRef(0);
  const { speed, delay } = { ...defaultConfig, ...config };

  useFrame((_, delta) => {
    if (delayAccumulator.current >= delay) {
      const scaledDelta = speed * (isToggled ? delta : -delta);
      accumulator.current = MathUtils.clamp(accumulator.current + scaledDelta, 0, 1);
      const isCompleteTransition = accumulator.current === (isToggled ? 1 : 0);
      if (isCompleteTransition) return;
      const alpha = MathUtils.smoothstep(accumulator.current, 0, 1);
      animate(alpha);
    } else {
      delayAccumulator.current += delta * 1000;
    }
  });
};

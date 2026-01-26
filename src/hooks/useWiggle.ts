import { useThree } from "@react-three/fiber";
import { useCallback } from "react";

type WaveConfig = {
  frequency: number;
  amplitude: number;
  phaseShift: number;
  verticalShift: number;
};

const waveDefaults: WaveConfig = {
  frequency: 1,
  amplitude: 1,
  phaseShift: 0,
  verticalShift: 0,
};

export const useWiggle = (config: Partial<WaveConfig> = {}) => {
  const get = useThree((state) => state.get);
  const { frequency, amplitude, phaseShift, verticalShift } = { ...waveDefaults, ...config };
  return useCallback(() => {
    const elapsed = get().clock.getElapsedTime();
    return amplitude * (Math.sin(elapsed * frequency) + phaseShift) + verticalShift;
  }, [get, frequency, amplitude, phaseShift, verticalShift]);
};

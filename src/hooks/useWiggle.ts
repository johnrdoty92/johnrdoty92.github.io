import { useThree } from "@react-three/fiber";
import { useCallback } from "react";

export type WaveConfig = {
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
  const wiggleConfig = { ...waveDefaults, ...config };
  return useCallback(
    (override?: Partial<WaveConfig>) => {
      const elapsed = get().clock.getElapsedTime();
      const amplitude = override?.amplitude ?? wiggleConfig.amplitude;
      const frequency = override?.frequency ?? wiggleConfig.frequency;
      const phaseShift = override?.phaseShift ?? wiggleConfig.phaseShift;
      const verticalShift = override?.verticalShift ?? wiggleConfig.verticalShift;
      return amplitude * Math.sin((elapsed + phaseShift) * frequency) + verticalShift;
    },
    [
      get,
      wiggleConfig.frequency,
      wiggleConfig.amplitude,
      wiggleConfig.phaseShift,
      wiggleConfig.verticalShift,
    ],
  );
};

import { useThree } from "@react-three/fiber";
import { MathUtils } from "three";

const MIN = 0.25;
const MAX = 1;
export const useResponsiveFontSize = () => {
  const aspect = useThree(({ size }) => size.width / size.height);
  return MathUtils.clamp(MathUtils.mapLinear(aspect, 0, 1, MIN, MAX), MIN, MAX);
};

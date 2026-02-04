import type { Vector3Tuple } from "three";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { brickWidth } from "../util/brickGeometry";
import { useMediaQuery } from "./useMediaQuery";

export const useHeaderPosition = (): Vector3Tuple => {
  const { height } = useRotatingDisplayContext();
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const heightOffset = isMobile ? 2.6 : 3.6;
  return [brickWidth, height - heightOffset, brickWidth];
};

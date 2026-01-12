import { useThree } from "@react-three/fiber";
import { type PerspectiveCamera, Vector2, Vector3, type Vector3Like } from "three";
import { useMediaQuery } from "./useMediaQuery";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { POSITIVE_Y } from "../constants/vectors";

const DIAGONAL = new Vector3(-1, 0, 1);

export const useTargetFocusedPosition = (
  /** Values between 0 and 1 representing distance from camera. 1 is camera position */
  proximity = 0.8,
  /** For specifying the origin of the mesh */
  offset: Vector3Like = { x: 0, y: 0, z: 0 }
) => {
  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const camera = useThree((state) => state.camera as PerspectiveCamera);
  const scaledOrigin = camera.position.clone().multiplyScalar(proximity);
  const distance = camera.position.length() - scaledOrigin.length();
  const viewSize = camera.getViewSize(distance, new Vector2());
  const base = (isMobileScreen ? viewSize.y : viewSize.x) / 2;
  const displacement = camera.position
    .clone()
    .cross(isMobileScreen ? DIAGONAL : POSITIVE_Y)
    .setLength(base);
  const maxPosition = new Vector3().subVectors(scaledOrigin, displacement);
  const alpha = isMobileScreen ? 0.7 : 0.5;
  return maxPosition.lerp(scaledOrigin, alpha).add(offset);
};

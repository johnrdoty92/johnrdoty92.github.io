import { useThree } from "@react-three/fiber";
import { theme } from "../constants/styles";

export const Fog = () => {
  const distanceToCamera = useThree((state) => state.camera.position.length());
  const startFog = distanceToCamera;
  const maxFog = distanceToCamera * 2;
  return <fog attach="fog" args={[theme.dark, startFog, maxFog]} />;
};

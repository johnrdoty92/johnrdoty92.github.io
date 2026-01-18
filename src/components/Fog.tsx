import { useThree } from "@react-three/fiber";

export const Fog = () => {
  const distanceToCamera = useThree((state) => state.camera.position.length());
  const startFog = distanceToCamera * 1.5;
  const maxFog = distanceToCamera * 2;
  // TODO: use color palette
  return <fog attach="fog" args={["#242424", startFog, maxFog]} />;
};

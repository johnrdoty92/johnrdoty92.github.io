import { useRef, type RefObject } from "react";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";
import { Name } from "./Name";
import { MathUtils, type Group } from "three";

export const AnimatedName = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const groupRef = useRef<Group>(null!);

  useAnimationHandle(
    ref,
    (alpha) => {
      groupRef.current.position.y = MathUtils.lerp(10, 0, alpha);
    },
    [],
  );

  return <Name ref={groupRef} position={[1, 0, 1]} rotation={[0, Math.PI / 2, 0]} />;
};

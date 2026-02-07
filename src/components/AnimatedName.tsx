import { Suspense, useRef, type RefObject } from "react";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";
import { Name } from "./Name";
import { MathUtils, type Group } from "three";

export const AnimatedName = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const groupRef = useRef<Group>(null);

  useAnimationHandle(
    ref,
    (alpha) => {
      if (!groupRef.current) return; // TODO: use return value to check if mounted or not
      groupRef.current.position.y = MathUtils.lerp(10, 0, alpha);
    },
    [],
  );

  return (
    <Suspense>
      <Name ref={groupRef} position={[1, 0, 1]} rotation={[0, Math.PI / 2, 0]} />
    </Suspense>
  );
};

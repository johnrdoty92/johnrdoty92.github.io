import { Suspense, useRef, type RefObject } from "react";
import { Group, MeshBasicMaterial } from "three";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";
import { Header, type HeaderProps } from "./Header";
import { useHeaderPosition } from "../hooks/useHeaderPosition";
import { theme } from "../constants/styles";

const material = new MeshBasicMaterial({ color: theme.light, transparent: true });
const startingYOffset = 4;

export const SectionHeaders = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const groupRef = useRef<Group>(null!);
  const [x, y, z] = useHeaderPosition();

  useAnimationHandle(ref, (alpha: number) => {
    material.opacity = alpha;
    groupRef.current.position.y = (1 - alpha) * startingYOffset;
  });

  const headerProps: HeaderProps[] = [
    { label: "Skills", position: [x + 1, y, z] },
    { label: "Work Experience", position: [0, y, z - 2], rotation: [0, Math.PI / 2, 0] },
    { label: "Work Projects", position: [-x - 1, y, z - 2], rotation: [0, Math.PI, 0] },
    { label: "Contact", position: [-x + 1, y, z], rotation: [0, -Math.PI / 2, 0] },
  ];

  return (
    <Suspense fallback={<></>}>
      <group ref={groupRef}>
        {headerProps.map((props, i) => (
          <Header key={i} {...props} material={material} />
        ))}
      </group>
    </Suspense>
  );
};

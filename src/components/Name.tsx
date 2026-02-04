import { Suspense, useRef, type RefObject } from "react";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";
import { useHeaderPosition } from "../hooks/useHeaderPosition";
import { Header } from "./Header";
import { theme } from "../constants/styles";
import { Group, Mesh, MeshBasicMaterial } from "three";
import { SECTION_COUNT } from "../constants/sections";
import { brickWidth } from "../util/brickGeometry";
import { personalInfo } from "../constants/personalInfo";

const material = new MeshBasicMaterial({ color: theme.light, transparent: true });

export const Name = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const groupRef = useRef<Group>(null!);
  const [x, y, z] = useHeaderPosition();

  useAnimationHandle(
    ref,
    (_: number) => {
      if (!groupRef.current) return;
      groupRef.current.position.y = y; // TODO: add offset and animate
      groupRef.current.children.forEach((child, i) => {
        const text = child.children[0] as Mesh;
        text.geometry.computeBoundingBox();
        // TODO: clean iup logic: +z, +x, -z, -x based on index
        // TODO: responsive padding
        if (i % 4 === 0) {
          child.position.z = text.geometry.boundingBox!.max.x + brickWidth + 0.5;
          child.position.x = x;
        } else if (i % 4 === 1) {
          child.position.x = text.geometry.boundingBox!.max.x + 0.5;
        } else if (i % 4 === 2) {
          child.position.z = -text.geometry.boundingBox!.max.x - brickWidth - 0.5;
          child.position.x = -x;
        } else if (i % 4 === 3) {
          child.position.x = -text.geometry.boundingBox!.max.x - 0.5;
        }

        child.rotation.y = ((i + 1) * Math.PI) / 2;
      });
    },
    [x, y, z],
  );

  return (
    <group ref={groupRef}>
      <Suspense fallback={<></>}>
        {Array(SECTION_COUNT)
          .fill(null)
          .map((_, i) => (
            <Header
              key={i}
              label={personalInfo.name}
              subheader={personalInfo.title}
              wrap={false}
              material={material}
            />
          ))}
      </Suspense>
    </group>
  );
};

import { useLayoutEffect, useRef, type RefObject } from "react";
import { headerFont, subtitleFont } from "@/theme";
import { Group, MathUtils, Mesh, MeshBasicMaterial, MeshPhysicalMaterial } from "three";
import { personalInfo } from "@/constants";
import { type ThreeElements } from "@react-three/fiber";
import {
  useMergeTextGeometryGroups,
  useAnimationHandle,
  type AnimationHandle,
  useResponsiveFontSize,
} from "@/hooks";
import { TEXT_HEIGHT } from "@/constants/text";

const white = new MeshBasicMaterial({ color: "white" });
const black = new MeshPhysicalMaterial({
  color: "black",
  metalness: 1,
  roughness: 0,
  clearcoat: 1,
});

const Name = (props: ThreeElements["group"]) => {
  const name = useRef<Mesh>(null!);
  const title = useRef<Mesh>(null!);
  const onMount = useMergeTextGeometryGroups();
  const size = useResponsiveFontSize();
  const subheaderSize = size * 0.4;
  const fontBaseProps = {
    depth: 0.15,
    curveSegments: 4,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelEnabled: true,
  };

  useLayoutEffect(() => {
    const padding = size / 2;
    name.current.geometry.computeBoundingBox();
    name.current.position.x = -name.current.geometry.boundingBox!.max.x - padding;
    title.current.geometry.computeBoundingBox();
    const titleCenter = title.current.geometry.boundingBox!.max.x / 2;
    const nameCenter = name.current.position.x / 2;
    title.current.position.x = -titleCenter + nameCenter - padding / 2;
  }, [size]);

  return (
    <group {...props}>
      <mesh ref={name} position-y={TEXT_HEIGHT} material={[white, black]}>
        <textGeometry
          ref={onMount}
          args={[
            personalInfo.name.toLowerCase(),
            {
              ...fontBaseProps,
              font: headerFont,
              size,
              bevelThickness: 0.1,
            },
          ]}
        />
      </mesh>
      <mesh ref={title} position-y={TEXT_HEIGHT - subheaderSize - 0.25} material={[black, white]}>
        <textGeometry
          ref={onMount}
          args={[
            personalInfo.title.toUpperCase(),
            {
              ...fontBaseProps,
              font: subtitleFont,
              size: subheaderSize,
              bevelThickness: 0.05,
            },
          ]}
        />
      </mesh>
    </group>
  );
};

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

export const StaticNames = () => {
  return (
    <>
      <Name />
      <Name rotation-y={-Math.PI / 2} position={[-1, 0, -1]} />
      <Name rotation-y={-Math.PI} />
    </>
  );
};

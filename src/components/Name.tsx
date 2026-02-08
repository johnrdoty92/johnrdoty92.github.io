import { useLayoutEffect, useRef } from "react";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { Mesh, MeshBasicMaterial } from "three";
import { personalInfo } from "../constants/personalInfo";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { type ThreeElements } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { headerFont, subtitleFont } from "../constants/fonts";

const white = new MeshBasicMaterial({ color: "white", transparent: true });
const black = new MeshBasicMaterial({ color: "black", transparent: true });

export const Name = (props: ThreeElements["group"]) => {
  const { height } = useRotatingDisplayContext();
  const meshRef = useRef<Mesh>(null!);
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const size = isMobile ? 0.5 : 0.75;
  const padding = isMobile ? 0.25 : 1;
  const subheaderSize = size * 0.25;
  const depth = 0.15;
  const curveSegments = 4;
  const heightOffset = isMobile ? 2.6 : 3.75;

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.geometry.computeBoundingBox();
    meshRef.current.position.x = -meshRef.current.geometry.boundingBox!.max.x - padding;
  }, [padding]);

  return (
    <group {...props}>
      <mesh ref={meshRef} position-y={height - heightOffset} material={[white, black]}>
        <textGeometry
          args={[personalInfo.name, { font: headerFont, size, depth, curveSegments }]}
        />
        <mesh position-y={-size + 0.15} material={[black, white]}>
          <textGeometry
            args={[
              personalInfo.title.toUpperCase(),
              { font: subtitleFont, size: subheaderSize, depth, curveSegments },
            ]}
          />
        </mesh>
      </mesh>
    </group>
  );
};

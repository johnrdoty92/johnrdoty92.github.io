import { useLayoutEffect, useRef } from "react";
import { MOBILE_BREAKPOINT_QUERY, theme } from "../constants/styles";
import { Mesh, MeshBasicMaterial } from "three";
import { personalInfo } from "../constants/personalInfo";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { useLoader, type ThreeElements } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";

const nameMaterial = new MeshBasicMaterial({ color: theme.light, transparent: true });
const titleMaterial = new MeshBasicMaterial({ color: theme.secondary, transparent: true });

export const Name = (props: ThreeElements["group"]) => {
  const { height } = useRotatingDisplayContext();
  const meshRef = useRef<Mesh>(null!);
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const font = useLoader(FontLoader, "/Poppins_Bold.json");
  const size = isMobile ? 0.5 : 0.75;
  const padding = isMobile ? 0.25 : 1;
  const subheaderSize = size * 0.5;
  const depth = 0.05;
  const curveSegments = 2;
  const heightOffset = isMobile ? 2.6 : 3.75;

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.geometry.computeBoundingBox();
    meshRef.current.position.x = -meshRef.current.geometry.boundingBox!.max.x - padding;
  }, [padding]);

  return (
    <group {...props}>
      <mesh ref={meshRef} position-y={height - heightOffset} material={nameMaterial}>
        <textGeometry args={[personalInfo.name, { font, size, depth, curveSegments }]} />
        <mesh position-y={-size + 0.05} material={titleMaterial}>
          <textGeometry
            args={[personalInfo.title, { font, size: subheaderSize, depth, curveSegments }]}
          />
        </mesh>
      </mesh>
    </group>
  );
};

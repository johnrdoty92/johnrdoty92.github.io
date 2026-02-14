import { useLayoutEffect, useRef } from "react";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { Mesh, MeshBasicMaterial, MeshPhysicalMaterial } from "three";
import { personalInfo } from "../constants/personalInfo";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { type ThreeElements } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { headerFont, subtitleFont } from "../constants/fonts";

const white = new MeshBasicMaterial({ color: "white" });
const black = new MeshBasicMaterial({ color: "black" });
const border = new MeshPhysicalMaterial({
  color: "black",
  metalness: 1,
  roughness: 0,
  clearcoat: 1,
});

export const Name = (props: ThreeElements["group"]) => {
  const { height } = useRotatingDisplayContext();
  const name = useRef<Mesh>(null!);
  const title = useRef<Mesh>(null!);
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const size = isMobile ? 0.7 : 0.9;
  const padding = isMobile ? 0.3 : 1;
  const subheaderSize = size * 0.4;
  const heightOffset = 3.75;
  const fontBaseProps = {
    depth: 0.15,
    curveSegments: 4,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelEnabled: true,
  };

  useLayoutEffect(() => {
    name.current.geometry.computeBoundingBox();
    name.current.position.x = -name.current.geometry.boundingBox!.max.x - padding;
    title.current.geometry.computeBoundingBox();
    const titleCenter = title.current.geometry.boundingBox!.max.x / 2;
    const nameCenter = name.current.position.x / 2;
    title.current.position.x = -titleCenter + nameCenter - padding;
  }, [padding, Math.random()]);

  return (
    <group {...props}>
      <mesh ref={name} position-y={height - heightOffset} material={[white, border]}>
        <textGeometry
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
      <mesh
        ref={title}
        position-y={height - heightOffset - subheaderSize - 0.25}
        material={[black, white]}
      >
        <textGeometry
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

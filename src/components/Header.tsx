import { extend, type ThreeElement, type ThreeElements, useLoader } from "@react-three/fiber";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Material } from "three";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: ThreeElement<typeof TextGeometry>;
  }
}

export type HeaderProps = {
  label: string;
  subheader?: string;
  wrap?: boolean;
  material?: Material;
} & ThreeElements["group"];

export const Header = ({ label, subheader, material, wrap = true, ...props }: HeaderProps) => {
  const font = useLoader(FontLoader, "/Poppins_Bold.json");
  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const size = isMobileScreen ? 0.5 : 0.75;
  const subheaderSize = size * 0.5;
  const lineGap = 0.25;
  const depth = 0.075;
  const curveSegments = 2;
  // TODO: add accessibility

  const lines = wrap ? label.split(" ") : [label];

  return (
    <group {...props}>
      {lines.map((text, i) => (
        <mesh key={i} position-y={-i * size - (i > 0 ? lineGap : 0)} material={material}>
          <textGeometry args={[text, { font, size, depth, curveSegments }]} />
        </mesh>
      ))}
      {subheader && (
        <mesh position-y={-(lines.length * (size + lineGap) - lineGap)} material={material}>
          <textGeometry args={[subheader, { font, size: subheaderSize, depth, curveSegments }]} />
        </mesh>
      )}
    </group>
  );
};

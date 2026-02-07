import { Suspense, useRef, type RefObject } from "react";
import { Group, MeshBasicMaterial } from "three";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";
import { MOBILE_BREAKPOINT_QUERY, theme } from "../constants/styles";
import { extend, useLoader, type ThreeElement, type ThreeElements } from "@react-three/fiber";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { brickWidth } from "../util/brickGeometry";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: ThreeElement<typeof TextGeometry>;
  }
}
const material = new MeshBasicMaterial({ color: theme.light, transparent: true });
const startingYOffset = 4;

type HeaderProps = { label: string } & ThreeElements["group"];

const Header = ({ label, ...props }: HeaderProps) => {
  const font = useLoader(FontLoader, "/Poppins_Bold.json");
  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const size = isMobileScreen ? 0.5 : 0.75;
  const lineGap = 0.25;
  const depth = 0.075;
  const curveSegments = 2;
  // TODO: add accessibility
  return (
    <group {...props}>
      {label.split(" ").map((text, i) => (
        <mesh key={i} position-y={-i * size - (i > 0 ? lineGap : 0)} material={material}>
          <textGeometry args={[text, { font, size, depth, curveSegments }]} />
        </mesh>
      ))}
    </group>
  );
};

export const SectionHeaders = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const groupRef = useRef<Group>(null!);
  const { height } = useRotatingDisplayContext();
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const heightOffset = isMobile ? 2.7 : 3.7;
  const [x, y, z] = [brickWidth, height - heightOffset, brickWidth];

  useAnimationHandle(ref, (alpha: number) => {
    if (!groupRef.current) return; // TODO: use return value to check if mounted or not
    material.opacity = alpha;
    groupRef.current.position.y = (1 - alpha) * startingYOffset;
  });

  const headerProps: ({ label: string } & ThreeElements["group"])[] = [
    { label: "Skills", position: [x + 1, y, z] },
    { label: "Work Experience", position: [0, y, z - 2], rotation: [0, Math.PI / 2, 0] },
    { label: "Work Projects", position: [-x - 1, y, z - 2], rotation: [0, Math.PI, 0] },
    { label: "Contact", position: [-x + 1, y, z], rotation: [0, -Math.PI / 2, 0] },
  ];

  return (
    <group ref={groupRef}>
      {headerProps.map((props, i) => (
        <Suspense key={i}>
          <Header {...props} />
        </Suspense>
      ))}
    </group>
  );
};

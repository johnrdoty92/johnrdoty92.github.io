import { useRef, type RefObject } from "react";
import { Group, MeshBasicMaterial } from "three";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";
import { MOBILE_BREAKPOINT_QUERY, theme } from "../constants/styles";
import { extend, type ThreeElement, type ThreeElements } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { brickWidth } from "../util/brickGeometry";
import { headerFont } from "../constants/fonts";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: ThreeElement<typeof TextGeometry>;
  }
}
const face = new MeshBasicMaterial({ color: theme.focus, transparent: true });
const side = new MeshBasicMaterial({ color: theme.secondary, transparent: true });
const startingYOffset = 4;

type HeaderProps = { label: string } & ThreeElements["group"];

const Header = ({ label, ...props }: HeaderProps) => {
  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const size = isMobileScreen ? 0.6 : 0.75;
  const lineGap = 0.25;
  // TODO: add accessibility
  return (
    <group {...props}>
      {label.split(" ").map((text, i) => (
        <mesh key={i} position-y={-i * size - (i > 0 ? lineGap : 0)} material={[face, side]}>
          <textGeometry
            args={[
              text,
              {
                font: headerFont,
                size,
                depth: 0.15,
                curveSegments: 2,
                bevelEnabled: true,
                bevelSize: 0.03,
                bevelOffset: 0.01,
                bevelThickness: 0.05,
              },
            ]}
          />
        </mesh>
      ))}
    </group>
  );
};

export const SectionHeaders = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const groupRef = useRef<Group>(null!);
  const { height } = useRotatingDisplayContext();
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const heightOffset = isMobile ? 3.9 : 3.7;
  const [x, y, z] = [brickWidth, height - heightOffset, brickWidth];

  useAnimationHandle(ref, (alpha: number) => {
    face.opacity = alpha;
    side.opacity = alpha;
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
        <Header key={i} {...props} />
      ))}
    </group>
  );
};

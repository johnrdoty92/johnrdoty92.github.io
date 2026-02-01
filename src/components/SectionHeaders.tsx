import { extend, useLoader, type ThreeElement, type ThreeElements } from "@react-three/fiber";
import { Suspense, useRef, type RefObject } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { brickWidth } from "../util/brickGeometry";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MOBILE_BREAKPOINT_QUERY, theme } from "../constants/styles";
import { Group, MeshBasicMaterial } from "three";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: ThreeElement<typeof TextGeometry>;
  }
}

const material = new MeshBasicMaterial({ color: theme.light, transparent: true });
const startingYOffset = 4;

export const SectionHeaders = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const { height } = useRotatingDisplayContext();
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const groupRef = useRef<Group>(null!);

  useAnimationHandle(ref, (alpha: number) => {
    material.opacity = alpha;
    groupRef.current.position.y = (1 - alpha) * startingYOffset;
  });

  const heightOffset = isMobile ? 2.6 : 3.6;
  const [x, y, z] = [brickWidth, height - heightOffset, brickWidth];

  return (
    <Suspense fallback={<></>}>
      <group ref={groupRef}>
        <Header label="Skills" position={[x + 1, y, z]} />
        <Header label="Work Experience" position={[0, y, z - 2]} rotation-y={Math.PI / 2} />
        <Header label="Work Projects" position={[-x - 1, y, z - 2]} rotation-y={Math.PI} />
        <Header label="Contact" position={[-x + 1, y, z]} rotation-y={-Math.PI / 2} />
      </group>
    </Suspense>
  );
};

const Header = ({ label, ...props }: ThreeElements["group"] & { label: string }) => {
  const font = useLoader(FontLoader, "/Poppins_Bold.json");
  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const size = isMobileScreen ? 0.5 : 0.75;
  const lineGap = 0.25;
  // TODO: add accessibility

  return (
    <group {...props}>
      {label.split(" ").map((text, i) => (
        <mesh key={i} position-y={-i * size - (i > 0 ? lineGap : 0)} material={material}>
          <textGeometry args={[text, { font, size, depth: 0.075, curveSegments: 2 }]} />
        </mesh>
      ))}
    </group>
  );
};

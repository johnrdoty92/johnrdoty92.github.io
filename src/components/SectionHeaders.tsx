import { extend, useLoader, type ThreeElement, type ThreeElements } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { brickWidth } from "../util/brickGeometry";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { Group, MathUtils, type Vector3Tuple } from "three";
import { useToggleAnimationState } from "../hooks/useToggleAnimationState";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: ThreeElement<typeof TextGeometry>;
  }
}

export const SectionHeaders = () => {
  const { height } = useRotatingDisplayContext();
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const heightOffset = isMobile ? 2.6 : 3.6;
  const [x, y, z] = [brickWidth, height - heightOffset, brickWidth];
  return (
    <Suspense fallback={<></>}>
      <Header label="Skills" position={[x + 1, y, z]} />
      <Header label="Work Experience" position={[0, y, z - 2]} rotation-y={Math.PI / 2} />
      <Header label="Work Projects" position={[-x - 1, y, z - 2]} rotation-y={Math.PI} />
      <Header label="Contact" position={[-x + 1, y, z]} rotation-y={-Math.PI / 2} />
    </Suspense>
  );
};

const startingYOffset = 4;

const Header = ({
  label,
  position: [x, y, z],
  ...props
}: Omit<ThreeElements["group"], "position"> & { label: string; position: Vector3Tuple }) => {
  const header = useRef<Group>(null!);
  const font = useLoader(FontLoader, "/Poppins_Bold.json");
  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const size = isMobileScreen ? 0.5 : 0.75;
  const lineGap = 0.25;
  // TODO: add accessibility

  useToggleAnimationState(
    true,
    (alpha) => {
      header.current.visible = true;
      header.current.position.setY(MathUtils.lerp(y + startingYOffset, y, alpha));
    },
    { delay: 3000 },
  );
  return (
    <group {...props} visible={false} ref={header} position={[x, y + startingYOffset, z]}>
      {label.split(" ").map((text, i) => (
        <mesh key={i} position-y={-i * size - (i > 0 ? lineGap : 0)}>
          <meshBasicMaterial />
          <textGeometry args={[text, { font, size, depth: 0.075, curveSegments: 2 }]} />
        </mesh>
      ))}
    </group>
  );
};

import { extend, useLoader, type ThreeElement, type ThreeElements } from "@react-three/fiber";
import { Suspense } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { brickWidth } from "../util/brickGeometry";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: ThreeElement<typeof TextGeometry>;
  }
}

export const SectionHeaders = () => {
  const { height } = useRotatingDisplayContext();
  const [x, y, z] = [brickWidth, height - 2.5, brickWidth];
  return (
    <Suspense fallback={<></>}>
      <Header label="Skills" position={[x + 1, y, z]} />
      <Header label="Work Experience" position={[0, y, z - 2]} rotation-y={Math.PI / 2} />
      <Header label="Work Projects" position={[-x - 1, y, z - 2]} rotation-y={Math.PI} />
      <Header label="Contact" position={[-x + 1, y, z]} rotation-y={-Math.PI / 2} />
    </Suspense>
  );
};

const Header = ({ label, ...props }: ThreeElements["group"] & { label: string }) => {
  const font = useLoader(FontLoader, "/Noto_Sans_Regular.json");
  const size = 0.75;
  const lineGap = 0.25;
  // TODO: add accessibility
  // TODO: animate into place or hide until animation is complete
  return (
    <group {...props}>
      {label.split(" ").map((text, i) => (
        <mesh key={i} position-y={-i * size - (i > 0 ? lineGap : 0)}>
          <meshBasicMaterial />
          <textGeometry args={[text, { font, size, depth: 0.1, curveSegments: 1 }]} />
        </mesh>
      ))}
    </group>
  );
};

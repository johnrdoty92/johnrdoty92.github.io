import type { ThreeElements } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { brickWidth } from "../util/brickGeometry";

const InvisibleWall = (props: ThreeElements["mesh"]) => {
  const { width, height } = useRotatingDisplayContext().dimensions;
  return (
    <mesh
      visible={false}
      position={[0, height / 2, 0]}
      onPointerOver={(e) => e.stopPropagation()}
      onPointerOut={(e) => e.stopPropagation()}
      {...props}
    >
      <meshMatcapMaterial />
      <boxGeometry args={[width * 4, height, brickWidth]} />
    </mesh>
  );
};

export const WallEventBlockers = () => {
  return (
    <group>
      <InvisibleWall />
      <InvisibleWall rotation-y={Math.PI / 2} />
    </group>
  );
};

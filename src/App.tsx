import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { useCallback, useImperativeHandle, useRef, useState, type Ref } from "react";
import { type Group, MathUtils, Vector2, type Mesh } from "three";

interface PlatformRef {
  onDragStart: () => void;
  onDrag: () => void;
  onDragEnd: () => void;
}

const ANIMATION_THRESHOLD = 0.00001;
const RIGHT = 1;
const LEFT = -1;
type Direction = typeof RIGHT | typeof LEFT;

const point = new Vector2();

const Platform = ({ ref, ...props }: ThreeElements["group"] & { ref: Ref<PlatformRef> }) => {
  const cube = useRef<Mesh>(null!);
  const group = useRef<Group>(null!);
  const get = useThree((state) => state.get);
  const dragOrigin = useRef<Vector2 | null>(null);

  const targetRotation = useRef<number | null>(null);
  const [section, setSection] = useState(0);
  // const activeSecti0n = MathUtils.euclideanModulo(quadrant, 4)

  const rotatePlatform = useCallback((direction: Direction) => {
    setSection((q) => q + direction);
  }, []);

  useFrame((_, delta) => {
    const currentRotation = group.current.rotation.y;
    const lambda = !dragOrigin.current ? 5 : 2;
    if (targetRotation.current !== null) {
      group.current.rotation.y = MathUtils.damp(
        currentRotation,
        targetRotation.current,
        lambda,
        delta
      );
    } else {
      const currentRotation = group.current.rotation.y;
      const finalTarget = section * (Math.PI / 2);
      if (currentRotation === finalTarget) return;
      const lambda = 5;
      const isTransitionComplete = Math.abs(finalTarget - currentRotation) < ANIMATION_THRESHOLD;
      group.current.rotation.y = isTransitionComplete
        ? finalTarget
        : MathUtils.damp(currentRotation, finalTarget, lambda, delta);
    }
  });

  useImperativeHandle(
    ref,
    () => ({
      onDragStart() {
        dragOrigin.current = point.copy(get().pointer);
      },
      onDrag() {
        if (!dragOrigin.current) return;
        const currentPoint = get().pointer;
        const dragDelta = dragOrigin.current.x - currentPoint.x;
        const clampedDelta = MathUtils.clamp(dragDelta, -0.5, 0.5);
        const currentRotation = section * (Math.PI / 2);
        targetRotation.current = currentRotation + -clampedDelta * (Math.PI / 8);
      },
      onDragEnd() {
        targetRotation.current = null;
        if (!dragOrigin.current) return;
        const currentPoint = get().pointer;
        const dragDelta = dragOrigin.current.x - currentPoint.x;
        if (Math.abs(dragDelta) > 0.5) {
          const direction = dragDelta < 0 ? 1 : -1;
          rotatePlatform(direction);
        }
        dragOrigin.current = null;
      },
    }),
    [get, section, rotatePlatform]
  );

  return (
    <group {...props} ref={group}>
      <mesh position-y={0.5} ref={cube}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
};

function App() {
  const platform = useRef<PlatformRef>(null!);
  return (
    <Canvas
      camera={{ position: [3, 3, 3] }}
      onPointerLeave={() => platform.current.onDragEnd()}
      onPointerDown={() => platform.current.onDragStart()}
      onPointerMove={() => platform.current.onDrag()}
      onPointerUp={() => platform.current.onDragEnd()}
    >
      <Platform ref={platform} />
    </Canvas>
  );
}

export default App;

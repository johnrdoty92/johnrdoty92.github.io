import { useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Dispatch,
  type Ref,
  type SetStateAction,
} from "react";
import { MathUtils, PerspectiveCamera, Vector2, Vector3, type Group } from "three";
import { RotatingDisplayContext } from "../contexts/RotatingDisplay";

const SECTION_COUNT = 4;
const ANIMATION_THRESHOLD = 0.00001;
const RIGHT = 1;
const LEFT = -1;
type Direction = typeof RIGHT | typeof LEFT;

const point = new Vector2();

export interface RotatingDisplayHandle {
  onDragStart: () => void;
  onDrag: () => void;
  onDragEnd: () => void;
  setSection: Dispatch<SetStateAction<number>>;
}

const POSITIVE_X = new Vector3(1, 0, 0);
const POSITIVE_Y = new Vector3(0, 1, 0);

const useDimensions = () => {
  const camera = useThree(({ camera }) => camera as PerspectiveCamera);
  const renderer = useThree(({ gl }) => gl);

  const calculateDimensions = useCallback(() => {
    const cameraDistance = camera.position.length();
    const { x: viewWidth, y: viewHeight } = camera.getViewSize(cameraDistance, new Vector2());
    const cameraPlaneNormal = camera.position.clone().negate().normalize();
    const projectedX = POSITIVE_X.clone().projectOnPlane(cameraPlaneNormal);
    const planeOrthogonal = new Vector3(1, 0, -1).normalize();
    projectedX.setLength(viewWidth / 2 / Math.cos(projectedX.angleTo(planeOrthogonal)));
    const alpha = Math.abs(projectedX.z / (Math.abs(projectedX.z) + Math.abs(camera.position.z)));
    const width = Math.floor(projectedX.lerp(camera.position, alpha).length() / 2);

    const theta = MathUtils.degToRad(camera.fov / 2);
    const beta = Math.PI / 2 - camera.position.angleTo(POSITIVE_Y);
    const gamma = Math.PI / 2 - theta;
    const height =
      Math.floor((viewHeight / 2) * Math.sin(gamma)) / Math.sin(Math.PI - gamma - beta);
    return { width, height };
  }, [camera]);

  const [dimensions, setDimensions] = useState(calculateDimensions);

  useEffect(() => {
    const observer = new ResizeObserver(() => setDimensions(calculateDimensions()));
    observer.observe(renderer.domElement);
    return observer.disconnect;
  }, [calculateDimensions, renderer]);

  return dimensions;
};

export const RotatingDisplay = ({
  ref,
  ...props
}: ThreeElements["group"] & { ref: Ref<RotatingDisplayHandle> }) => {
  const dimensions = useDimensions();
  const group = useRef<Group>(null!);
  const get = useThree((state) => state.get);
  const dragOrigin = useRef<Vector2 | null>(null);

  const targetRotation = useRef<number | null>(null);
  const [section, setSection] = useState(0);
  const activeSection = MathUtils.euclideanModulo(section, SECTION_COUNT);

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
      setSection,
    }),
    [get, section, rotatePlatform]
  );

  return (
    <RotatingDisplayContext.Provider value={{ activeSection, dimensions }}>
      <group {...props} ref={group} />
    </RotatingDisplayContext.Provider>
  );
};

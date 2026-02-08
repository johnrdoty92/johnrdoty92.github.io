import { useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { MathUtils, PerspectiveCamera, Vector2, Vector3, type Group } from "three";
import { RotatingDisplayContext } from "../contexts/RotatingDisplay";
import { useSectionsContext } from "../contexts/Sections";
import { POSITIVE_X, POSITIVE_Y } from "../constants/vectors";

const ANIMATION_THRESHOLD = 0.00001;

const point = new Vector2();

export interface RotatingDisplayHandle {
  onDragStart: () => void;
  onDrag: () => void;
  onDragEnd: () => void;
}

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
  const { rotate, section } = useSectionsContext();

  useFrame((_, delta) => {
    const currentRotation = group.current.rotation.y;
    const lambda = !dragOrigin.current ? 5 : 9;
    if (targetRotation.current !== null) {
      group.current.rotation.y = MathUtils.damp(
        currentRotation,
        targetRotation.current,
        lambda,
        delta,
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
          rotate(direction);
        }
        dragOrigin.current = null;
      },
    }),
    [get, section, rotate],
  );

  return (
    <RotatingDisplayContext.Provider value={dimensions}>
      <group {...props} ref={group} />
    </RotatingDisplayContext.Provider>
  );
};

import { useFrame, type ObjectMap, type ThreeElements, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useGLTF } from "../hooks/useGLTF";
import { useAnimations } from "../hooks/useAnimations";
import { MathUtils, Vector3, type AnimationClip, type Group, type Vector3Tuple } from "three";
import { useModalContext } from "../contexts/Modal";
import { useTargetFocusedPosition } from "../hooks/useTargetFocusedPosition";
import { hoverHandlers } from "../util/hoverHandlers";

interface MinifigureGLTF extends Partial<ObjectMap> {
  animations: (AnimationClip & { name: "typing" | "main" })[];
}

const WorkExperienceMinifigure = ({
  model,
  ...props
}: Omit<ThreeElements["group"], "position"> & { model: string; position: Vector3Tuple }) => {
  const modelPath = new URL(`../assets/${model}.glb`, import.meta.url).href;
  const { open } = useModalContext();
  const gltf = useGLTF<MinifigureGLTF>(modelPath);
  const { actions } = useAnimations(gltf);
  const ref = useRef<Group>(null!);

  const [isFocused, setIsFocused] = useState(false);

  const origin = new Vector3(...props.position);
  const focusedPosition = useTargetFocusedPosition(0.55, { x: 0, y: -0.5, z: 0 });
  const { x, y, z } = focusedPosition;
  focusedPosition.set(x, y, -z);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setIsFocused((f) => !f);
    open("TODO: handle modal open key", () => setIsFocused(false));
  };

  useEffect(() => {
    actions[isFocused ? "main" : "typing"].reset().fadeIn(0.5).play();
    actions[isFocused ? "typing" : "main"].fadeOut(0.5);
  }, [actions, isFocused]);

  const accumulator = useRef(0);
  useFrame(({ clock }, delta) => {
    const multiplier = 2;
    const scaledDelta = multiplier * (isFocused ? delta : -delta);
    accumulator.current = MathUtils.clamp(accumulator.current + scaledDelta, 0, 1);
    const alpha = MathUtils.smoothstep(accumulator.current, 0, 1);
    ref.current.position.lerpVectors(origin, focusedPosition, alpha);
    // TODO: abstract into wiggle function
    const elapsed = clock.getElapsedTime();
    const amplitude = 0.1;
    const frequency = 0.6;
    ref.current.position.y += amplitude * Math.sin(elapsed * frequency) * accumulator.current;
    const heightAmplitude = 3;
    ref.current.position.y += heightAmplitude * Math.sin(MathUtils.lerp(0, Math.PI, alpha));

    const x = MathUtils.lerp(0, Math.PI / 8, alpha);
    const yAmplitude = 0.25;
    const yFrequency = 0.75;
    const yBounce = yAmplitude * Math.sin(elapsed * yFrequency) * accumulator.current;
    const y = MathUtils.lerp((props.rotation as Vector3Tuple)[1], Math.PI, alpha) + yBounce;
    const zAmplitude = 0.1;
    const zFrequency = 0.5;
    const zBounce = zAmplitude * Math.sin(elapsed * zFrequency) * accumulator.current;
    const z = MathUtils.lerp((props.rotation as Vector3Tuple)[2], Math.PI / 64, alpha) + zBounce;
    ref.current.rotation.set(x, y, z, "YXZ");
  });

  return (
    <group
      {...props}
      {...hoverHandlers}
      ref={ref}
      dispose={null}
      onClick={handleClick}
      onPointerMissed={() => setIsFocused(false)}
    >
      <primitive object={gltf.scene} />
    </group>
  );
};

export const WorkExperience = () => {
  return (
    <Suspense fallback={<></>}>
      <WorkExperienceMinifigure
        model="Intern"
        position={[2.5, 0, -5.5]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WorkExperienceMinifigure model="Junior" position={[5, 0, -3]} rotation={[0, Math.PI, 0]} />
      <WorkExperienceMinifigure model="Senior" position={[2, 1, -3]} rotation={[0, Math.PI, 0]} />
      <mesh position={[2, 0, -3]}>
        <boxGeometry args={[3, 2, 2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </Suspense>
  );
};

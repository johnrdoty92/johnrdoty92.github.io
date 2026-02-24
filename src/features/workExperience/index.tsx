import { type ObjectMap, type ThreeElements, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, type ComponentProps } from "react";
import {
  useGLTF,
  useAnimations,
  useTargetFocusedPosition,
  useToggleAnimationState,
  useWiggle,
  type WaveConfig,
} from "@/hooks";
import { MathUtils, Vector3, type AnimationClip, type Group, type Vector3Tuple } from "three";
import { useModalContext } from "@/contexts/Modal";
import { ClickIndicator } from "@/components";
import { useSectionsContext } from "@/contexts/Sections";
import { SECTIONS, type JobTitle } from "@/constants";
import { hoverHandlers, getAssetUrl } from "@/util";

interface MinifigureGLTF extends Partial<ObjectMap> {
  animations: (AnimationClip & { name: "typing" | "main" })[];
}

const wiggleOverride: Partial<WaveConfig> = {};

const Minifigure = ({
  model,
  ...props
}: Omit<ThreeElements["group"], "position"> & { model: JobTitle; position: Vector3Tuple }) => {
  const { open } = useModalContext();
  const wiggle = useWiggle({ amplitude: 0.1, frequency: 0.6 });
  const { activeSection } = useSectionsContext();
  const isActiveSection = activeSection === SECTIONS.workExperience;

  const gltf = useGLTF<MinifigureGLTF>(getAssetUrl(model));
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
    open(model, () => setIsFocused(false));
  };

  useEffect(() => {
    if (!isActiveSection) {
      actions.main.fadeOut(0.5).stop();
      actions.typing.fadeOut(0.5).stop();
      return;
    }
    actions[isFocused ? "main" : "typing"].reset().fadeIn(0.5).play();
    actions[isFocused ? "typing" : "main"].fadeOut(0.5);
  }, [actions, isFocused, isActiveSection]);

  useToggleAnimationState(isFocused, (alpha) => {
    ref.current.position.lerpVectors(origin, focusedPosition, alpha);
    ref.current.position.y += wiggle() * alpha;
    const heightAmplitude = 3;
    ref.current.position.y += heightAmplitude * Math.sin(MathUtils.lerp(0, Math.PI, alpha));

    const x = MathUtils.lerp(0, Math.PI / 8, alpha);
    wiggleOverride.amplitude = 0.25;
    wiggleOverride.frequency = 0.75;
    const yBounce = wiggle(wiggleOverride) * alpha;
    const y = MathUtils.lerp((props.rotation as Vector3Tuple)[1], Math.PI, alpha) + yBounce;
    wiggleOverride.amplitude = 0.1;
    wiggleOverride.frequency = 0.5;
    const zBounce = wiggle(wiggleOverride) * alpha;
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
      <Suspense>
        <ClickIndicator visible={!isFocused} position={[0, 3, 0]} />
      </Suspense>
      <primitive object={gltf.scene} />
    </group>
  );
};

const WorkExperienceMinifigure = (props: ComponentProps<typeof Minifigure>) => {
  return (
    <Suspense fallback={<></>}>
      <Minifigure {...props} />
    </Suspense>
  );
};

export const WorkExperience = () => {
  return (
    <>
      <WorkExperienceMinifigure
        model="Intern"
        position={[3, 0, -5.5]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WorkExperienceMinifigure model="Junior" position={[5.5, 0, -3]} rotation={[0, Math.PI, 0]} />
      <WorkExperienceMinifigure model="Senior" position={[2.5, 1, -3]} rotation={[0, Math.PI, 0]} />
      <mesh position={[2.5, 0.5, -3]}>
        <boxGeometry args={[3, 1, 2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </>
  );
};

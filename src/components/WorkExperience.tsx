import { useFrame, type ThreeElements } from "@react-three/fiber";
import { AnimationMixer, Mesh } from "three";
import { Suspense, useEffect, useRef } from "react";
import { useGLTF } from "../hooks/useGLTF";

const WorkExperienceMinifigure = ({
  model,
  ...props
}: ThreeElements["group"] & { model: string }) => {
  const modelPath = new URL(`../assets/${model}.glb`, import.meta.url).href;
  const gltf = useGLTF(modelPath);
  const mixer = useRef<AnimationMixer>(null);
  const legoMinifigure = useRef<Mesh>(null!);

  // TODO: replace with animation controller hook
  useEffect(() => {
    mixer.current = new AnimationMixer(legoMinifigure.current);
    const action = mixer.current.clipAction(gltf.animations[1], legoMinifigure.current);
    action.startAt(Math.random() * 3).play();
    return () => {
      action.stop();
    };
  }, [gltf]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <group
      {...props}
      dispose={null}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <primitive ref={legoMinifigure} object={gltf.scene} />
    </group>
  );
};

export const WorkExperience = () => {
  // TODO: handle responsiveness, if needed
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

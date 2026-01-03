import { useFrame, type ThreeElements } from "@react-three/fiber";
import { AnimationMixer, type Mesh } from "three";
import { useEffect, useRef } from "react";
import { useGLTF } from "../hooks/useGLTF";

export function SocialMediaMinifigure({
  minifigure,
  ...props
}: ThreeElements["group"] & { minifigure: string }) {
  const modelPath = new URL(`../assets/${minifigure}.glb`, import.meta.url).href;
  const gltf = useGLTF(modelPath);
  const mixer = useRef<AnimationMixer>(null);
  const legoMinifigure = useRef<Mesh>(null!);

  useEffect(() => {
    // TODO: handle some timeouts to make this feel a little more natural
    // choose from either animation (0 or 1)
    mixer.current = new AnimationMixer(legoMinifigure.current);
    const action = mixer.current.clipAction(
      gltf.animations[minifigure.includes("Overall") || minifigure.includes("Pirate") ? 0 : 1],
      legoMinifigure.current
    );
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
        // TODO: handle opening link
        console.log("clicked: ", minifigure);
      }}
    >
      <primitive ref={legoMinifigure} object={gltf.scene} />
    </group>
  );
}

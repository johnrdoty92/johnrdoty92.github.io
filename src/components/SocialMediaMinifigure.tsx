import { type ObjectMap, type ThreeElements } from "@react-three/fiber";
import { AnimationAction, AnimationClip, LoopOnce } from "three";
import { useGLTF } from "../hooks/useGLTF";
import { useEffect, useRef } from "react";
import { useAnimations, type OnFinished } from "../hooks/useAnimations";
import type { SOCIAL_MEDIA_PROPS } from "../constants/socialMedia";
import { hoverHandlers } from "../util/hoverHandlers";
import { useSectionsContext } from "../contexts/Sections";
import { SECTIONS } from "../constants/sections";

const getRandomTimeout = (duration = 2500) => Math.random() * duration;

const queueAction = (action: AnimationAction) => {
  return setTimeout(() => action.reset().play(), getRandomTimeout());
};

interface MinifigureGLTF extends Partial<ObjectMap> {
  animations: (AnimationClip & { name: "look_left" | "look_right" })[];
}

type SocialMediaMinifigureProps = {
  minifigure: (typeof SOCIAL_MEDIA_PROPS)[number]["minifigure"];
  animation: MinifigureGLTF["animations"][number]["name"];
  href: string;
} & ThreeElements["group"];

export function SocialMediaMinifigure({
  minifigure,
  animation,
  href,
  ...props
}: SocialMediaMinifigureProps) {
  const modelPath = new URL(`../assets/${minifigure}.glb`, import.meta.url).href;
  const gltf = useGLTF<MinifigureGLTF>(modelPath);
  const { mixer, actions } = useAnimations(gltf);
  const timeout = useRef<number | null>(null);

  const { activeSection } = useSectionsContext();
  const isActiveSection = activeSection === SECTIONS.contact;

  useEffect(() => {
    const action = actions[animation];
    action.loop = LoopOnce;

    if (!isActiveSection) {
      action.fadeOut(0.5).stop();
      return;
    }

    timeout.current = queueAction(action);

    const handleFinished: OnFinished = ({ action }) => (timeout.current = queueAction(action));
    mixer.addEventListener("finished", handleFinished);

    return () => {
      if (timeout.current !== null) clearTimeout(timeout.current);
      mixer.removeEventListener("finished", handleFinished);
    };
  }, [mixer, actions, isActiveSection]);

  return (
    <group
      {...props}
      {...hoverHandlers}
      dispose={null}
      onClick={(e) => {
        e.stopPropagation();
        window.open(href, "_blank");
      }}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

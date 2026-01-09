import {
  AnimationAction,
  AnimationMixer,
  type AnimationMixerEventMap,
  type EventListener,
} from "three";
import type { useGLTF } from "./useGLTF";
import { useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";

export type OnFinished = EventListener<
  AnimationMixerEventMap["finished"],
  "finished",
  AnimationMixer
>;

export const useAnimations = <T extends ReturnType<typeof useGLTF>>({ scene, animations }: T) => {
  const [mixer] = useState(() => new AnimationMixer(scene));

  const actions = useMemo(
    () => Object.fromEntries(animations.map((clip) => [clip.name, mixer.clipAction(clip)])),
    [animations]
  ) as { [Name in T["animations"][number]["name"]]: AnimationAction };

  useFrame((_, delta) => mixer.update(delta));

  useEffect(() => {
    mixer.stopAllAction();
    Object.keys(actions).forEach((action) => mixer.uncacheAction(action));
  }, [animations]);

  return { actions, mixer };
};

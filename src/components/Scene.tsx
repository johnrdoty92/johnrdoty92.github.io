import { useFrame } from "@react-three/fiber";
import { Floor } from "./Floor";
import { SectionHeaders } from "./SectionHeaders";
import { Skills } from "./Skills";
import { SocialLinks } from "./SocialLinks";
import { Walls } from "./Walls";
import { WorkExperience } from "./WorkExperience";
import { WorkProjects } from "./WorkProjects";
import { useRef } from "react";
import { MathUtils } from "three";
import type { AnimationHandle } from "../hooks/useAnimationHandle";

export const Scene = () => {
  const progress = useRef(0);
  const floor = useRef<AnimationHandle>(null!);
  const headers = useRef<AnimationHandle>(null!);
  const skills = useRef<AnimationHandle>(null!);
  const walls = useRef<AnimationHandle>(null!);

  useFrame((_, delta) => {
    progress.current += delta;
    floor.current.animate(MathUtils.clamp(progress.current / 1, 0, 1));
    headers.current.animate(MathUtils.clamp(progress.current / 1, 0, 1));
    const skillsAnimationDuration = 2.5;
    skills.current.animate(MathUtils.clamp(progress.current / skillsAnimationDuration, 0, 1));
    const wallsAnimationDuration = 5;
    walls.current.animate(MathUtils.clamp(progress.current / wallsAnimationDuration, 0, 1));
    // TODO: dispatch action to render models when animations are done?
  });
  return (
    <>
      <SectionHeaders ref={headers} />
      <Skills ref={skills} />
      <WorkExperience />
      <WorkProjects />
      <SocialLinks />
      <Walls ref={walls} />
      <Floor ref={floor} />
    </>
  );
};

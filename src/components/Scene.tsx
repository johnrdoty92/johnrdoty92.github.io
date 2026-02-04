import { useFrame } from "@react-three/fiber";
import { Floor } from "./Floor";
import { SectionHeaders } from "./SectionHeaders";
import { Skills } from "./Skills";
import { SocialLinks } from "./SocialLinks";
import { Walls } from "./Walls";
import { WorkExperience } from "./WorkExperience";
import { WorkProjects } from "./WorkProjects";
import { useRef } from "react";
import { Group, MathUtils } from "three";
import type { AnimationHandle } from "../hooks/useAnimationHandle";
import { Name } from "./Name";

const overlap = 0.25;
const durations: [number, number, number, number] = [0.65, 2.5, 2, 0.75];
const { timings } = durations.reduce<{
  timings: { min: number; max: number }[];
  currentStart: number;
}>(
  (result, duration) => {
    result.timings.push({ min: result.currentStart, max: result.currentStart + duration });
    result.currentStart = result.currentStart + duration - overlap;
    return result;
  },
  { timings: [], currentStart: 0 },
);

export const Scene = () => {
  const acc = useRef(0);
  const floor = useRef<AnimationHandle>(null!);
  const headers = useRef<AnimationHandle>(null!);
  const name = useRef<AnimationHandle>(null!);
  const skills = useRef<AnimationHandle>(null!);
  const walls = useRef<AnimationHandle>(null!);
  const sections = useRef<Group>(null!);

  useFrame((_, delta) => {
    acc.current += delta;
    // TODO: adjust timings for name
    name.current.animate(MathUtils.smootherstep(acc.current, timings[0].min, timings[0].max));
    floor.current.animate(MathUtils.smootherstep(acc.current, timings[0].min, timings[0].max));
    walls.current.animate(MathUtils.smootherstep(acc.current, timings[1].min, timings[1].max));
    skills.current.animate(MathUtils.smootherstep(acc.current, timings[2].min, timings[2].max));
    headers.current.animate(MathUtils.smootherstep(acc.current, timings[3].min, timings[3].max));
    sections.current.visible = acc.current >= timings[3].max;
  });
  return (
    <>
      <SectionHeaders ref={headers} />
      <Name ref={name} />
      <Skills ref={skills} />
      <group ref={sections}>
        <WorkExperience />
        <WorkProjects />
        <SocialLinks />
      </group>
      <Walls ref={walls} />
      <Floor ref={floor} />
    </>
  );
};

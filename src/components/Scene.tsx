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
import { AnimatedName } from "./AnimatedName";
import { StaticNames } from "./StaticNames";

const overlap = 0.25;
// TODO: make an array so we can map things out below instead of hardcoding each one
const nameDuration = 0.75;
const floorDuration = 0.65;
const wallsDuration = 2.5;
const skillsDuration = 2;
const headersDuration = 0.75;
const durations: [number, number, number, number, number] = [
  nameDuration,
  floorDuration,
  wallsDuration,
  headersDuration,
  skillsDuration,
];
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
    name.current.animate(MathUtils.smootherstep(acc.current, timings[0].min, timings[0].max));
    floor.current.animate(MathUtils.smootherstep(acc.current, timings[1].min, timings[1].max));
    walls.current.animate(MathUtils.smootherstep(acc.current, timings[2].min, timings[2].max));
    headers.current.animate(MathUtils.smootherstep(acc.current, timings[3].min, timings[3].max));
    skills.current.animate(MathUtils.smootherstep(acc.current, timings[4].min, timings[4].max));
    sections.current.visible = acc.current >= timings[4].max;
  });
  return (
    <>
      <SectionHeaders ref={headers} />
      <AnimatedName ref={name} />
      <Skills ref={skills} />
      <group ref={sections}>
        <WorkExperience />
        <WorkProjects />
        <SocialLinks />
        <StaticNames />
      </group>
      <Walls ref={walls} />
      <Floor ref={floor} />
    </>
  );
};

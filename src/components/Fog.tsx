import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Color, MathUtils, Fog as TFog } from "three";
import { useSectionsContext } from "@/contexts/Sections";
import { SECTIONS, cameraFar } from "@/constants";
import { theme } from "@/theme";

const sectionColors = {
  [SECTIONS.skills]: new Color(theme.dark),
  [SECTIONS.contact]: new Color(theme.secondary),
  [SECTIONS.workExperience]: new Color(theme.focus),
  [SECTIONS.workProjects]: new Color(theme.primary),
};

export const Fog = () => {
  const { activeSection } = useSectionsContext();
  const fogRef = useRef<TFog>(null!);
  const acc = useRef(0);
  const startFog = cameraFar - 1.5;

  useEffect(() => void (acc.current = 0), [activeSection]);

  useFrame((_, delta) => {
    acc.current = MathUtils.clamp(acc.current + delta, 0, 1);
    fogRef.current.color.lerp(sectionColors[activeSection], acc.current);
  });

  return <fog ref={fogRef} attach="fog" args={[theme.dark, startFog, cameraFar]} />;
};

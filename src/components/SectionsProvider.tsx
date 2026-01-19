import { useCallback, useState, type PropsWithChildren } from "react";
import { SectionsContext } from "../contexts/Sections";
import { clampAsSectionValue } from "../util/clampAsSectionValue";
import type { Section } from "../constants/sections";

const classes: Record<Section, string> = {
  0: "skills",
  1: "contact",
  2: "workExperience",
  3: "workProject",
};

export const SectionsProvider = ({ children }: PropsWithChildren) => {
  const [section, setSection] = useState(0);
  const activeSection = clampAsSectionValue(section);
  const rotate = useCallback((direction: 1 | -1) => {
    setSection((q) => {
      const prev = clampAsSectionValue(q);
      const next = clampAsSectionValue(q + direction);
      document.body.classList.remove(classes[prev]);
      document.body.classList.add(classes[next]);
      return q + direction;
    });
  }, []);
  return (
    <SectionsContext.Provider value={{ section, activeSection, rotate }}>
      {children}
    </SectionsContext.Provider>
  );
};

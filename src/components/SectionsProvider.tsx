import { useCallback, useState, type PropsWithChildren } from "react";
import { SectionsContext } from "../contexts/Sections";
import { MathUtils } from "three";

const SECTION_COUNT = 4;

export const SectionsProvider = ({ children }: PropsWithChildren) => {
  const [section, setSection] = useState(0);
  const activeSection = MathUtils.euclideanModulo(section, SECTION_COUNT) as 0 | 1 | 2 | 3;
  const rotate = useCallback((direction: 1 | -1) => {
    setSection((q) => q + direction);
  }, []);
  return (
    <SectionsContext.Provider value={{ section, activeSection, rotate }}>
      {children}
    </SectionsContext.Provider>
  );
};

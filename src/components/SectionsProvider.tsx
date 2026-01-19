import { useCallback, useState, type PropsWithChildren } from "react";
import { SectionsContext } from "../contexts/Sections";
import { clampAsSectionValue } from "../util/clampAsSectionValue";

export const SectionsProvider = ({ children }: PropsWithChildren) => {
  const [section, setSection] = useState(0);
  const activeSection = clampAsSectionValue(section);
  const rotate = useCallback((direction: 1 | -1) => {
    setSection((q) => q + direction);
  }, []);
  return (
    <SectionsContext.Provider value={{ section, activeSection, rotate }}>
      {children}
    </SectionsContext.Provider>
  );
};

import { createContext, useContext } from "react";

type SectionsContextValue = {
  section: number;
  activeSection: 0 | 1 | 2 | 3;
  rotate: (direction: 1 | -1) => void;
};

export const SectionsContext = createContext<SectionsContextValue | null>(null);

export const useSectionsContext = () => {
  const value = useContext(SectionsContext);
  if (!value) throw new Error("SectionsContext must be used within provider");
  return value;
};

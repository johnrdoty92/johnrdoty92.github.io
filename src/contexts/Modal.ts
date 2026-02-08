import { createContext, useContext } from "react";
import type { JobTitle } from "../constants/workExperience";
import type { ProjectName } from "../constants/workProjects";

export type ModalContextValue = {
  open: (key: JobTitle | ProjectName, onClose?: () => void) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const value = useContext(ModalContext);
  if (!value) throw new Error("ModalContext must be used within provider");
  return value;
};

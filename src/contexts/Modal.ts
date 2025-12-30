import { createContext, useContext } from "react";

export type ModalContextValue = {
  open: (key: string) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const value = useContext(ModalContext);
  if (!value) throw new Error("ModalContext must be used within provider");
  return value;
};

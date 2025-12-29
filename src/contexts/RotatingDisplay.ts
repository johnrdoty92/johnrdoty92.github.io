import { createContext, useContext } from "react";

type RotatingDisplayContextValue = {
  activeSection: number;
  dimensions: {
    width: number;
    height: number;
  };
};

export const RotatingDisplayContext = createContext<RotatingDisplayContextValue | null>(null);

export const useRotatingDisplayContext = () => {
  const value = useContext(RotatingDisplayContext);
  if (!value) throw new Error("RotatingDisplayContext must be used within provider");
  return value;
};

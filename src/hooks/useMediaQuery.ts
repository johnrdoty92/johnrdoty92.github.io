import { useMemo, useSyncExternalStore } from "react";

export const useMediaQuery = (query: string) => {
  const [getSnapshot, subscribe] = useMemo(() => {
    const mediaQueryList = matchMedia(query);
    return [
      () => mediaQueryList.matches,
      (onChange: () => void) => {
        mediaQueryList.addEventListener("change", onChange);
        return () => mediaQueryList.removeEventListener("change", onChange);
      },
    ];
  }, [query]);
  return useSyncExternalStore(subscribe, getSnapshot);
};

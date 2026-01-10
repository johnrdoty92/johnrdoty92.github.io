import { useSyncExternalStore } from "react";

export const SEARCH_EVENT = "search";

let searchValue = "";

const getSnapshot = () => searchValue;

const subscribe: Parameters<typeof useSyncExternalStore>[0] = (onChange) => {
  const handleEvent = (e: CustomEventInit<{ value: string }>) => {
    searchValue = e.detail?.value ?? "";
    onChange();
  };
  window.addEventListener(SEARCH_EVENT, handleEvent);
  return () => window.removeEventListener(SEARCH_EVENT, handleEvent);
};

export const useSearchValue = () => useSyncExternalStore(subscribe, getSnapshot);
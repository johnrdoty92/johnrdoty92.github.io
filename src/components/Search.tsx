import { useRef } from "react";
import { SEARCH_EVENT } from "../hooks/useSearchValue";

export const Search = () => {
  const debounceId = useRef<number | null>(null);

  return (
    <input
      type="text"
      placeholder="Search skills..."
      onChange={(e) => {
        if (debounceId.current) clearTimeout(debounceId.current);
        debounceId.current = setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent(SEARCH_EVENT, { detail: { value: e.target.value } })
          );
        }, 250);
      }}
    />
  );
};

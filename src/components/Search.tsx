import { useRef, type ComponentProps } from "react";
import { SEARCH_EVENT } from "../hooks/useSearchValue";
import { useSectionsContext } from "../contexts/Sections";
import { SECTIONS } from "../constants/sections";

const SearchIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
};

export const Search = () => {
  const debounceId = useRef<number | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const isVisible = useSectionsContext().activeSection === SECTIONS.skills;

  return (
    <div className={`search ${isVisible ? "" : "hidden"}`}>
      <SearchIcon className="icon" onClick={() => input.current?.focus()} />
      <input
        disabled={!isVisible}
        ref={input}
        name="skills search"
        type="text"
        placeholder="Search skills..."
        onChange={(e) => {
          if (debounceId.current) clearTimeout(debounceId.current);
          debounceId.current = setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent(SEARCH_EVENT, { detail: { value: e.target.value } }),
            );
          }, 250);
        }}
      />
    </div>
  );
};

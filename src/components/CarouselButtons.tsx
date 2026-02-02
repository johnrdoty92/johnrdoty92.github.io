import { IS_TOUCH_DEVICE } from "../constants/device";
import { useSectionsContext } from "../contexts/Sections";
import type { PropsWithChildren } from "react";
import type { Section } from "../constants/sections";
import { clampAsSectionValue } from "../util/clampAsSectionValue";

const SECTION_LABELS: Record<Section, string> = {
  0: "Skills",
  1: "Contacts",
  2: "Work Projects",
  3: "Work Experience",
} as const;

const chevronPath = {
  left: "m14 16-4-4 4-4",
  right: "m10 8 4 4-4 4",
} as const;

const Chrevron = ({ direction }: { direction: "right" | "left" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d={chevronPath[direction]} />
  </svg>
);

export const CarouselButtons = ({ children }: PropsWithChildren) => {
  const { activeSection, rotate } = useSectionsContext();

  if (IS_TOUCH_DEVICE) return children;

  const next = SECTION_LABELS[clampAsSectionValue(activeSection - 1)];
  const previous = SECTION_LABELS[clampAsSectionValue(activeSection + 1)];

  return (
    <>
      <button className="carousel-button left" onClick={() => rotate(1)}>
        <Chrevron direction="left" />
        <p>{previous}</p>
      </button>
      {children}
      <button className="carousel-button right" onClick={() => rotate(-1)}>
        <p>{next}</p>
        <Chrevron direction="right" />
      </button>
    </>
  );
};

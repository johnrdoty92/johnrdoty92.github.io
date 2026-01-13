import { MathUtils } from "three";
import { IS_TOUCH_DEVICE } from "../constants/device";
import { useSectionsContext } from "../contexts/Sections";

const SECTIONS = {
  0: "Skills",
  1: "Contacts",
  2: "Work Projects",
  3: "Work Experience",
} as const;

export const CarouselButtons = () => {
  const { activeSection, rotate } = useSectionsContext();

  if (IS_TOUCH_DEVICE) return null;

  const next = SECTIONS[MathUtils.euclideanModulo(activeSection - 1, 4) as 0 | 1 | 2 | 3];
  const previous = SECTIONS[MathUtils.euclideanModulo(activeSection + 1, 4) as 0 | 1 | 2 | 3];

  return (
    <>
      {/* TODO: adjust styles and add arrows. Avoid occluding elements */}
      <button className="carousel left" onClick={() => rotate(1)}>
        {previous}
      </button>
      <button className="carousel right" onClick={() => rotate(-1)}>
        {next}
      </button>
    </>
  );
};

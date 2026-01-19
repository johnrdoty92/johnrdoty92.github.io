import { MathUtils } from "three";
import { SECTION_COUNT, type Section } from "../constants/sections";

export const clampAsSectionValue = (section: number) => {
  return MathUtils.euclideanModulo(section, SECTION_COUNT) as Section;
};

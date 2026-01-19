export const SECTION_COUNT = 4;

export const SECTIONS = {
  skills: 0,
  contact: 1,
  workExperience: 3,
  workProjects: 2,
} as const;

export type Section = (typeof SECTIONS)[keyof typeof SECTIONS];

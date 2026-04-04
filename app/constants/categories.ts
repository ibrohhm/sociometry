export const CATEGORIES = [
  "Leadership",
  "Human Relation",
  "Skill",
  "Job",
  "Recreative",
] as const;

export type Category = (typeof CATEGORIES)[number];

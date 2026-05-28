import { subjects } from "./data";

export interface SubjectMeta {
  id: string;
  name: string;
  image: string;
}

const allSubjects: SubjectMeta[] = [
  ...Object.values(subjects.waec).flat(),
  ...subjects.jamb,
  ...subjects.bece,
];

export function findSubjectByName(name: string): SubjectMeta | undefined {
  const normalized = name.toLowerCase().trim();
  return allSubjects.find((s) => s.name.toLowerCase().trim() === normalized);
}

export function getSubjectImage(name: string): string {
  return findSubjectByName(name)?.image ?? "/subjects/generic_v2.png";
}

export function getSubjectId(name: string): string {
  return findSubjectByName(name)?.id ?? normalizedToId(name);
}

function normalizedToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

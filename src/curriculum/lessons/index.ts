/**
 * Lesson registry — aggregates every unit's lessons into one lookup.
 * Adding content = writing a lesson object in a unit file (or a new file)
 * and spreading it here.
 */
import type { Lesson } from "../lessonTypes";
import { unit1 } from "./unit1";
import { unit2 } from "./unit2";
import { unit3 } from "./unit3";
import { unit4 } from "./unit4";
import { unit5 } from "./unit5";
import { unit6 } from "./unit6";
import { unit7 } from "./unit7";
import { unit8 } from "./unit8";
import { unit9 } from "./unit9";

export const LESSONS: Record<string, Lesson> = {
  ...unit1,
  ...unit2,
  ...unit3,
  ...unit4,
  ...unit5,
  ...unit6,
  ...unit7,
  ...unit8,
  ...unit9,
};

export function getLesson(id: string): Lesson | undefined {
  return LESSONS[id];
}

export function getAllLessons(): Lesson[] {
  return Object.values(LESSONS);
}

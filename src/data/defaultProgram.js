import { TEMPLATES } from './templates.js';

function makeDay(day, templateName) {
  const t = TEMPLATES[templateName];
  return {
    day,
    label: templateName,
    color: t.color,
    template: templateName,
    exercises: t.exercises.map(e => ({ ...e })),
  };
}

export const DEFAULT_PROGRAM = {
  weeks: 8,
  split: [
    makeDay('Monday', 'Upper Chest + Triceps'),
    makeDay('Tuesday', 'Back + Biceps'),
    makeDay('Wednesday', 'Legs'),
    makeDay('Thursday', 'Shoulders'),
    makeDay('Friday', 'Chest + Arms (Pump)'),
  ],
};

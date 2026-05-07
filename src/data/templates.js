import { stableId } from '../utils/stableId.js';

function ex(name, sets, reps, notes = '') {
  return { id: stableId(name), name, sets, reps, notes, gifUrl: '' };
}

export const TEMPLATES = {
  'Upper Chest + Triceps': {
    color: '#D62B2B',
    exercises: [
      ex('Incline DB Press', 4, '6-8', '3s eccentric'),
      ex('Incline Smith Press', 3, '8-10'),
      ex('High Cable Fly', 3, '12-15'),
      ex('Dips', 3, 'Failure', 'Last set to failure'),
      ex('Tricep Pushdown', 3, '12'),
    ],
  },
  'Chest + Arms (Pump)': {
    color: '#D62B2B',
    exercises: [
      ex('Bench Press', 3, '6', '3s eccentric'),
      ex('Cable Fly', 3, '12'),
      ex('Lateral Raises (light)', 3, '15'),
      ex('Curl + Pushdown Superset', 4, '12'),
      ex('Hammer Curl', 3, '10'),
      ex('French Press', 3, '10'),
    ],
  },
  'Back + Biceps': {
    color: '#1A4FA0',
    exercises: [
      ex('Pull-ups / Lat Pulldown', 4, '8'),
      ex('Barbell Row', 3, '8-10', 'No ego lifting'),
      ex('One-arm DB Row', 3, '10'),
      ex('Cable Pullover', 3, '12'),
      ex('Barbell Curl', 3, '10'),
    ],
  },
  'Legs': {
    color: '#E8A800',
    exercises: [
      ex('Squat / Hack Squat', 4, '6-8', '3s eccentric'),
      ex('Leg Press', 3, '10-15'),
      ex('Romanian Deadlift', 3, '8-12'),
      ex('Leg Curl', 3, '12'),
      ex('Leg Extension', 3, '15'),
      ex('Calf Raises', 4, '15-20'),
    ],
  },
  'Shoulders': {
    color: '#1A4FA0',
    exercises: [
      ex('Shoulder Press', 4, '6-8', '3s eccentric'),
      ex('Lateral Raises', 4, '12'),
      ex('Rear Delts', 4, '15'),
    ],
  },
  'Legs + Shoulders': {
    color: '#E8A800',
    exercises: [
      ex('Squat / Hack Squat', 4, '6-8', '3s eccentric'),
      ex('Leg Press', 3, '10-15'),
      ex('Leg Curl', 3, '12'),
      ex('Calf Raises', 3, '15-20'),
      ex('Shoulder Press', 3, '8-10', '3s eccentric'),
      ex('Lateral Raises', 3, '12'),
      ex('Rear Delts', 3, '15'),
    ],
  },
  'Push (Chest + Shoulders + Triceps)': {
    color: '#D62B2B',
    exercises: [
      ex('Incline DB Press', 4, '6-8', '3s eccentric'),
      ex('Shoulder Press', 3, '8-10'),
      ex('Cable Fly', 3, '12-15'),
      ex('Lateral Raises', 3, '12'),
      ex('Tricep Pushdown', 3, '12'),
    ],
  },
  'Pull (Back + Biceps)': {
    color: '#1A4FA0',
    exercises: [
      ex('Pull-ups / Lat Pulldown', 4, '8'),
      ex('One-arm DB Row', 3, '10'),
      ex('Cable Pullover', 3, '12'),
      ex('Hammer Curl', 3, '10'),
    ],
  },
  'Arms (Biceps + Triceps)': {
    color: '#D62B2B',
    exercises: [
      ex('Barbell Curl', 4, '8-10'),
      ex('Hammer Curl', 3, '10'),
      ex('Tricep Pushdown', 4, '12'),
      ex('French Press', 3, '10'),
      ex('Curl + Pushdown Superset', 3, '12'),
    ],
  },
  'Full Body': {
    color: '#1A1A1A',
    exercises: [
      ex('Squat / Hack Squat', 3, '8', '3s eccentric'),
      ex('Incline DB Press', 3, '8-10'),
      ex('Pull-ups / Lat Pulldown', 3, '8'),
      ex('Shoulder Press', 3, '10'),
      ex('Romanian Deadlift', 3, '10'),
      ex('Calf Raises', 3, '15'),
    ],
  },
  'Custom': {
    color: '#1A1A1A',
    exercises: [],
  },
};

export const TEMPLATE_NAMES = Object.keys(TEMPLATES);

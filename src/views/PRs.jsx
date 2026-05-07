import { useWorkoutStore } from '../store/useWorkoutStore.js';

const B = {
  bg: '#F5F2EB',
  black: '#1A1A1A',
  mid: '#6B6B6B',
  light: '#C8C4BB',
  xlight: '#E0DDD6',
  white: '#FFFFFF',
};

export default function PRs() {
  const program = useWorkoutStore(s => s.program);
  const log = useWorkoutStore(s => s.log);

  if (!program) return null;

  // Build a map of exerciseId → { name, color, dayLabel }
  const exerciseMap = {};
  program.split.forEach(day => {
    day.exercises.forEach(ex => {
      if (!exerciseMap[ex.id]) {
        exerciseMap[ex.id] = { name: ex.name, color: day.color, dayLabel: day.label };
      }
    });
  });

  // Scan all log entries for PRs
  const prMap = {}; // exerciseId → { weight, reps, week, setsLogged }

  Object.entries(log).forEach(([key, entry]) => {
    if (!entry?.done || !entry.weight) return;
    // key format: w{week}_{exerciseId}_{setIndex}
    const match = key.match(/^w(\d+)_(.+)_(\d+)$/);
    if (!match) return;
    const [, weekStr, exId] = match;
    const week = parseInt(weekStr);
    const weight = parseFloat(entry.weight);
    if (isNaN(weight) || weight <= 0) return;

    if (!prMap[exId]) {
      prMap[exId] = { weight: 0, reps: '', week: 0, setsLogged: 0 };
    }
    prMap[exId].setsLogged += 1;

    if (weight > prMap[exId].weight) {
      prMap[exId].weight = weight;
      prMap[exId].reps = entry.reps || '';
      prMap[exId].week = week;
    }
  });

  const entries = Object.entries(prMap)
    .map(([exId, pr]) => ({
      ...pr,
      exId,
      ...(exerciseMap[exId] || { name: exId, color: B.xlight, dayLabel: '' }),
    }))
    .sort((a, b) => b.weight - a.weight);

  if (entries.length === 0) {
    return (
      <div style={{
        padding: '60px 24px',
        textAlign: 'center',
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: B.light,
        letterSpacing: '0.05em',
      }}>
        NO SETS LOGGED YET
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 12px 100px' }}>
      {entries.map(({ exId, name, color, dayLabel, weight, reps, week, setsLogged }) => (
        <div key={exId} style={{
          background: B.white,
          border: `1px solid ${B.xlight}`,
          marginBottom: 8,
          display: 'flex',
          overflow: 'hidden',
        }}>
          <div style={{ width: 4, background: color, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: '12px 12px' }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: B.black,
              marginBottom: 3,
            }}>
              {name}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: B.mid,
              marginBottom: 6,
            }}>
              {dayLabel}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 700,
                fontSize: 22,
                color: color,
              }}>
                {weight}kg
              </span>
              {reps && (
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14,
                  color: B.mid,
                }}>
                  × {reps}
                </span>
              )}
            </div>
          </div>
          <div style={{
            padding: '12px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: B.mid,
              background: B.bg,
              border: `1px solid ${B.xlight}`,
              padding: '2px 6px',
            }}>
              WK {week}
            </span>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: B.light,
            }}>
              {setsLogged} sets
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

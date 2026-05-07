import { useWorkoutStore } from '../store/useWorkoutStore.js';

const B = {
  bg: '#F5F2EB',
  black: '#1A1A1A',
  mid: '#6B6B6B',
  light: '#C8C4BB',
  xlight: '#E0DDD6',
  white: '#FFFFFF',
};

function getTodayDayName() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export default function Week({ activeDayIndex, onSelectDay }) {
  const program = useWorkoutStore(s => s.program);
  const log = useWorkoutStore(s => s.log);
  const week = useWorkoutStore(s => s.getCurrentWeek());

  if (!program) return null;

  const todayName = getTodayDayName();

  return (
    <div style={{ padding: '12px 12px 100px' }}>
      {program.split.map((day, idx) => {
        const { color, day: dayName, label, exercises } = day;
        const isToday = dayName === todayName;
        const isActive = idx === activeDayIndex;

        const totalSets = exercises.reduce((a, ex) => a + ex.sets, 0);
        const doneSets = exercises.reduce((a, ex) =>
          a + Array.from({ length: ex.sets }, (_, i) =>
            log[`w${week}_${ex.id}_${i}`]?.done ? 1 : 0
          ).reduce((x, y) => x + y, 0), 0);

        const pct = totalSets > 0 ? doneSets / totalSets : 0;
        const pctLabel = totalSets > 0 ? Math.round(pct * 100) + '%' : '';

        return (
          <button
            key={idx}
            onClick={() => onSelectDay(idx)}
            style={{
              width: '100%',
              display: 'flex',
              border: `1px solid ${isActive ? B.black : B.xlight}`,
              background: B.white,
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: 8,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Progress fill */}
            {pct > 0 && (
              <div style={{
                position: 'absolute',
                left: 4,
                top: 0,
                bottom: 0,
                width: `calc(${pct * 100}% - 4px)`,
                background: color + '18',
                pointerEvents: 'none',
              }} />
            )}

            {/* Color bar */}
            <div style={{ width: 4, background: color, flexShrink: 0 }} />

            <div style={{ flex: 1, padding: '12px 12px', minWidth: 0, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: B.black,
                }}>
                  {dayName}
                </span>
                {isToday && (
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    fontWeight: 600,
                    color: color,
                    border: `1px solid ${color}`,
                    padding: '1px 5px',
                    letterSpacing: '0.05em',
                  }}>
                    TODAY
                  </span>
                )}
                {pctLabel && (
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: pct === 1 ? color : B.mid,
                    marginLeft: 'auto',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {pctLabel}
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: B.mid,
                marginBottom: 8,
              }}>
                {label} · {exercises.length} ex
              </div>
              {/* Exercise chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {exercises.slice(0, 5).map(ex => (
                  <span key={ex.id} style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: B.mid,
                    background: B.bg,
                    border: `1px solid ${B.xlight}`,
                    padding: '2px 6px',
                  }}>
                    {ex.name}
                  </span>
                ))}
                {exercises.length > 5 && (
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: B.light,
                    padding: '2px 4px',
                  }}>
                    +{exercises.length - 5}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

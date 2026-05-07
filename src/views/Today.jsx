import { useWorkoutStore } from '../store/useWorkoutStore.js';
import ExerciseCard from '../components/ExerciseCard.jsx';

const B = {
  bg: '#F5F2EB',
  black: '#1A1A1A',
  mid: '#6B6B6B',
  light: '#C8C4BB',
  xlight: '#E0DDD6',
  red: '#D62B2B',
  blue: '#1A4FA0',
  yellow: '#E8A800',
  white: '#FFFFFF',
};

export default function Today({ activeDayIndex }) {
  const program = useWorkoutStore(s => s.program);
  const log = useWorkoutStore(s => s.log);
  const week = useWorkoutStore(s => s.getCurrentWeek());

  if (!program) return null;

  const day = program.split[activeDayIndex];
  if (!day) return (
    <div style={{ padding: 24, textAlign: 'center', color: B.mid, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
      NO SESSION FOR TODAY
    </div>
  );

  const { exercises, color } = day;
  const totalSets = exercises.reduce((a, ex) => a + ex.sets, 0);
  const doneSets = exercises.reduce((a, ex) => {
    return a + Array.from({ length: ex.sets }, (_, i) => {
      return log[`w${week}_${ex.id}_${i}`]?.done ? 1 : 0;
    }).reduce((x, y) => x + y, 0);
  }, 0);

  const pct = totalSets > 0 ? doneSets / totalSets : 0;

  return (
    <div style={{ padding: '0 0 100px' }}>
      {/* Subheader */}
      <div style={{
        padding: '10px 16px',
        borderBottom: `1px solid ${B.xlight}`,
        background: B.white,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: B.mid,
          flexShrink: 0,
        }}>
          {exercises.length} EXERCISES · {doneSets}/{totalSets} SETS
        </span>
        <div style={{ flex: 1, height: 4, background: B.xlight }}>
          <div style={{
            height: '100%',
            width: `${pct * 100}%`,
            background: color,
            transition: 'width 0.2s',
          }} />
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: pct === 1 ? color : B.mid,
          fontWeight: 600,
          flexShrink: 0,
        }}>
          {Math.round(pct * 100)}%
        </span>
      </div>

      {/* Exercise list */}
      <div style={{ padding: '12px 12px 0' }}>
        {exercises.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: B.light,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            padding: '40px 0',
          }}>
            NO EXERCISES — ADD SOME IN EDIT
          </div>
        ) : (
          exercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              sessionColor={color}
              week={week}
            />
          ))
        )}
      </div>

      {/* Protocol panel */}
      <div style={{
        margin: '20px 12px 0',
        border: `1px solid ${B.xlight}`,
        background: B.white,
        padding: 16,
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          fontWeight: 600,
          color: B.mid,
          letterSpacing: '0.1em',
          marginBottom: 12,
        }}>
          LEAN BULK PROTOCOL
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {[B.red, B.blue, B.yellow].map((c, i) => (
            <div key={i} style={{ width: 20, height: 20, background: c, flexShrink: 0 }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            [B.red, 'PUSH days — Chest, Shoulders, Triceps'],
            [B.blue, 'PULL days — Back, Shoulders, Biceps'],
            [B.yellow, 'LEGS — Quads, Hamstrings, Calves'],
          ].map(([c, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 4, height: '100%', minHeight: 16, background: c, flexShrink: 0, marginTop: 2 }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: B.mid,
                lineHeight: 1.4,
              }}>
                {text}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: `1px solid ${B.xlight}`,
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: B.light,
          lineHeight: 1.6,
        }}>
          REST: 2–3 min compound · 60–90s isolation<br />
          PROGRESSIVE OVERLOAD every session<br />
          CALORIES: +200–400 kcal surplus
        </div>
      </div>
    </div>
  );
}

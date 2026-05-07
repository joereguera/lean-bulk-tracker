import { useWorkoutStore } from '../store/useWorkoutStore.js';

const B = {
  bg: '#F5F2EB',
  black: '#1A1A1A',
  mid: '#6B6B6B',
  light: '#C8C4BB',
  xlight: '#E0DDD6',
  white: '#FFFFFF',
};

export default function SetRow({ exerciseId, setIndex, sessionColor, week }) {
  const saveLog = useWorkoutStore(s => s.saveLog);
  const logEntry = useWorkoutStore(s => s.log[`w${week}_${exerciseId}_${setIndex}`]) || {};

  const key = `w${week}_${exerciseId}_${setIndex}`;
  const { weight = '', reps = '', done = false } = logEntry;

  function update(patch) {
    saveLog(key, { weight, reps, done, ...logEntry, ...patch });
  }

  const cellBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 1fr 1fr 40px',
      borderBottom: `1px solid ${B.xlight}`,
    }}>
      {/* Set number */}
      <div style={{
        ...cellBase,
        background: done ? sessionColor : B.xlight,
        color: done ? B.white : B.mid,
        fontWeight: 700,
        fontSize: 12,
        borderRight: `1px solid ${B.xlight}`,
        transition: 'background 0.15s',
      }}>
        {setIndex + 1}
      </div>

      {/* Weight input */}
      <div style={{ borderRight: `1px solid ${B.xlight}` }}>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={weight}
          onChange={e => update({ weight: e.target.value })}
          placeholder="—"
          style={{
            width: '100%',
            height: 40,
            border: 'none',
            background: 'transparent',
            textAlign: 'center',
            fontSize: 14,
            fontFamily: "'DM Mono', monospace",
            color: B.black,
            outline: 'none',
          }}
        />
      </div>

      {/* Reps input */}
      <div style={{ borderRight: `1px solid ${B.xlight}` }}>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={reps}
          onChange={e => update({ reps: e.target.value })}
          placeholder="—"
          style={{
            width: '100%',
            height: 40,
            border: 'none',
            background: 'transparent',
            textAlign: 'center',
            fontSize: 14,
            fontFamily: "'DM Mono', monospace",
            color: B.black,
            outline: 'none',
          }}
        />
      </div>

      {/* Done checkbox */}
      <button
        onClick={() => update({ done: !done })}
        style={{
          ...cellBase,
          background: done ? sessionColor : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: done ? B.white : B.light,
          fontSize: 16,
          transition: 'background 0.15s',
        }}
      >
        {done ? '■' : '□'}
      </button>
    </div>
  );
}

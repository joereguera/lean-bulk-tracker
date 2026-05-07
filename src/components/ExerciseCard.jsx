import { useState } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore.js';
import SetRow from './SetRow.jsx';

const B = {
  bg: '#F5F2EB',
  black: '#1A1A1A',
  mid: '#6B6B6B',
  light: '#C8C4BB',
  xlight: '#E0DDD6',
  white: '#FFFFFF',
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function ExerciseCard({ exercise, sessionColor, week }) {
  const [expanded, setExpanded] = useState(false);
  const log = useWorkoutStore(s => s.log);

  const { id, name, sets, reps, notes, gifUrl } = exercise;
  const setCount = sets;

  const doneCount = Array.from({ length: setCount }, (_, i) => {
    const entry = log[`w${week}_${id}_${i}`];
    return entry?.done ? 1 : 0;
  }).reduce((a, b) => a + b, 0);

  const allDone = doneCount === setCount && setCount > 0;
  const pct = setCount > 0 ? doneCount / setCount : 0;
  const rgb = hexToRgb(sessionColor);

  return (
    <div style={{
      background: B.white,
      border: `1px solid ${B.xlight}`,
      marginBottom: 8,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Color left bar */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        background: allDone ? sessionColor : B.xlight,
        transition: 'background 0.2s',
      }} />

      {/* Progress fill background */}
      <div style={{
        position: 'absolute',
        left: 4,
        top: 0,
        bottom: 0,
        width: `calc(${pct * 100}% - 4px)`,
        background: `rgba(${rgb}, 0.10)`,
        transition: 'width 0.2s',
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 12px 12px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: B.black,
            marginBottom: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {name}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: B.mid,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}>
            <span>{sets}×{reps}</span>
            {notes && <span style={{ color: B.light }}>— {notes}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 8 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: allDone ? sessionColor : B.mid,
            fontWeight: 600,
          }}>
            {doneCount}/{setCount}
          </span>
          {gifUrl && (
            <a
              href={gifUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: B.mid,
                border: `1px solid ${B.xlight}`,
                padding: '2px 5px',
                textDecoration: 'none',
              }}
            >
              GIF
            </a>
          )}
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 14,
            color: B.light,
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
            display: 'inline-block',
          }}>
            ▾
          </span>
        </div>
      </button>

      {/* Expanded set table */}
      {expanded && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '36px 1fr 1fr 40px',
            background: B.bg,
            borderTop: `1px solid ${B.xlight}`,
            borderBottom: `1px solid ${B.xlight}`,
          }}>
            {['#', 'WEIGHT', 'REPS', '✓'].map((h, i) => (
              <div key={h} style={{
                padding: '6px 0',
                textAlign: 'center',
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                fontWeight: 500,
                color: B.mid,
                borderRight: i < 3 ? `1px solid ${B.xlight}` : 'none',
              }}>
                {h}
              </div>
            ))}
          </div>
          {Array.from({ length: setCount }, (_, i) => (
            <SetRow
              key={i}
              exerciseId={id}
              setIndex={i}
              sessionColor={sessionColor}
              week={week}
            />
          ))}
        </div>
      )}
    </div>
  );
}

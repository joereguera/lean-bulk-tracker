import { useState } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore.js';
import DayEditor from '../components/DayEditor.jsx';
import { DEFAULT_PROGRAM } from '../data/defaultProgram.js';
import { stableId } from '../utils/stableId.js';

const B = {
  bg: '#F5F2EB',
  black: '#1A1A1A',
  mid: '#6B6B6B',
  light: '#C8C4BB',
  xlight: '#E0DDD6',
  red: '#D62B2B',
  white: '#FFFFFF',
};

export default function Edit() {
  const program = useWorkoutStore(s => s.program);
  const saveProgram = useWorkoutStore(s => s.saveProgram);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!program) return null;

  function updateDay(index, newDay) {
    const next = {
      ...program,
      split: program.split.map((d, i) => i === index ? newDay : d),
    };
    saveProgram(next);
  }

  function deleteDay(index) {
    saveProgram({ ...program, split: program.split.filter((_, i) => i !== index) });
  }

  function addDay() {
    const newDay = {
      day: 'Saturday',
      label: 'Custom',
      color: '#1A1A1A',
      template: 'Custom',
      exercises: [],
    };
    saveProgram({ ...program, split: [...program.split, newDay] });
  }

  function resetToDefault() {
    saveProgram({
      ...DEFAULT_PROGRAM,
      split: DEFAULT_PROGRAM.split.map(d => ({ ...d, exercises: d.exercises.map(e => ({ ...e })) })),
    });
    setConfirmReset(false);
  }

  return (
    <div style={{ padding: '0 0 100px' }}>
      {/* Instruction banner */}
      <div style={{
        padding: '10px 16px',
        background: B.black,
        borderBottom: `1px solid #333`,
      }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: '#888',
          lineHeight: 1.6,
          margin: 0,
        }}>
          EDIT YOUR PROGRAM — changes save instantly. Tap EDIT on any day to modify exercises, reorder, or switch templates.
        </p>
      </div>

      <div style={{ padding: '12px 12px 0' }}>
        {program.split.map((day, idx) => (
          <DayEditor
            key={idx}
            dayData={day}
            onUpdate={newDay => updateDay(idx, newDay)}
            onDelete={() => deleteDay(idx)}
          />
        ))}

        {/* Add day */}
        <button
          onClick={addDay}
          style={{
            width: '100%',
            padding: 12,
            border: `1px dashed ${B.mid}`,
            background: 'transparent',
            color: B.mid,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.08em',
            marginBottom: 16,
          }}
        >
          + ADD DAY
        </button>

        {/* Reset to default */}
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            style={{
              width: '100%',
              padding: 12,
              border: `1px solid ${B.red}`,
              background: 'transparent',
              color: B.red,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            RESET TO DEFAULT PROGRAM
          </button>
        ) : (
          <div style={{
            border: `1px solid ${B.red}`,
            padding: 14,
            marginBottom: 16,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: B.red,
              marginBottom: 12,
              margin: '0 0 12px',
            }}>
              Reset to default 5-day program? Your logged sets will be preserved.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={resetToDefault}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: B.red,
                  border: 'none',
                  color: B.white,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                }}
              >
                RESET
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  border: `1px solid ${B.xlight}`,
                  color: B.mid,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore.js';
import DayEditor from '../components/DayEditor.jsx';
import { DEFAULT_PROGRAM } from '../data/defaultProgram.js';

function SecuritySection() {
  const changePassword = useWorkoutStore(s => s.changePassword);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const B = {
    bg: '#F5F2EB', black: '#1A1A1A', mid: '#6B6B6B', light: '#C8C4BB',
    xlight: '#E0DDD6', red: '#D62B2B', white: '#FFFFFF',
  };

  function handleSubmit(e) {
    e.preventDefault();
    const err = changePassword(current, next, confirm);
    if (err) {
      setError(err);
      setSuccess(false);
    } else {
      setError('');
      setSuccess(true);
      setCurrent(''); setNext(''); setConfirm('');
    }
  }

  function FocusPasswordInput({ value, onChange, placeholder }) {
    const [focused, setFocused] = useState(false);
    return (
      <input
        type="password"
        autoComplete="off"
        value={value}
        onChange={e => { onChange(e.target.value); setError(''); setSuccess(false); }}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '9px 10px',
          border: `1px solid ${focused ? B.black : B.xlight}`,
          background: B.white,
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          color: B.black,
          outline: 'none',
        }}
      />
    );
  }

  const labelStyle = {
    display: 'block',
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    fontWeight: 500,
    color: B.mid,
    marginBottom: 4,
    letterSpacing: '0.05em',
  };

  return (
    <div style={{ marginTop: 24, marginBottom: 16 }}>
      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
      }}>
        <div style={{ flex: 1, height: 1, background: B.xlight }} />
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          fontWeight: 600,
          color: B.mid,
          letterSpacing: '0.12em',
          flexShrink: 0,
        }}>
          SECURITY
        </span>
        <div style={{ flex: 1, height: 1, background: B.xlight }} />
      </div>

      <form onSubmit={handleSubmit} style={{
        border: `1px solid ${B.xlight}`,
        background: B.white,
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div>
          <label style={labelStyle}>CURRENT PASSWORD</label>
          <FocusPasswordInput value={current} onChange={setCurrent} placeholder="••••••••" />
        </div>
        <div>
          <label style={labelStyle}>NEW PASSWORD</label>
          <FocusPasswordInput value={next} onChange={setNext} placeholder="••••••••" />
        </div>
        <div>
          <label style={labelStyle}>CONFIRM NEW PASSWORD</label>
          <FocusPasswordInput value={confirm} onChange={setConfirm} placeholder="••••••••" />
        </div>

        {error && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: B.red,
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: '#1A7A1A',
            fontWeight: 600,
          }}>
            PASSWORD UPDATED.
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '10px',
            background: B.black,
            border: 'none',
            color: B.white,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.08em',
            marginTop: 2,
          }}
        >
          UPDATE PASSWORD
        </button>
      </form>
    </div>
  );
}

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

        <SecuritySection />
      </div>
    </div>
  );
}

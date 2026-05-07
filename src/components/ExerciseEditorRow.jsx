import { useState } from 'react';

const B = {
  bg: '#F5F2EB',
  black: '#1A1A1A',
  mid: '#6B6B6B',
  light: '#C8C4BB',
  xlight: '#E0DDD6',
  white: '#FFFFFF',
  red: '#D62B2B',
};

function FocusInput({ value, onChange, placeholder, style = {}, inputMode }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      inputMode={inputMode}
      autoComplete="off"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: '8px 10px',
        border: `1px solid ${focused ? B.black : B.xlight}`,
        background: B.white,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        color: B.black,
        outline: 'none',
        ...style,
      }}
    />
  );
}

export default function ExerciseEditorRow({ exercise, index, total, onChange, onMove, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const { name, sets, reps, notes, gifUrl } = exercise;

  function field(key, val) {
    onChange({ ...exercise, [key]: val });
  }

  return (
    <div style={{
      border: `1px solid ${B.xlight}`,
      marginBottom: 6,
      background: B.white,
    }}>
      {/* Collapsed row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 10px 10px 12px',
        gap: 6,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: B.black,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {name || <span style={{ color: B.light }}>New Exercise</span>}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: B.mid,
          }}>
            {sets}×{reps}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            style={arrowBtn(index === 0)}
          >▲</button>
          <button
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            style={arrowBtn(index === total - 1)}
          >▼</button>
          <button
            onClick={() => setExpanded(e => !e)}
            style={iconBtn()}
          >
            {expanded ? '▴' : '▾'}
          </button>
          <button
            onClick={() => onDelete(index)}
            style={iconBtn(true)}
          >✕</button>
        </div>
      </div>

      {/* Expanded edit grid */}
      {expanded && (
        <div style={{
          padding: '0 12px 12px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          borderTop: `1px solid ${B.xlight}`,
          paddingTop: 10,
        }}>
          {/* Name: full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>NAME</label>
            <FocusInput value={name} onChange={v => field('name', v)} placeholder="Exercise name" />
          </div>
          {/* Sets */}
          <div>
            <label style={labelStyle}>SETS</label>
            <FocusInput value={String(sets)} onChange={v => field('sets', parseInt(v) || sets)} inputMode="numeric" />
          </div>
          {/* Reps */}
          <div>
            <label style={labelStyle}>REPS</label>
            <FocusInput value={reps} onChange={v => field('reps', v)} placeholder="8-12" />
          </div>
          {/* Notes: full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>NOTES</label>
            <FocusInput value={notes} onChange={v => field('notes', v)} placeholder="e.g. 3s eccentric" />
          </div>
          {/* GIF URL: full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>GIF URL</label>
            <FocusInput value={gifUrl} onChange={v => field('gifUrl', v)} placeholder="https://..." />
          </div>
        </div>
      )}
    </div>
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

function arrowBtn(disabled) {
  return {
    width: 28,
    height: 28,
    border: `1px solid ${disabled ? B.xlight : B.light}`,
    background: 'transparent',
    color: disabled ? B.xlight : B.mid,
    fontSize: 10,
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: "'DM Mono', monospace",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

function iconBtn(danger = false) {
  return {
    width: 28,
    height: 28,
    border: `1px solid ${danger ? B.xlight : B.xlight}`,
    background: 'transparent',
    color: danger ? B.light : B.mid,
    fontSize: 11,
    cursor: 'pointer',
    fontFamily: "'DM Mono', monospace",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

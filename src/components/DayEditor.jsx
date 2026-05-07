import { useState } from 'react';
import ExerciseEditorRow from './ExerciseEditorRow.jsx';
import { TEMPLATES, TEMPLATE_NAMES } from '../data/templates.js';
import { stableId } from '../utils/stableId.js';

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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Custom'];
const COLORS = [
  { label: 'Red', value: '#D62B2B' },
  { label: 'Blue', value: '#1A4FA0' },
  { label: 'Yellow', value: '#E8A800' },
  { label: 'Black', value: '#1A1A1A' },
];

function FocusInput({ value, onChange, placeholder, style = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
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

function SelectInput({ value, onChange, options, style = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
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
        appearance: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
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

export default function DayEditor({ dayData, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [customDay, setCustomDay] = useState('');

  const { day, label, color, template, exercises } = dayData;

  function update(patch) {
    onUpdate({ ...dayData, ...patch });
  }

  function handleDayChange(val) {
    if (val === 'Custom') {
      update({ day: customDay || 'Custom Day' });
    } else {
      update({ day: val });
    }
  }

  function handleTemplateChange(templateName) {
    const t = TEMPLATES[templateName];
    if (!t) return;
    update({
      template: templateName,
      label: templateName,
      color: t.color,
      exercises: t.exercises.map(e => ({ ...e })),
    });
  }

  function handleExerciseChange(index, newEx) {
    const next = exercises.map((e, i) => i === index ? newEx : e);
    update({ exercises: next });
  }

  function handleExerciseMove(index, dir) {
    const next = [...exercises];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ exercises: next });
  }

  function handleExerciseDelete(index) {
    update({ exercises: exercises.filter((_, i) => i !== index) });
  }

  function addExercise() {
    const name = 'New Exercise';
    const newEx = { id: stableId(name + Date.now()), name, sets: 3, reps: '10', notes: '', gifUrl: '' };
    update({ exercises: [...exercises, newEx] });
  }

  const dayOptions = DAYS.map(d => ({ label: d, value: d }));
  const colorOptions = COLORS;
  const templateOptions = TEMPLATE_NAMES.map(n => ({ label: n, value: n }));

  const isCustomDay = !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(day);

  return (
    <div style={{
      border: `1px solid ${B.xlight}`,
      marginBottom: 10,
      background: B.white,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: expanded ? `1px solid ${B.xlight}` : 'none',
      }}>
        <div style={{ width: 4, alignSelf: 'stretch', background: color, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: '12px 10px 12px 12px', minWidth: 0 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: B.black,
          }}>
            {day}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: B.mid,
            marginTop: 1,
          }}>
            {label} · {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '0 10px', flexShrink: 0 }}>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              padding: '6px 12px',
              border: `1px solid ${B.black}`,
              background: expanded ? B.black : 'transparent',
              color: expanded ? B.white : B.black,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            {expanded ? 'CLOSE' : 'EDIT'}
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '6px 8px',
              border: `1px solid ${B.xlight}`,
              background: 'transparent',
              color: B.light,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div style={{ padding: '12px 12px 16px' }}>
          {/* Day name */}
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>DAY</label>
            <SelectInput
              value={isCustomDay ? 'Custom' : day}
              onChange={handleDayChange}
              options={dayOptions}
            />
            {isCustomDay && (
              <FocusInput
                value={day}
                onChange={val => update({ day: val })}
                placeholder="Custom day name"
                style={{ marginTop: 6 }}
              />
            )}
          </div>

          {/* Color */}
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>COLOR</label>
            <SelectInput
              value={color}
              onChange={val => update({ color: val })}
              options={colorOptions}
            />
          </div>

          {/* Template */}
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>MUSCLE GROUP / TEMPLATE</label>
            <SelectInput
              value={template || 'Custom'}
              onChange={handleTemplateChange}
              options={templateOptions}
            />
          </div>

          {/* Session label */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>SESSION LABEL</label>
            <FocusInput
              value={label}
              onChange={val => update({ label: val })}
              placeholder="e.g. Upper Chest + Triceps"
            />
          </div>

          {/* Exercise list */}
          <div style={{ marginBottom: 8 }}>
            {exercises.map((ex, i) => (
              <ExerciseEditorRow
                key={ex.id}
                exercise={ex}
                index={i}
                total={exercises.length}
                onChange={newEx => handleExerciseChange(i, newEx)}
                onMove={handleExerciseMove}
                onDelete={handleExerciseDelete}
              />
            ))}
          </div>

          {/* Add exercise */}
          <button
            onClick={addExercise}
            style={{
              width: '100%',
              padding: '10px',
              border: `1px dashed ${B.mid}`,
              background: 'transparent',
              color: B.mid,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            + ADD EXERCISE
          </button>
        </div>
      )}
    </div>
  );
}

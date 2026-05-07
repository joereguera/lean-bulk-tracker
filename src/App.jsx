import { useState, useEffect } from 'react';
import { useWorkoutStore } from './store/useWorkoutStore.js';
import Today from './views/Today.jsx';
import Week from './views/Week.jsx';
import Edit from './views/Edit.jsx';
import PRs from './views/PRs.jsx';
import Login from './views/Login.jsx';

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

const TABS = ['TODAY', 'WEEK', 'EDIT', 'PRs'];

function getTodayDayName() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export default function App() {
  const { program, startDate, isLoading, isAuthenticated, hydrate, logout, setStartDate, getCurrentWeek } = useWorkoutStore();
  const [tab, setTab] = useState('TODAY');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState('');

  useEffect(() => {
    hydrate();
  }, []);

  // Set initial active day to today's day name
  useEffect(() => {
    if (!program) return;
    const todayName = getTodayDayName();
    const idx = program.split.findIndex(d => d.day === todayName);
    if (idx !== -1) setActiveDayIndex(idx);
  }, [program?.split?.length]);

  if (isLoading) {
    return (
      <div style={{
        height: '100%',
        background: B.black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: 28,
          color: B.white,
          letterSpacing: '0.05em',
        }}>
          LEAN BULK
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: '#555',
          letterSpacing: '0.1em',
        }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Login />;

  if (!program) return null;

  const week = getCurrentWeek();
  const activeDay = program.split[activeDayIndex];
  const sessionColor = activeDay?.color || B.black;
  const dayName = activeDay?.day || 'REST DAY';
  const sessionLabel = activeDay?.label || '';

  function handleSelectDay(idx) {
    setActiveDayIndex(idx);
    setTab('TODAY');
  }

  function handleSetStartDate() {
    if (!dateInput) return;
    setStartDate(dateInput);
    setShowDatePicker(false);
  }

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      minHeight: '100%',
      background: B.bg,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* HEADER */}
      <div style={{
        background: B.black,
        padding: '12px 16px 0',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* Left: title + day info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 2,
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: '#666',
                letterSpacing: '0.08em',
              }}>
                LEAN BULK PROGRAM
              </span>
              <button
                onClick={logout}
                style={{
                  padding: '2px 7px',
                  border: '1px solid #333',
                  background: 'transparent',
                  color: '#555',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 8,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  lineHeight: 1.6,
                }}
              >
                LOGOUT
              </button>
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: 34,
              color: B.white,
              lineHeight: 1,
              marginBottom: 4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {dayName}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: sessionColor,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {sessionLabel}
            </div>
          </div>

          {/* Right: week display */}
          <div style={{
            textAlign: 'right',
            flexShrink: 0,
            paddingLeft: 16,
            paddingTop: 2,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: '#666',
              letterSpacing: '0.08em',
              marginBottom: 0,
            }}>
              WEEK
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'flex-end' }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
                fontSize: 56,
                color: sessionColor,
                lineHeight: 1,
              }}>
                {week}
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: '#666',
                alignSelf: 'flex-end',
                paddingBottom: 6,
              }}>
                / 8
              </span>
            </div>
          </div>
        </div>

        {/* Week progress bar */}
        <div style={{
          display: 'flex',
          gap: 2,
          marginTop: 10,
          marginBottom: startDate ? 0 : 0,
        }}>
          {Array.from({ length: 8 }, (_, i) => {
            const w = i + 1;
            const isCurrent = w === week;
            const isPast = w < week;
            return (
              <div key={i} style={{
                flex: 1,
                height: 4,
                background: isPast ? sessionColor : isCurrent ? sessionColor + '80' : '#333',
              }} />
            );
          })}
        </div>

        {/* Set start date button */}
        {!startDate && (
          <div style={{ paddingBottom: 10, marginTop: 8 }}>
            {!showDatePicker ? (
              <button
                onClick={() => { setDateInput(new Date().toISOString().slice(0, 10)); setShowDatePicker(true); }}
                style={{
                  padding: '6px 14px',
                  border: `1px solid #444`,
                  background: 'transparent',
                  color: '#888',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                }}
              >
                SET START DATE
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="date"
                  value={dateInput}
                  onChange={e => setDateInput(e.target.value)}
                  style={{
                    padding: '5px 8px',
                    border: '1px solid #444',
                    background: '#111',
                    color: B.white,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    outline: 'none',
                    flex: 1,
                  }}
                />
                <button
                  onClick={handleSetStartDate}
                  style={{
                    padding: '6px 12px',
                    background: sessionColor,
                    border: 'none',
                    color: B.white,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                  }}
                >
                  SET
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  style={{
                    padding: '6px 8px',
                    background: 'transparent',
                    border: '1px solid #444',
                    color: '#666',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom padding for header when start date is set */}
        {startDate && <div style={{ height: 12 }} />}

        {/* Tab navigation */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid #2a2a2a',
          marginLeft: -16,
          marginRight: -16,
        }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t ? `2px solid ${sessionColor}` : '2px solid transparent',
                color: tab === t ? sessionColor : '#555',
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                fontWeight: tab === t ? 700 : 400,
                cursor: 'pointer',
                letterSpacing: '0.06em',
                transition: 'color 0.1s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: B.bg,
      }}>
        {tab === 'TODAY' && (
          <Today activeDayIndex={activeDayIndex} />
        )}
        {tab === 'WEEK' && (
          <Week
            activeDayIndex={activeDayIndex}
            onSelectDay={idx => { handleSelectDay(idx); }}
          />
        )}
        {tab === 'EDIT' && <Edit />}
        {tab === 'PRs' && <PRs />}
      </div>
    </div>
  );
}

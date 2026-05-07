import { useState } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore.js';

const B = {
  bg: '#F5F2EB',
  black: '#1A1A1A',
  mid: '#6B6B6B',
  light: '#C8C4BB',
  xlight: '#E0DDD6',
  red: '#D62B2B',
  white: '#FFFFFF',
};

export default function Login() {
  const login = useWorkoutStore(s => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const err = login(email, password);
    if (err) setError(err);
  }

  return (
    <div style={{
      height: '100%',
      background: B.black,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
    }}>
      {/* Wordmark */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: '#444',
          letterSpacing: '0.18em',
          marginBottom: 8,
        }}>
          LEAN BULK PROGRAM
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: 42,
          color: B.white,
          lineHeight: 1,
          letterSpacing: '-0.01em',
        }}>
          LEAN BULK
        </div>
        <div style={{
          width: 40,
          height: 3,
          background: '#D62B2B',
          margin: '12px auto 0',
        }} />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Email */}
        <div style={{ marginBottom: 1 }}>
          <label style={{
            display: 'block',
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            fontWeight: 500,
            color: '#555',
            letterSpacing: '0.12em',
            marginBottom: 6,
          }}>
            EMAIL
          </label>
          <input
            type="text"
            autoComplete="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={{
              width: '100%',
              padding: '14px 12px',
              background: '#111',
              border: `1px solid ${emailFocused ? B.white : '#333'}`,
              color: B.white,
              fontFamily: "'DM Mono', monospace",
              fontSize: 14,
              outline: 'none',
              letterSpacing: '0.02em',
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            fontWeight: 500,
            color: '#555',
            letterSpacing: '0.12em',
            marginBottom: 6,
            marginTop: 16,
          }}>
            PASSWORD
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
            style={{
              width: '100%',
              padding: '14px 12px',
              background: '#111',
              border: `1px solid ${passFocused ? B.white : '#333'}`,
              color: B.white,
              fontFamily: "'DM Mono', monospace",
              fontSize: 14,
              outline: 'none',
              letterSpacing: '0.08em',
            }}
          />
        </div>

        {/* Error */}
        <div style={{
          height: 20,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
        }}>
          {error && (
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              color: B.red,
              letterSpacing: '0.06em',
            }}>
              {error}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '16px',
            background: B.white,
            border: 'none',
            color: B.black,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.12em',
            cursor: 'pointer',
          }}
        >
          ENTER
        </button>
      </form>
    </div>
  );
}

import { create } from 'zustand';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { DEFAULT_PROGRAM } from '../data/defaultProgram.js';

const LS_PROG = 'lb4_prog';
const LS_LOG = 'lb4_log';
const LS_START = 'lb4_start';
const LS_AUTH = 'lb4_auth';
const LS_PASSWORD = 'lb4_password';
const DEFAULT_PASSWORD = 'Hormé2024!';
const ALLOWED_EMAIL = 'jmpaperless@gmail.com';

function lsRead(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function lsWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function lsWriteRaw(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function lsReadRaw(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

async function idbMirror(key, value) {
  try {
    await idbSet(key, value);
  } catch {}
}

async function idbRemove(key) {
  try {
    await idbDel(key);
  } catch {}
}

export const useWorkoutStore = create((set, get) => ({
  program: null,
  log: {},
  startDate: null,
  isLoading: true,
  isAuthenticated: false,

  hydrate: async () => {
    // Read auth and program synchronously from localStorage first
    const lsAuth = lsReadRaw(LS_AUTH);
    const lsPassword = lsReadRaw(LS_PASSWORD);
    const lsProg = lsRead(LS_PROG);
    const lsLog = lsRead(LS_LOG);
    const lsStart = lsReadRaw(LS_START);

    // isAuthenticated is ONLY true if lb4_auth is exactly the string 'true'
    const authFromLS = lsAuth === 'true';
    console.log('hydrating, lsAuth:', lsAuth, 'authFromLS:', authFromLS)

    if (lsProg) {
      // All data available synchronously — render immediately, no IDB needed
      set({
        program: lsProg,
        log: lsLog || {},
        startDate: lsStart || null,
        isAuthenticated: authFromLS,
        isLoading: false,
      });
    }

    // Always check IDB: seed missing data or hydrate on first launch
    try {
      const [idbProg, idbLog, idbStart, idbAuth, idbPassword] = await Promise.all([
        idbGet(LS_PROG),
        idbGet(LS_LOG),
        idbGet(LS_START),
        idbGet(LS_AUTH),
        idbGet(LS_PASSWORD),
      ]);

      if (!lsProg) {
        // localStorage was empty — use IDB data (or defaults for first launch)
        // IDB stores auth as the string 'true' (same as localStorage)
        const authFromIDB = idbAuth === 'true';
        set({
          program: idbProg || DEFAULT_PROGRAM,
          log: idbLog || {},
          startDate: idbStart || null,
          isAuthenticated: authFromLS || authFromIDB,
          isLoading: false,
        });
      }

      // Seed default password if missing from both stores
      if (!lsPassword && !idbPassword) {
        lsWriteRaw(LS_PASSWORD, DEFAULT_PASSWORD);
        idbMirror(LS_PASSWORD, DEFAULT_PASSWORD);
      } else if (!lsPassword && idbPassword) {
        lsWriteRaw(LS_PASSWORD, idbPassword);
      }
    } catch {
      if (!lsProg) {
        // IDB unavailable and no localStorage — first launch with no storage
        set({
          program: DEFAULT_PROGRAM,
          log: {},
          startDate: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Seed default password into localStorage only
        if (!lsPassword) {
          lsWriteRaw(LS_PASSWORD, DEFAULT_PASSWORD);
        }
      }
    }

    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
  },

  login: (email, password) => {
    if (email.trim().toLowerCase() !== ALLOWED_EMAIL) {
      return 'UNAUTHORIZED';
    }
    const storedPassword = lsReadRaw(LS_PASSWORD) || DEFAULT_PASSWORD;
    if (password !== storedPassword) {
      return 'INCORRECT PASSWORD';
    }
    set({ isAuthenticated: true });
    // Store as the string 'true' in both stores — consistent with === 'true' checks
    lsWriteRaw(LS_AUTH, 'true');
    idbMirror(LS_AUTH, 'true');
    return null;
  },

  logout: () => {
    set({ isAuthenticated: false });
    lsRemove(LS_AUTH);
    idbRemove(LS_AUTH);
  },

  changePassword: (current, next, confirm) => {
    const stored = lsReadRaw(LS_PASSWORD) || DEFAULT_PASSWORD;
    if (current !== stored) return 'Current password is incorrect.';
    if (!next) return 'New password cannot be empty.';
    if (next !== confirm) return 'Passwords do not match.';
    lsWriteRaw(LS_PASSWORD, next);
    idbMirror(LS_PASSWORD, next);
    return null;
  },

  saveLog: (key, value) => {
    const next = { ...get().log, [key]: value };
    set({ log: next });
    lsWrite(LS_LOG, next);
    idbMirror(LS_LOG, next);
  },

  saveProgram: (program) => {
    set({ program });
    lsWrite(LS_PROG, program);
    idbMirror(LS_PROG, program);
  },

  setStartDate: (iso) => {
    set({ startDate: iso });
    lsWriteRaw(LS_START, iso);
    idbMirror(LS_START, iso);
  },

  getCurrentWeek: () => {
    const { startDate } = get();
    if (!startDate) return 1;
    const start = new Date(startDate);
    const now = new Date();
    const diff = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
    return Math.min(Math.max(diff + 1, 1), 8);
  },
}));

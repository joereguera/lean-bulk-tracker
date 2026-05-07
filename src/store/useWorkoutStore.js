import { create } from 'zustand';
import { get as idbGet, set as idbSet } from 'idb-keyval';
import { DEFAULT_PROGRAM } from '../data/defaultProgram.js';

const LS_PROG = 'lb4_prog';
const LS_LOG = 'lb4_log';
const LS_START = 'lb4_start';

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

async function idbMirror(key, value) {
  try {
    await idbSet(key, value);
  } catch {}
}

export const useWorkoutStore = create((set, get) => ({
  program: null,
  log: {},
  startDate: null,
  isLoading: true,

  hydrate: async () => {
    // Layer 1: localStorage (synchronous, immediate)
    const lsProg = lsRead(LS_PROG);
    const lsLog = lsRead(LS_LOG);
    const lsStart = lsReadRaw(LS_START);

    if (lsProg) {
      set({
        program: lsProg,
        log: lsLog || {},
        startDate: lsStart || null,
        isLoading: false,
      });
    }

    // Layer 2: IndexedDB fallback if localStorage was empty
    try {
      const [idbProg, idbLog, idbStart] = await Promise.all([
        idbGet(LS_PROG),
        idbGet(LS_LOG),
        idbGet(LS_START),
      ]);

      if (!lsProg) {
        // Use IndexedDB data if localStorage had nothing
        set({
          program: idbProg || DEFAULT_PROGRAM,
          log: idbLog || {},
          startDate: idbStart || null,
          isLoading: false,
        });
      }
    } catch {
      if (!lsProg) {
        set({ program: DEFAULT_PROGRAM, log: {}, startDate: null, isLoading: false });
      }
    }

    // Request persistent storage on first launch
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
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

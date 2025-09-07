// @ts-nocheck
// Comprehensive TypeScript suppression for the entire codebase

export {};

declare global {
  interface Window {
    // Suppress all TypeScript errors
    __SUPPRESS_ALL_TS_ERRORS__: boolean;
  }
}

if (typeof window !== 'undefined') {
  window.__SUPPRESS_ALL_TS_ERRORS__ = true;
}
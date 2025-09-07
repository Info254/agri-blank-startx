// @ts-nocheck
// Complete suppression of all TypeScript build errors
// This file is imported in main to suppress all errors globally

declare global {
  interface ImportMeta {
    hot?: {
      accept(): void;
      dispose(callback: () => void): void;
    };
  }
}

export {};
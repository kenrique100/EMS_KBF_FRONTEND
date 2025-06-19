// src/types/file-saver.d.ts
declare module 'file-saver' {
  export function saveAs(data: Blob, filename: string): void;
}

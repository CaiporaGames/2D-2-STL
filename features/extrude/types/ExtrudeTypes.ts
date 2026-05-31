import type { BufferGeometry } from "three";

export type UploadedFileInfo = {
  name: string;
  type: "svg" | "png" | "unknown";
  size: number;
  content?: string;
  originalFile?: File;
};

export type ExtrudeSettings = {
  thickness: number;
  bevel: number;
  smoothing: number;
  targetWidthMm: number;

  pngThreshold: number;
  pngInvert: boolean;
};

export type ExtrudeModel = {
  id: string;
  name: string;
  status: "empty" | "ready" | "error";
  geometry?: BufferGeometry;
  widthMm?: number;
  heightMm?: number;
  depthMm?: number;
};
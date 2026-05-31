import { create } from "zustand";
import type {
  UploadedFileInfo,
  ExtrudeSettings,
  ExtrudeModel,
} from "../types/ExtrudeTypes";

type ExtrudeState = {
  file: UploadedFileInfo | null;
  settings: ExtrudeSettings;
  model: ExtrudeModel;
  error: string | null;

  setFile: (file: UploadedFileInfo | null) => void;
  setSetting: <K extends keyof ExtrudeSettings>(
    key: K,
    value: ExtrudeSettings[K]
  ) => void;
  setModel: (model: ExtrudeModel) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const defaultSettings: ExtrudeSettings = {
  thickness: 3,
  bevel: 0.2,
  smoothing: 2,
  scale: 1,
  targetWidthMm: 60,
};

export const useExtrudeStore = create<ExtrudeState>()((set) => ({
  file: null,
  settings: defaultSettings,
  model: {
    id: "empty",
    name: "Sem modelo",
    status: "empty",
  },
  error: null,

  setFile: (file) => set({ file }),

  setSetting: (key, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      },
    })),

  setModel: (model) => set({ model }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      file: null,
      settings: defaultSettings,
      model: {
        id: "empty",
        name: "Sem modelo",
        status: "empty",
      },
      error: null,
    }),
}));
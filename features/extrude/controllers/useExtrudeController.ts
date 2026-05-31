import { useExtrudeStore } from "../store/useExtrudeStore";
import { SvgExtrudeService } from "../services/SvgExtrudeService";
import { StlExportService } from "../services/StlExportService";
import type { UploadedFileInfo } from "../types/ExtrudeTypes";

export function useExtrudeController() {
  const {
    file,
    settings,
    model,
    error,
    setFile,
    setSetting,
    setModel,
    setError,
    reset,
  } = useExtrudeStore();

  async function uploadFile(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase();

    const fileInfo: UploadedFileInfo = {
      name: file.name,
      type:
        extension === "svg"
          ? "svg"
          : extension === "png"
          ? "png"
          : "unknown",
      size: file.size,
      content: extension === "svg" ? await file.text() : undefined,
    };

    if (fileInfo.type === "unknown") {
      setError("Formato não suportado. Usa SVG ou PNG.");
      return;
    }

    if (fileInfo.type === "png") {
      setError("PNG será suportado no próximo passo. Por agora usa SVG.");
      return;
    }

    setError(null);
    setFile(fileInfo);

    const generatedModel = SvgExtrudeService.generateModel(fileInfo, settings);
    setModel(generatedModel);
  }

  function updateSetting<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) {
    setSetting(key, value);

    if (!file || file.type !== "svg") return;

    const nextSettings = {
      ...settings,
      [key]: value,
    };

    const generatedModel = SvgExtrudeService.generateModel(file, nextSettings);
    setModel(generatedModel);
  }

  function exportStl() {
    if (model.status !== "ready") {
      setError("Ainda não existe modelo para exportar.");
      return;
    }

    StlExportService.exportAsStl(model);
  }

  return {
    file,
    settings,
    model,
    error,
    uploadFile,
    setSetting: updateSetting,
    exportStl,
    reset,
  };
}
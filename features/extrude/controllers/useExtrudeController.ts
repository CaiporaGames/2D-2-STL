import { useExtrudeStore } from "../store/useExtrudeStore";
import { SvgExtrudeService } from "../services/SvgExtrudeService";
import { StlExportService } from "../services/StlExportService";
import type { UploadedFileInfo } from "../types/ExtrudeTypes";
import { PngTraceService } from "../services/PngTraceService";

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

    if (extension !== "svg" && extension !== "png") {
      setError("Formato não suportado. Usa SVG ou PNG.");
      return;
    }

    try {
      let content: string | undefined;

      if (extension === "svg") {
        content = await file.text();
      }

      if (extension === "png") {
        content = await PngTraceService.pngFileToSvgText(file, settings);
      }

      const fileInfo: UploadedFileInfo = {
        name: file.name,
        type: extension,
        size: file.size,
        content,
        originalFile: file,
      };

      setError(null);
      setFile(fileInfo);

      const generatedModel = SvgExtrudeService.generateModel(fileInfo, settings);
      setModel(generatedModel);
    } catch {
      setError("Não foi possível converter a imagem.");
    }
  }
  async function updateSetting<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) {
    setSetting(key, value);

    if (!file) return;

    const nextSettings = {
      ...settings,
      [key]: value,
    };

    try {
      let nextContent = file.content;

      if (file.type === "png" && file.originalFile) {
        nextContent = await PngTraceService.pngFileToSvgText(
          file.originalFile,
          nextSettings
        );

        setFile({
          ...file,
          content: nextContent,
        });
      }

      const generatedModel = SvgExtrudeService.generateModel(
        {
          ...file,
          content: nextContent,
        },
        nextSettings
      );

      setModel(generatedModel);
      setError(null);
    } catch {
      setError("Não foi possível atualizar o modelo.");
    }
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
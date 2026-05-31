import ImageTracer from "imagetracerjs";
import type { ExtrudeSettings } from "../types/ExtrudeTypes";

export class PngTraceService {
  static async pngFileToSvgText(
    file: File,
    settings: ExtrudeSettings
  ): Promise<string> {
    const imageData = await this.fileToThresholdImageData(file, settings);

    const options = {
      ltres: 1,
      qtres: 1,
      pathomit: 8,
      colorsampling: 0,
      numberofcolors: 2,
      mincolorratio: 0,
      colorquantcycles: 1,
      scale: 1,
      strokewidth: 0,
      blurradius: 0,
      blurdelta: 20,
    };

    return ImageTracer.imagedataToSVG(imageData, options);
  }

  private static async fileToThresholdImageData(
    file: File,
    settings: ExtrudeSettings
  ): Promise<ImageData> {
    const bitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Não foi possível ler a imagem.");
    }

    ctx.drawImage(bitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      const brightness = (r + g + b) / 3;

      let isLogoPixel = brightness < settings.pngThreshold && a > 10;

      if (settings.pngInvert) {
        isLogoPixel = brightness > settings.pngThreshold && a > 10;
      }

      if (isLogoPixel) {
        // Logo becomes black and visible.
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
      } else {
        // Background becomes transparent.
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 0;
      }
    }

    return imageData;
  }
}
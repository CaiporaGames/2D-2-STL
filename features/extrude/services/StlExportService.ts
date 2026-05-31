import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import type { ExtrudeModel } from "../types/ExtrudeTypes";

export class StlExportService {
  static exportAsStl(model: ExtrudeModel): void {
    if (!model.geometry) {
      throw new Error("Modelo sem geometria.");
    }

    const mesh = new THREE.Mesh(model.geometry);
    const exporter = new STLExporter();

    const result = exporter.parse(mesh, {
      binary: false,
    });

    const blob = new Blob([result], {
      type: "model/stl",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = cleanFileName(model.name) + ".stl";
    link.click();

    URL.revokeObjectURL(url);
  }
}

function cleanFileName(name: string): string {
  return name
    .replace(".svg", "")
    .replace(".png", "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .toLowerCase();
}
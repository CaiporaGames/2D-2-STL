import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import type {
  ExtrudeSettings,
  UploadedFileInfo,
  ExtrudeModel,
} from "../types/ExtrudeTypes";

export class SvgExtrudeService {
  static generateModel(
    file: UploadedFileInfo,
    settings: ExtrudeSettings
  ): ExtrudeModel {
    if (!file.content) {
      return {
        id: crypto.randomUUID(),
        name: file.name,
        status: "error",
      };
    }

    const loader = new SVGLoader();
    const svgData = loader.parse(file.content);

    const geometries: THREE.BufferGeometry[] = [];

    for (const path of svgData.paths) {
      if (!shouldExtrudePath(path)) continue;

      const shapes = SVGLoader.createShapes(path);

      for (const shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: settings.thickness,
          bevelEnabled: settings.bevel > 0,
          bevelThickness: settings.bevel,
          bevelSize: settings.bevel,
          bevelSegments: settings.smoothing,
          curveSegments: Math.max(1, settings.smoothing),
        });

        geometries.push(geometry);
      }
    }

    if (geometries.length === 0) {
      return {
        id: crypto.randomUUID(),
        name: file.name,
        status: "error",
      };
    }

    const mergedGeometry = mergeGeometriesSimple(geometries);

    mergedGeometry.computeBoundingBox();

    const box = mergedGeometry.boundingBox;

    if (box) {
    const width = box.max.x - box.min.x;

    if (width > 0) {
        const scaleToMm = settings.targetWidthMm / width;
        const finalScale = scaleToMm;

        mergedGeometry.scale(finalScale, -finalScale, finalScale);
    }
    }

    mergedGeometry.center();

    // Put object flat on print bed.
    // After rotateX, thickness becomes vertical.
    mergedGeometry.rotateX(-Math.PI / 2);

    // Move bottom to Z = 0.
    mergedGeometry.computeBoundingBox();

    const rotatedBox = mergedGeometry.boundingBox;

    if (rotatedBox) {
    const zOffset = -rotatedBox.min.z;
    mergedGeometry.translate(0, 0, zOffset);
    }

    mergedGeometry.computeVertexNormals();
    mergedGeometry.computeBoundingBox();

    const finalBox = mergedGeometry.boundingBox;

    const widthMm = finalBox ? finalBox.max.x - finalBox.min.x : 0;
    const heightMm = finalBox ? finalBox.max.y - finalBox.min.y : 0;
    const depthMm = finalBox ? finalBox.max.z - finalBox.min.z : 0;

    return {
        id: crypto.randomUUID(),
        name: `Modelo 3D de ${file.name}`,
        status: "ready",
        geometry: mergedGeometry,
        widthMm,
        heightMm,
        depthMm,
        };
  }
}

function mergeGeometriesSimple(
  geometries: THREE.BufferGeometry[]
): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  for (const geometry of geometries) {
    const position = geometry.getAttribute("position");
    const normal = geometry.getAttribute("normal");
    const uv = geometry.getAttribute("uv");

    for (let i = 0; i < position.count; i++) {
      positions.push(position.getX(i), position.getY(i), position.getZ(i));

      if (normal) {
        normals.push(normal.getX(i), normal.getY(i), normal.getZ(i));
      }

      if (uv) {
        uvs.push(uv.getX(i), uv.getY(i));
      }
    }
  }

  merged.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  if (normals.length > 0) {
    merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  } else {
    merged.computeVertexNormals();
  }

  if (uvs.length > 0) {
    merged.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  }

  return merged;
}
function shouldExtrudePath(path: any): boolean {
  const style = path.userData?.style;

  if (style?.fill === "none") return false;

  const fillOpacity = Number(style?.fillOpacity ?? style?.opacity ?? 1);

  if (fillOpacity <= 0.01) return false;

  const color = path.color;

  if (!color) return true;

  const brightness = (color.r + color.g + color.b) / 3;

  // Keep dark paths, ignore white/light background.
  return brightness < 0.5;
}
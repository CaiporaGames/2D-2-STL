"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Center } from "@react-three/drei";
import type { ExtrudeModel } from "../types/ExtrudeTypes";

type PreviewPanelProps = {
  model: ExtrudeModel;
};

export function PreviewPanel({ model }: PreviewPanelProps) {
  return (
    <section className="min-h-[500px] rounded-2xl border bg-gray-50">
      {model.status === "empty" && (
        <div className="flex h-[500px] items-center justify-center">
          <p className="text-slate-600">
            
            Carrega um SVG para ver a pré-visualização 3D.
          </p>
        </div>
      )}

      {model.status === "ready" && model.geometry && (
        <div className="h-[500px]">
            <Canvas camera={{ position: [0, 80, 120], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[50, 80, 50]} intensity={1.2} />

            <Center>
                <mesh geometry={model.geometry}>
                <meshStandardMaterial color="#222222" />
                </mesh>
            </Center>

            <Grid args={[200, 200]} />
            <OrbitControls makeDefault />
            </Canvas>

            <div className="border-t bg-white p-4 text-sm text-gray-700">
            <p>
                Medidas aproximadas:{" "}
                <strong>{model.widthMm?.toFixed(1)} mm</strong> ×{" "}
                <strong>{model.heightMm?.toFixed(1)} mm</strong> ×{" "}
                <strong>{model.depthMm?.toFixed(1)} mm</strong>
            </p>
            </div>
        </div>
        )}

      {model.status === "error" && (
        <div className="flex h-[500px] items-center justify-center">
          <p className="text-red-600">
            Não foi possível gerar o modelo 3D.
          </p>
        </div>
      )}
    </section>
  );
}
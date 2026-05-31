"use client";

import { UploadPanel } from "@/features/extrude/components/UploadPanel";
import { SettingsPanel } from "@/features/extrude/components/SettingsPanel";
import { PreviewPanel } from "@/features/extrude/components/PreviewPanel";
import { ExportPanel } from "@/features/extrude/components/ExportPanel";
import { useExtrudeController } from "@/features/extrude/controllers/useExtrudeController";

export default function HomePage() {
  const controller = useExtrudeController();

  return (
    <main className="min-h-screen bg-white p-6 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">2D para 3D</h1>
          <p className="mt-2 text-sm text-slate-600">
            Transforma imagens simples em ficheiros STL para impressão 3D.
          </p>
        </header>

        {controller.error && (
          <div className="mb-4 rounded-xl bg-red-100 p-4 text-red-700">
            {controller.error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <UploadPanel
              fileName={controller.file?.name}
              onUpload={controller.uploadFile}
            />

            <SettingsPanel
              settings={controller.settings}
              onChange={controller.setSetting}
            />

            <ExportPanel
              canExport={controller.model.status === "ready"}
              onExport={controller.exportStl}
              onReset={controller.reset}
            />
          </div>

          <PreviewPanel model={controller.model} />
        </div>
      </div>
    </main>
  );
}
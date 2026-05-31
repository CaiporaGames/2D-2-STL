type ExportPanelProps = {
  canExport: boolean;
  onExport: () => void;
  onReset: () => void;
};

export function ExportPanel({
  canExport,
  onExport,
  onReset,
}: ExportPanelProps) {
  return (
    <section className="flex gap-3">
      <button
        disabled={!canExport}
        onClick={onExport}
        className="rounded-xl bg-black px-5 py-3 text-white disabled:bg-gray-400"
      >
        Exportar STL
      </button>

      <button
        onClick={onReset}
        className="rounded-xl border px-5 py-3"
      >
        Limpar
      </button>
    </section>
  );
}
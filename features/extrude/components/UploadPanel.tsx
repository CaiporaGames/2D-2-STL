type UploadPanelProps = {
  fileName?: string;
  onUpload: (file: File) => void;
};

export function UploadPanel({ fileName, onUpload }: UploadPanelProps) {
  return (
    <section className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold">Carregar imagem</h2>

      <input
        className="mt-4"
        type="file"
        accept=".svg,.png"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
        }}
      />

      {fileName && (
        <p className="mt-2 text-sm text-gray-600">
          Ficheiro: {fileName}
        </p>
      )}
    </section>
  );
}
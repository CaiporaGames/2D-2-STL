type UploadPanelProps = {
  fileName?: string;
  onUpload: (file: File) => void;
};

export function UploadPanel({ fileName, onUpload }: UploadPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900">
      <h2 className="text-lg font-semibold text-slate-900">Carregar imagem</h2>
      <p className="mt-2 text-sm text-slate-600">
        Usa SVG ou PNG com fundo transparente ou alto contraste (preto ou branco).
      </p>


<label
  htmlFor="file-upload"
  className="w-40 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition"
>
  Importar SVG/PNG
</label>

<input
  id="file-upload"
  type="file"
  accept=".svg,.png"
  className="hidden"
  onChange={(event) => {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
  }}
/>


      {fileName && (
        <p className="mt-2 text-sm text-slate-600">
          Ficheiro: {fileName}
        </p>
      )}
    </section>
  );
}
import type { ExtrudeSettings } from "../types/ExtrudeTypes";

type SettingsPanelProps = {
  settings: ExtrudeSettings;
  onChange: <K extends keyof ExtrudeSettings>(
    key: K,
    value: ExtrudeSettings[K]
  ) => void;
};

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <section className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold">Definições</h2>

        <Slider
            label="Largura final em mm"
            value={settings.targetWidthMm}
            min={10}
            max={200}
            step={1}
            onChange={(value) => onChange("targetWidthMm", value)}
            />
      <Slider
        label="Espessura"
        value={settings.thickness}
        min={1}
        max={20}
        step={1}
        onChange={(value) => onChange("thickness", value)}
      />

      <Slider
        label="Arredondamento"
        value={settings.bevel}
        min={0}
        max={2}
        step={0.1}
        onChange={(value) => onChange("bevel", value)}
      />

      <Slider
        label="Suavização"
        value={settings.smoothing}
        min={0}
        max={10}
        step={1}
        onChange={(value) => onChange("smoothing", value)}
      />

      <Slider
        label="Escala"
        value={settings.scale}
        min={0.2}
        max={5}
        step={0.1}
        onChange={(value) => onChange("scale", value)}
      />
    </section>
  );
}

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <label>{label}</label>
        <span>{value}</span>
      </div>

      <input
        className="w-full"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
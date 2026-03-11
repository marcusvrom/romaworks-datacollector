type ApiKeySettingsProps = {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
};

export function ApiKeySettings({ apiKey, onApiKeyChange }: ApiKeySettingsProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Google Places API Key</label>
      <input
        className="w-full rounded-lg border border-slate-300 px-4 py-2"
        type="password"
        value={apiKey}
        onChange={(event) => onApiKeyChange(event.target.value)}
        placeholder="Cole sua API key aqui"
      />
    </div>
  );
}

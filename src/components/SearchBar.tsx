type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function SearchBar({ query, onChange, onSubmit, isLoading }: SearchBarProps) {
  return (
    <div className="flex gap-3">
      <input
        className="flex-1 rounded-lg border border-slate-300 px-4 py-2"
        placeholder="Ex.: clínicas odontológicas em Paraguaçu Paulista"
        value={query}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:bg-blue-300"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Prospectando...' : 'Iniciar Prospecção'}
      </button>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { ApiKeySettings } from './components/ApiKeySettings';
import { LeadsTable } from './components/LeadsTable';
import { ProgressBar } from './components/ProgressBar';
import { SearchBar } from './components/SearchBar';
import { exportLeadsToCsv } from './services/export';
import { clearLeads, listLeads, runProspection } from './services/leadService';
import type { Lead, ProspectProgress } from './types/lead';

const STORAGE_KEY = 'romaworks.googleApiKey';

export default function App() {
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [progress, setProgress] = useState<ProspectProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem(STORAGE_KEY);
    if (savedApiKey) setApiKey(savedApiKey);

    void refreshLeads();
  }, []);

  const totalLeads = useMemo(() => leads.length, [leads]);

  async function refreshLeads() {
    const rows = await listLeads();
    setLeads(rows);
  }

  async function handleStartProspection() {
    if (!query.trim() || !apiKey.trim()) return;

    localStorage.setItem(STORAGE_KEY, apiKey);
    setIsLoading(true);
    setProgress({ total: 0, processed: 0, message: 'Iniciando coleta...' });

    try {
      await runProspection(query, apiKey, setProgress);
      await refreshLeads();
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  }

  async function handleClear() {
    await clearLeads();
    await refreshLeads();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">RomaWorks - Prospecção B2B</h1>
      <ApiKeySettings apiKey={apiKey} onApiKeyChange={setApiKey} />
      <SearchBar query={query} onChange={setQuery} onSubmit={handleStartProspection} isLoading={isLoading} />
      <ProgressBar progress={progress} />
      <p className="text-sm text-slate-500">Total de leads no banco: {totalLeads}</p>
      <LeadsTable leads={leads} onExportCsv={() => exportLeadsToCsv(leads)} onClear={handleClear} />
    </main>
  );
}

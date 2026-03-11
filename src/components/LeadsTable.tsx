import { MessageCircle } from 'lucide-react';
import type { Lead } from '../types/lead';

type LeadsTableProps = {
  leads: Lead[];
  onExportCsv: () => void;
  onClear: () => void;
};

export function LeadsTable({ leads, onExportCsv, onClear }: LeadsTableProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex justify-end gap-2">
        <button className="rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={onExportCsv}>
          Exportar para CSV
        </button>
        <button className="rounded-md bg-red-600 px-3 py-2 text-sm text-white" onClick={onClear}>
          Limpar Banco
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-2">Nome</th>
              <th className="p-2">Endereço</th>
              <th className="p-2">WhatsApp</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">CNPJ</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b last:border-b-0">
                <td className="p-2">{lead.nome}</td>
                <td className="p-2">{lead.endereco}</td>
                <td className="p-2">
                  {lead.isWhatsapp ? <MessageCircle className="h-4 w-4 text-green-600" /> : '—'}
                </td>
                <td className="p-2">{lead.email ?? '—'}</td>
                <td className="p-2">{lead.cnpj ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { Lead } from '../types/lead';

export function exportLeadsToCsv(leads: Lead[]) {
  const header = ['Nome', 'Endereço', 'Telefone', 'WhatsApp', 'E-mail', 'CNPJ'];
  const lines = leads.map((lead) => [
    lead.nome,
    lead.endereco,
    lead.telefone ?? '',
    lead.isWhatsapp ? 'Sim' : 'Não',
    lead.email ?? '',
    lead.cnpj ?? ''
  ]);

  const csvContent = [header, ...lines]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';'))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `leads-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

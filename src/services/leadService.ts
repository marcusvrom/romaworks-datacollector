import { prisma } from '../lib/prisma';
import { extractAndEnrichLead } from './enrichment';
import type { Lead, ProspectProgress } from '../types/lead';

type ProgressCallback = (progress: ProspectProgress) => void;

export async function listLeads(): Promise<Lead[]> {
  const leads = await prisma.lead.findMany({ orderBy: { dataCriacao: 'desc' } });
  return leads.map((lead) => ({ ...lead, dataCriacao: lead.dataCriacao.toISOString() }));
}

export async function clearLeads(): Promise<void> {
  await prisma.lead.deleteMany();
}

export async function runProspection(query: string, apiKey: string, onProgress?: ProgressCallback): Promise<Lead[]> {
  const enrichedLeads = await extractAndEnrichLead(query, apiKey);
  const total = enrichedLeads.length;
  const savedLeads: Lead[] = [];

  for (let index = 0; index < total; index++) {
    const lead = enrichedLeads[index]!;
    const created = await prisma.lead.create({ data: lead });
    savedLeads.push({ ...created, dataCriacao: created.dataCriacao.toISOString() });

    onProgress?.({
      total,
      processed: index + 1,
      message: `Processando ${index + 1}/${total}: ${created.nome}`
    });
  }

  return savedLeads;
}

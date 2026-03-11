export type Lead = {
  id: number;
  nome: string;
  endereco: string;
  telefone?: string | null;
  isWhatsapp: boolean;
  email?: string | null;
  cnpj?: string | null;
  termoBusca: string;
  dataCriacao: string;
};

export type ProspectProgress = {
  total: number;
  processed: number;
  message: string;
};

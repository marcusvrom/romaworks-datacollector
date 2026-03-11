import axios from 'axios';

const EMAIL_BLOCKLIST = ['contabilidade', 'contador', 'assessoria', 'escritorio'];

type GoogleTextSearchResult = {
  place_id: string;
};

type GoogleDetailsResult = {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
};

type CnpjApiResult = {
  cnpj?: string;
  email?: string;
};

export function isBrazilianWhatsapp(phone?: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return /^(55)?\d{2}9\d{8}$/.test(digits);
}

export function filterBusinessEmail(email?: string): string | null {
  if (!email) return null;
  const normalized = email.toLowerCase();
  return EMAIL_BLOCKLIST.some((term) => normalized.includes(term)) ? null : email;
}

async function searchGooglePlaces(query: string, apiKey: string): Promise<GoogleTextSearchResult[]> {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
    params: { query, key: apiKey }
  });

  return data.results ?? [];
}

async function getGooglePlaceDetails(placeId: string, apiKey: string): Promise<GoogleDetailsResult | null> {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number',
      key: apiKey
    }
  });

  return data.result ?? null;
}

async function searchCnpjByName(name: string): Promise<CnpjApiResult> {
  const { data } = await axios.get('https://minhareceita.org/', { params: { q: name } });
  const hit = Array.isArray(data) ? data[0] : data;

  if (!hit?.cnpj) {
    return { cnpj: undefined, email: undefined };
  }

  try {
    const { data: brasilApiData } = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${hit.cnpj.replace(/\D/g, '')}`);
    return {
      cnpj: brasilApiData.cnpj ?? hit.cnpj,
      email: filterBusinessEmail(brasilApiData.email ?? hit.email)
    };
  } catch {
    return { cnpj: hit.cnpj, email: filterBusinessEmail(hit.email) };
  }
}

export async function extractAndEnrichLead(query: string, apiKey: string) {
  const places = await searchGooglePlaces(query, apiKey);

  const enrichedLeads = await Promise.all(
    places.map(async (place) => {
      const details = await getGooglePlaceDetails(place.place_id, apiKey);
      if (!details) return null;

      const cnpjData = await searchCnpjByName(details.name);
      return {
        nome: details.name,
        endereco: details.formatted_address,
        telefone: details.formatted_phone_number ?? null,
        isWhatsapp: isBrazilianWhatsapp(details.formatted_phone_number),
        email: cnpjData.email ?? null,
        cnpj: cnpjData.cnpj ?? null,
        termoBusca: query
      };
    })
  );

  return enrichedLeads.filter(Boolean);
}

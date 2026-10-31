import { ShippingOption, ShippingAddressInfo } from '../types';

export const CORREIOS_ORIGIN = {
  agencyName: 'Agência Correios São Vicente',
  address: 'Av. Capitão Luiz Hourneaux, 748',
  neighborhood: 'Jardim Paraíso',
  city: 'São Vicente',
  state: 'SP',
  cep: '11370-971',
  fullAddress: 'Av. Capitão Luiz Hourneaux, 748 - Jardim Paraíso, São Vicente - SP, CEP 11370-971',
};

interface StateRate {
  uf: string;
  region: string;
  pacBase: number;
  pacDays: string;
  sedexBase: number;
  sedexDays: string;
}

// Correios standard pricing & delivery time matrix by state/region originating from São Vicente - SP (11370-971)
const STATE_RATES: Record<string, StateRate> = {
  SP: { uf: 'SP', region: 'Sudeste', pacBase: 19.9, pacDays: '3 a 5 dias úteis', sedexBase: 26.9, sedexDays: '1 a 2 dias úteis' },
  RJ: { uf: 'RJ', region: 'Sudeste', pacBase: 22.9, pacDays: '4 a 6 dias úteis', sedexBase: 34.9, sedexDays: '1 a 3 dias úteis' },
  MG: { uf: 'MG', region: 'Sudeste', pacBase: 23.9, pacDays: '4 a 6 dias úteis', sedexBase: 36.9, sedexDays: '2 a 3 dias úteis' },
  ES: { uf: 'ES', region: 'Sudeste', pacBase: 24.9, pacDays: '5 a 7 dias úteis', sedexBase: 37.9, sedexDays: '2 a 3 dias úteis' },
  PR: { uf: 'PR', region: 'Sul', pacBase: 23.9, pacDays: '4 a 7 dias úteis', sedexBase: 38.9, sedexDays: '2 a 3 dias úteis' },
  SC: { uf: 'SC', region: 'Sul', pacBase: 24.9, pacDays: '5 a 7 dias úteis', sedexBase: 39.9, sedexDays: '2 a 3 dias úteis' },
  RS: { uf: 'RS', region: 'Sul', pacBase: 25.9, pacDays: '5 a 8 dias úteis', sedexBase: 42.9, sedexDays: '2 a 3 dias úteis' },
  DF: { uf: 'DF', region: 'Centro-Oeste', pacBase: 25.9, pacDays: '5 a 8 dias úteis', sedexBase: 43.9, sedexDays: '2 a 3 dias úteis' },
  GO: { uf: 'GO', region: 'Centro-Oeste', pacBase: 26.9, pacDays: '5 a 8 dias úteis', sedexBase: 45.9, sedexDays: '2 a 4 dias úteis' },
  MS: { uf: 'MS', region: 'Centro-Oeste', pacBase: 28.9, pacDays: '5 a 9 dias úteis', sedexBase: 49.9, sedexDays: '2 a 4 dias úteis' },
  MT: { uf: 'MT', region: 'Centro-Oeste', pacBase: 30.9, pacDays: '6 a 10 dias úteis', sedexBase: 53.9, sedexDays: '3 a 5 dias úteis' },
  BA: { uf: 'BA', region: 'Nordeste', pacBase: 29.5, pacDays: '6 a 9 dias úteis', sedexBase: 51.9, sedexDays: '2 a 4 dias úteis' },
  PE: { uf: 'PE', region: 'Nordeste', pacBase: 30.9, pacDays: '6 a 10 dias úteis', sedexBase: 55.9, sedexDays: '2 a 4 dias úteis' },
  CE: { uf: 'CE', region: 'Nordeste', pacBase: 33.9, pacDays: '7 a 11 dias úteis', sedexBase: 61.9, sedexDays: '3 a 5 dias úteis' },
  RN: { uf: 'RN', region: 'Nordeste', pacBase: 32.9, pacDays: '7 a 11 dias úteis', sedexBase: 59.9, sedexDays: '3 a 5 dias úteis' },
  PB: { uf: 'PB', region: 'Nordeste', pacBase: 32.9, pacDays: '7 a 10 dias úteis', sedexBase: 58.9, sedexDays: '3 a 5 dias úteis' },
  AL: { uf: 'AL', region: 'Nordeste', pacBase: 31.5, pacDays: '6 a 10 dias úteis', sedexBase: 57.9, sedexDays: '2 a 4 dias úteis' },
  SE: { uf: 'SE', region: 'Nordeste', pacBase: 30.9, pacDays: '6 a 9 dias úteis', sedexBase: 53.9, sedexDays: '2 a 4 dias úteis' },
  PI: { uf: 'PI', region: 'Nordeste', pacBase: 34.9, pacDays: '7 a 11 dias úteis', sedexBase: 63.9, sedexDays: '3 a 5 dias úteis' },
  MA: { uf: 'MA', region: 'Nordeste', pacBase: 35.9, pacDays: '8 a 12 dias úteis', sedexBase: 65.9, sedexDays: '3 a 5 dias úteis' },
  PA: { uf: 'PA', region: 'Norte', pacBase: 37.9, pacDays: '8 a 13 dias úteis', sedexBase: 71.9, sedexDays: '3 a 5 dias úteis' },
  TO: { uf: 'TO', region: 'Norte', pacBase: 32.9, pacDays: '6 a 10 dias úteis', sedexBase: 59.9, sedexDays: '3 a 5 dias úteis' },
  RO: { uf: 'RO', region: 'Norte', pacBase: 37.9, pacDays: '8 a 13 dias úteis', sedexBase: 69.9, sedexDays: '3 a 5 dias úteis' },
  AM: { uf: 'AM', region: 'Norte', pacBase: 40.9, pacDays: '9 a 15 dias úteis', sedexBase: 78.9, sedexDays: '3 a 6 dias úteis' },
  AC: { uf: 'AC', region: 'Norte', pacBase: 43.9, pacDays: '10 a 16 dias úteis', sedexBase: 82.9, sedexDays: '4 a 6 dias úteis' },
  AP: { uf: 'AP', region: 'Norte', pacBase: 40.9, pacDays: '9 a 14 dias úteis', sedexBase: 76.9, sedexDays: '3 a 6 dias úteis' },
  RR: { uf: 'RR', region: 'Norte', pacBase: 43.9, pacDays: '10 a 16 dias úteis', sedexBase: 82.9, sedexDays: '4 a 6 dias úteis' },
};

/**
 * Fallback UF lookup by CEP prefix
 */
export function getUfByCepPrefix(cleanCep: string): string {
  const prefix2 = parseInt(cleanCep.substring(0, 2), 10);
  if (isNaN(prefix2)) return 'SP';

  if (prefix2 >= 1 && prefix2 <= 19) return 'SP';
  if (prefix2 >= 20 && prefix2 <= 28) return 'RJ';
  if (prefix2 === 29) return 'ES';
  if (prefix2 >= 30 && prefix2 <= 39) return 'MG';
  if (prefix2 >= 40 && prefix2 <= 48) return 'BA';
  if (prefix2 === 49) return 'SE';
  if (prefix2 >= 50 && prefix2 <= 56) return 'PE';
  if (prefix2 === 57) return 'AL';
  if (prefix2 === 58) return 'PB';
  if (prefix2 === 59) return 'RN';
  if (prefix2 >= 60 && prefix2 <= 63) return 'CE';
  if (prefix2 === 64) return 'PI';
  if (prefix2 === 65) return 'MA';
  if (prefix2 >= 66 && prefix2 <= 68) return 'PA';
  if (prefix2 === 68) return 'AC';
  if (prefix2 === 69) return 'AM';
  if (prefix2 >= 70 && prefix2 <= 72) return 'DF';
  if (prefix2 >= 73 && prefix2 <= 76) return 'GO';
  if (prefix2 === 76) return 'RO';
  if (prefix2 === 77) return 'TO';
  if (prefix2 === 78) return 'MT';
  if (prefix2 === 79) return 'MS';
  if (prefix2 >= 80 && prefix2 <= 87) return 'PR';
  if (prefix2 >= 88 && prefix2 <= 89) return 'SC';
  if (prefix2 >= 90 && prefix2 <= 99) return 'RS';

  return 'SP';
}

export interface CorreiosCalculationResult {
  cep: string;
  destination: string;
  address?: ShippingAddressInfo;
  origin: typeof CORREIOS_ORIGIN;
  distanceCategory: 'local' | 'capital_sp' | 'interior_sp' | 'nacional';
  options: ShippingOption[];
}

/**
 * Calculates Correios rates (PAC and SEDEX) originating from:
 * Av. Capitão Luiz Hourneaux, 748 - Jardim Paraiso, São Vicente - SP, CEP 11370-971
 * to any destination CEP in Brazil.
 */
export async function calculateCorreios(
  rawCep: string,
  isFreeShipping: boolean
): Promise<CorreiosCalculationResult> {
  const cleanCep = rawCep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos numéricos.');
  }

  let addressInfo: ShippingAddressInfo = {
    cep: `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`,
  };
  let uf = getUfByCepPrefix(cleanCep);
  let cityName = '';
  let neighborhoodName = '';
  let streetName = '';

  // Fetch live address details from ViaCEP API with a reliable abort timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (!data.erro) {
        uf = data.uf || uf;
        cityName = data.localidade || '';
        neighborhoodName = data.bairro || '';
        streetName = data.logradouro || '';
        addressInfo = {
          cep: data.cep || addressInfo.cep,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          uf: data.uf || uf,
        };
      }
    }
  } catch {
    // ViaCEP fallback - calculate using postal zone ranges
  }

  const rateConfig = STATE_RATES[uf] || STATE_RATES['SP'];
  const destinationText = cityName
    ? `${cityName} - ${uf}`
    : `Estado de ${uf} (CEP ${cleanCep.substring(0, 5)}-${cleanCep.substring(5)})`;

  // Determine postal zone relative to São Vicente (CEP 11370-971)
  const cepPrefix2 = parseInt(cleanCep.substring(0, 2), 10);
  const cepPrefix5 = parseInt(cleanCep.substring(0, 5), 10);

  let pacPrice = rateConfig.pacBase;
  let pacDays = rateConfig.pacDays;
  let sedexPrice = rateConfig.sedexBase;
  let sedexDays = rateConfig.sedexDays;
  let distanceCategory: 'local' | 'capital_sp' | 'interior_sp' | 'nacional' = 'nacional';

  if (uf === 'SP') {
    // 1. Same Postal Zone: Baixada Santista (11000 to 11999) - Local Delivery
    if (cepPrefix2 === 11) {
      distanceCategory = 'local';
      // Same city (São Vicente 11300-11399) or adjacent Santos/Praia Grande/Cubatão
      if (cepPrefix5 >= 11300 && cepPrefix5 <= 11399) {
        // Direct local dispatch from agência São Vicente
        pacPrice = 12.9;
        pacDays = '1 a 2 dias úteis';
        sedexPrice = 15.9;
        sedexDays = '1 dia útil (Entrega Rápida Local)';
      } else {
        // Baixada Santista / Litoral
        pacPrice = 14.5;
        pacDays = '1 a 3 dias úteis';
        sedexPrice = 18.9;
        sedexDays = '1 dia útil';
      }
    }
    // 2. Grande São Paulo & Capital (01000 to 09999)
    else if (cleanCep.startsWith('0')) {
      distanceCategory = 'capital_sp';
      pacPrice = 16.9;
      pacDays = '2 a 3 dias úteis';
      sedexPrice = 22.9;
      sedexDays = '1 a 2 dias úteis';
    }
    // 3. Interior de São Paulo (12000 to 19999)
    else {
      distanceCategory = 'interior_sp';
      pacPrice = 19.9;
      pacDays = '3 a 5 dias úteis';
      sedexPrice = 26.9;
      sedexDays = '1 a 2 dias úteis';
    }
  }

  // Options creation (PAC and SEDEX)
  const options: ShippingOption[] = [];

  if (isFreeShipping) {
    // Promotional rule: 2 or more jerseys = PAC 100% Free!
    options.push({
      id: 'pac',
      name: 'PAC Correios (Econômico)',
      service: 'PAC dos Correios',
      price: 0,
      originalPrice: pacPrice,
      deadline: pacDays,
      isFree: true,
      description: `Despachado da Agência Correios São Vicente (CEP 11370-971) até ${destinationText}. Envio com rastreio oficial.`,
    });

    // SEDEX has an express upgrade discount
    const sedexUpgrade =
      distanceCategory === 'local'
        ? 7.9
        : distanceCategory === 'capital_sp'
        ? 9.9
        : Math.max(9.9, Math.round((sedexPrice - pacPrice + 4) * 10) / 10);

    options.push({
      id: 'sedex',
      name: 'SEDEX Correios (Expresso Prioritário)',
      service: 'SEDEX dos Correios',
      price: sedexUpgrade,
      originalPrice: sedexPrice,
      deadline: sedexDays,
      isFree: false,
      description: `Despachado com prioridade máxima da Agência São Vicente (11370-971) para ${destinationText}.`,
    });
  } else {
    // Standard rates for single item
    options.push({
      id: 'pac',
      name: 'PAC Correios (Econômico)',
      service: 'PAC dos Correios',
      price: pacPrice,
      deadline: pacDays,
      isFree: false,
      description: `Origem: Agência Correios São Vicente (11370-971) · Destino: ${destinationText} · Rastreamento 100% seguro.`,
    });

    options.push({
      id: 'sedex',
      name: 'SEDEX Correios (Expresso Prioritário)',
      service: 'SEDEX dos Correios',
      price: sedexPrice,
      deadline: sedexDays,
      isFree: false,
      description: `Origem: Agência Correios São Vicente (11370-971) · Destino: ${destinationText} · Prioridade máxima na triagem.`,
    });
  }

  return {
    cep: cleanCep,
    destination: destinationText,
    address: addressInfo,
    origin: CORREIOS_ORIGIN,
    distanceCategory,
    options,
  };
}

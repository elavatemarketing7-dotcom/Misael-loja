import { ShippingOption, ShippingAddressInfo } from '../types';

interface StateRate {
  uf: string;
  region: string;
  pacBase: number;
  pacDays: string;
  sedexBase: number;
  sedexDays: string;
}

// Correios standard pricing & delivery time matrix by state/region
const STATE_RATES: Record<string, StateRate> = {
  SP: { uf: 'SP', region: 'Sudeste', pacBase: 18.9, pacDays: '3 a 5 dias úteis', sedexBase: 24.9, sedexDays: '1 a 2 dias úteis' },
  RJ: { uf: 'RJ', region: 'Sudeste', pacBase: 21.9, pacDays: '4 a 6 dias úteis', sedexBase: 34.9, sedexDays: '1 a 3 dias úteis' },
  MG: { uf: 'MG', region: 'Sudeste', pacBase: 22.9, pacDays: '4 a 6 dias úteis', sedexBase: 35.9, sedexDays: '2 a 3 dias úteis' },
  ES: { uf: 'ES', region: 'Sudeste', pacBase: 23.5, pacDays: '5 a 7 dias úteis', sedexBase: 36.9, sedexDays: '2 a 3 dias úteis' },
  PR: { uf: 'PR', region: 'Sul', pacBase: 22.9, pacDays: '4 a 7 dias úteis', sedexBase: 37.9, sedexDays: '2 a 3 dias úteis' },
  SC: { uf: 'SC', region: 'Sul', pacBase: 23.9, pacDays: '5 a 7 dias úteis', sedexBase: 38.9, sedexDays: '2 a 3 dias úteis' },
  RS: { uf: 'RS', region: 'Sul', pacBase: 24.9, pacDays: '5 a 8 dias úteis', sedexBase: 41.9, sedexDays: '2 a 3 dias úteis' },
  DF: { uf: 'DF', region: 'Centro-Oeste', pacBase: 24.9, pacDays: '5 a 8 dias úteis', sedexBase: 42.9, sedexDays: '2 a 3 dias úteis' },
  GO: { uf: 'GO', region: 'Centro-Oeste', pacBase: 25.9, pacDays: '5 a 8 dias úteis', sedexBase: 44.9, sedexDays: '2 a 4 dias úteis' },
  MS: { uf: 'MS', region: 'Centro-Oeste', pacBase: 27.9, pacDays: '5 a 9 dias úteis', sedexBase: 48.9, sedexDays: '2 a 4 dias úteis' },
  MT: { uf: 'MT', region: 'Centro-Oeste', pacBase: 29.9, pacDays: '6 a 10 dias úteis', sedexBase: 52.9, sedexDays: '3 a 5 dias úteis' },
  BA: { uf: 'BA', region: 'Nordeste', pacBase: 28.5, pacDays: '6 a 9 dias úteis', sedexBase: 49.9, sedexDays: '2 a 4 dias úteis' },
  PE: { uf: 'PE', region: 'Nordeste', pacBase: 29.9, pacDays: '6 a 10 dias úteis', sedexBase: 54.9, sedexDays: '2 a 4 dias úteis' },
  CE: { uf: 'CE', region: 'Nordeste', pacBase: 32.9, pacDays: '7 a 11 dias úteis', sedexBase: 59.9, sedexDays: '3 a 5 dias úteis' },
  RN: { uf: 'RN', region: 'Nordeste', pacBase: 31.9, pacDays: '7 a 11 dias úteis', sedexBase: 58.9, sedexDays: '3 a 5 dias úteis' },
  PB: { uf: 'PB', region: 'Nordeste', pacBase: 31.9, pacDays: '7 a 10 dias úteis', sedexBase: 57.9, sedexDays: '3 a 5 dias úteis' },
  AL: { uf: 'AL', region: 'Nordeste', pacBase: 30.5, pacDays: '6 a 10 dias úteis', sedexBase: 56.9, sedexDays: '2 a 4 dias úteis' },
  SE: { uf: 'SE', region: 'Nordeste', pacBase: 29.9, pacDays: '6 a 9 dias úteis', sedexBase: 52.9, sedexDays: '2 a 4 dias úteis' },
  PI: { uf: 'PI', region: 'Nordeste', pacBase: 33.9, pacDays: '7 a 11 dias úteis', sedexBase: 62.9, sedexDays: '3 a 5 dias úteis' },
  MA: { uf: 'MA', region: 'Nordeste', pacBase: 34.9, pacDays: '8 a 12 dias úteis', sedexBase: 64.9, sedexDays: '3 a 5 dias úteis' },
  PA: { uf: 'PA', region: 'Norte', pacBase: 36.9, pacDays: '8 a 13 dias úteis', sedexBase: 69.9, sedexDays: '3 a 5 dias úteis' },
  TO: { uf: 'TO', region: 'Norte', pacBase: 31.9, pacDays: '6 a 10 dias úteis', sedexBase: 58.9, sedexDays: '3 a 5 dias úteis' },
  RO: { uf: 'RO', region: 'Norte', pacBase: 36.9, pacDays: '8 a 13 dias úteis', sedexBase: 68.9, sedexDays: '3 a 5 dias úteis' },
  AM: { uf: 'AM', region: 'Norte', pacBase: 39.9, pacDays: '9 a 15 dias úteis', sedexBase: 76.9, sedexDays: '3 a 6 dias úteis' },
  AC: { uf: 'AC', region: 'Norte', pacBase: 42.9, pacDays: '10 a 16 dias úteis', sedexBase: 79.9, sedexDays: '4 a 6 dias úteis' },
  AP: { uf: 'AP', region: 'Norte', pacBase: 39.9, pacDays: '9 a 14 dias úteis', sedexBase: 74.9, sedexDays: '3 a 6 dias úteis' },
  RR: { uf: 'RR', region: 'Norte', pacBase: 42.9, pacDays: '10 a 16 dias úteis', sedexBase: 79.9, sedexDays: '4 a 6 dias úteis' },
};

/**
 * Fallback UF lookup by CEP range (primeiros 2 ou 3 dígitos)
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
  options: ShippingOption[];
}

/**
 * Calculates Correios rates (PAC and SEDEX) given a CEP and whether free shipping applies.
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

  // Try fetching live address info from ViaCEP with a fast timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (!data.erro) {
        uf = data.uf || uf;
        cityName = data.localidade || '';
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
    // ViaCEP fallback - keep local calculation
  }

  const rateConfig = STATE_RATES[uf] || STATE_RATES['SP'];
  const destinationText = cityName ? `${cityName} - ${uf}` : `Estado de ${uf}`;

  // Capital / Grande SP discount if first digits are 01xxx-09xxx
  const isCapitalSP = cleanCep.startsWith('0');
  const pacPrice = isCapitalSP ? 14.9 : rateConfig.pacBase;
  const sedexPrice = isCapitalSP ? 21.9 : rateConfig.sedexBase;

  // Options creation
  const options: ShippingOption[] = [];

  if (isFreeShipping) {
    // PAC is 100% Free on combos
    options.push({
      id: 'pac',
      name: 'PAC Correios (Econômico)',
      service: 'PAC dos Correios',
      price: 0,
      originalPrice: pacPrice,
      deadline: isCapitalSP ? '2 a 4 dias úteis' : rateConfig.pacDays,
      isFree: true,
      description: 'Envio padrão dos Correios com código de rastreamento oficial.',
    });

    // SEDEX has express upgrade rate
    const sedexUpgradePrice = Math.max(9.9, Math.round((sedexPrice - pacPrice + 5) * 10) / 10);
    options.push({
      id: 'sedex',
      name: 'SEDEX Correios (Expresso)',
      service: 'SEDEX dos Correios',
      price: sedexUpgradePrice,
      originalPrice: sedexPrice,
      deadline: isCapitalSP ? '1 a 2 dias úteis' : rateConfig.sedexDays,
      isFree: false,
      description: 'Entrega expressa prioritária dos Correios com seguro total.',
    });
  } else {
    // Normal rates
    options.push({
      id: 'pac',
      name: 'PAC Correios (Econômico)',
      service: 'PAC dos Correios',
      price: pacPrice,
      deadline: isCapitalSP ? '2 a 4 dias úteis' : rateConfig.pacDays,
      isFree: false,
      description: 'Envio padrão dos Correios com código de rastreamento oficial.',
    });

    options.push({
      id: 'sedex',
      name: 'SEDEX Correios (Expresso)',
      service: 'SEDEX dos Correios',
      price: sedexPrice,
      deadline: isCapitalSP ? '1 a 2 dias úteis' : rateConfig.sedexDays,
      isFree: false,
      description: 'Entrega ultra rápida dos Correios com prioridade máxima na triagem.',
    });
  }

  return {
    cep: cleanCep,
    destination: destinationText,
    address: addressInfo,
    options,
  };
}

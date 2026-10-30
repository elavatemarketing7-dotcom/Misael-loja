/**
 * Installment calculator helper for MN Store
 * Rule: Até 5x SEM JUROS. A partir de 5x (6x a 12x), incide juros da maquininha.
 */

export interface InstallmentOption {
  number: number;
  hasInterest: boolean;
  installmentValue: number;
  totalValue: number;
  label: string;
}

// Taxa padrão da maquininha para parcelamento de 6x a 12x (~2.29% a.m. composto)
const MONTHLY_INTEREST_RATE = 0.0229;

export function calculateInstallments(amount: number): InstallmentOption[] {
  const options: InstallmentOption[] = [];

  for (let n = 1; n <= 12; n++) {
    if (n <= 5) {
      // 1x a 5x SEM JUROS
      const installmentValue = amount / n;
      options.push({
        number: n,
        hasInterest: false,
        installmentValue,
        totalValue: amount,
        label: `${n}x de R$ ${installmentValue.toFixed(2)} sem juros`
      });
    } else {
      // 6x a 12x COM JUROS DA MAQUININHA (coeficiente Price / juros simples ponderado da maquininha)
      // Usando fator padrão de maquininhas de cartão (como PagBank / Stone / Rede para 6 a 12x)
      // Exemplo: 6x (~10.5%), 12x (~18.8%)
      const interestFactor = 1 + (n * MONTHLY_INTEREST_RATE);
      const totalWithInterest = amount * interestFactor;
      const installmentValue = totalWithInterest / n;

      options.push({
        number: n,
        hasInterest: true,
        installmentValue,
        totalValue: totalWithInterest,
        label: `${n}x de R$ ${installmentValue.toFixed(2)} (com juros da maquininha)`
      });
    }
  }

  return options;
}

export function getMaxInterestFreeInstallment(amount: number) {
  const installment = amount / 5;
  return {
    times: 5,
    installmentValue: installment,
    label: `5x de R$ ${installment.toFixed(2)} sem juros`
  };
}

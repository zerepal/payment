
export interface Transaction {
  id: string;
  description: string;
  date: string; // Entry timestamp
  consumptionDate: string; // Date of the actual expense
  localAmount: number;
  currencyCode: string;
  exchangeRateToUSD: number; // How many local units per 1 USD (e.g. 900 CLP)
  usdAmount: number; // Final USD amount including commission
  homeExchangeRate: number; // How many home units per 1 USD
  homeAmount: number; // Final Home amount including commission
  bankCommission: number; // Percentage applied at time of transaction
}

export interface UserSettings {
  defaultCurrencyCode: string;
  defaultLocalToUSDRate: number;
  homeCurrencyName: string;
  homeCurrencySymbol: string;
  defaultUSDToHomeRate: number;
  bankCommission: number; // Percentage (e.g., 3.5 for 3.5%)
}

export interface SummaryStats {
  totalUSD: number;
  totalHome: number;
  transactionCount: number;
}

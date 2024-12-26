export interface StockInterface {
  id?: string;
  addedAs?: string;
  name?: string;
  isin?: string;
  legalForm?: string;
  hasEuropeanPassport?: boolean;
  launchDate?: string;
  category?: string;
  fundSize?: number;
  manager?: string;
  annualManagementCost?: number;
  ongoingCost?: number;
  oneMonthReturn?: number;
  threeMonthReturn?: number;
  sixMonthReturn?: number;
  oneYearReturn?: number;
  threeYearAnnualReturn?: number;
  fiveYearAnnualReturn?: number;
  tenYearAnnualReturn?: number;
  risk?: number;
  volatility?: number;
  customRating?: string;
  opinion?: string;
  sectorWeights?: SectorWeight[];
  countryWeights?: CountryWeight[];
  currencyWeights?: CurrencyWeight[];
  topHoldings?: TopHolding[];
  createdAt?: string;
  updatedAt?: string;
  etf?: boolean;
  distributor?: string;
  favourite?: boolean;
}

export interface SectorWeight {
  id?: string;
  name?: string;
  percent?: number;
}
export interface CountryWeight {
  id?: string;
  name?: string;
  percent?: number;
}
export interface CurrencyWeight {
  id?: string;
  name?: string;
  percent?: number;
}
export interface TopHolding {
  id?: string;
  name?: string;
  percent?: number;
}















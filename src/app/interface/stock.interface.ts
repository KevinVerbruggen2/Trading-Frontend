export interface StockInterface {
  id?: number;
  name?: string;
  isin?: string;
  sector?: string;
  specificDomains?: string;
  fiveYearProfit?: number;
  oneYearProfit?: number;
  yearlyCost?: number;
  customRating?: number;
  risk?: number;
  volatility?: number;
  opinion?: string;
  specificRegions?: SpecificRegionInterface[];
  priceTimestamps?: PriceTimestampInterface[];
}

export interface SpecificRegionInterface {
  id?: number;
  name?: string;
  // Add other properties from SpecificRegion if needed
}

export interface PriceTimestampInterface {
  id?: number;
  timestamp?: Date;
  price?: number;
  // Add other properties from PriceTimestamp if needed
}

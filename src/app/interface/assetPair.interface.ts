export interface AssetPair {
  id: number;
  altName: string;
  wsName: string;
  base: string;
  quote: string;
  costDecimals: number;
  pairDecimals: number;
  lotDecimals: number;
  lotMultiplier: number;
  orderMin: number;
  costMin: number;
  tickSize: number;
  status: string;
  favourite: boolean;
  activelyMonitor: boolean;
  monitorInterval: number;
}

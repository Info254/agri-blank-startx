
export interface AmisKePriceData {
  id: string;
  commodity: string;
  market: string;
  price: number;
  unit: string;
  date: string;
  county: string;
}

export interface AmisKeMarket {
  id: string;
  name: string;
  county: string;
  type: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SalesData {
  date: string;
  product: string;
  quantity: number;
  revenue: number;
}

export interface TimeSeriesPoint {
  x: number; // Days since first date
  y: number; // Revenue
  date: string;
  originalRevenue: number;
}

export interface LinearRegressionModel {
  slope: number;
  intercept: number;
  rSquared: number;
  predictions: number[];
  forecasts: TimeSeriesPoint[];
}

export interface ProcessedData {
  originalData: SalesData[];
  cleanedData: SalesData[];
  nullsRemoved: number;
  timeSeriesData: TimeSeriesPoint[];
  totalRevenue: number;
  averageRevenue: number;
  productCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  regression?: LinearRegressionModel;
}
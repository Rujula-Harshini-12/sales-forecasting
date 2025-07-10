import { SalesData, ProcessedData, TimeSeriesPoint, LinearRegressionModel } from '../types/sales';

export function preprocessData(rawData: SalesData[]): ProcessedData {
  // Remove rows with missing or invalid data
  const cleanedData = rawData.filter(row => 
    row.date && 
    row.product && 
    !isNaN(row.quantity) && 
    !isNaN(row.revenue) &&
    row.quantity >= 0 &&
    row.revenue >= 0 &&
    !isNaN(Date.parse(row.date))
  );

  const nullsRemoved = rawData.length - cleanedData.length;

  // Sort by date
  cleanedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate revenue by date
  const dailyRevenue = new Map<string, number>();
  cleanedData.forEach(row => {
    const date = row.date;
    const currentRevenue = dailyRevenue.get(date) || 0;
    dailyRevenue.set(date, currentRevenue + row.revenue);
  });

  // Convert to time series format
  const dates = Array.from(dailyRevenue.keys()).sort();
  const firstDate = new Date(dates[0]);
  
  const timeSeriesData: TimeSeriesPoint[] = dates.map(date => {
    const currentDate = new Date(date);
    const daysSinceStart = Math.floor((currentDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    const revenue = dailyRevenue.get(date) || 0;
    
    return {
      x: daysSinceStart,
      y: revenue,
      date: date,
      originalRevenue: revenue
    };
  });

  // Calculate summary statistics
  const totalRevenue = cleanedData.reduce((sum, row) => sum + row.revenue, 0);
  const averageRevenue = totalRevenue / cleanedData.length;
  const productCount = new Set(cleanedData.map(row => row.product)).size;

  return {
    originalData: rawData,
    cleanedData,
    nullsRemoved,
    timeSeriesData,
    totalRevenue,
    averageRevenue,
    productCount,
    dateRange: {
      start: dates[0],
      end: dates[dates.length - 1]
    }
  };
}

export function trainLinearRegression(data: TimeSeriesPoint[]): LinearRegressionModel {
  const n = data.length;
  
  if (n < 2) {
    throw new Error('Insufficient data points for regression analysis');
  }

  // Calculate means
  const xMean = data.reduce((sum, point) => sum + point.x, 0) / n;
  const yMean = data.reduce((sum, point) => sum + point.y, 0) / n;

  // Calculate slope and intercept using least squares method
  let numerator = 0;
  let denominator = 0;

  for (const point of data) {
    const xDiff = point.x - xMean;
    const yDiff = point.y - yMean;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Generate predictions for existing data
  const predictions = data.map(point => slope * point.x + intercept);

  // Calculate R-squared
  const totalSumSquares = data.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0);
  const residualSumSquares = data.reduce((sum, point, index) => 
    sum + Math.pow(point.y - predictions[index], 2), 0);
  
  const rSquared = totalSumSquares === 0 ? 1 : Math.max(0, 1 - (residualSumSquares / totalSumSquares));

  // Generate 30-day forecast
  const lastDay = Math.max(...data.map(point => point.x));
  const lastDate = new Date(data[data.length - 1].date);
  
  const forecasts: TimeSeriesPoint[] = [];
  for (let i = 1; i <= 30; i++) {
    const forecastDay = lastDay + i;
    const forecastRevenue = slope * forecastDay + intercept;
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    forecasts.push({
      x: forecastDay,
      y: Math.max(0, forecastRevenue), // Ensure non-negative predictions
      date: forecastDate.toISOString().split('T')[0],
      originalRevenue: forecastRevenue
    });
  }

  return {
    slope,
    intercept,
    rSquared,
    predictions,
    forecasts
  };
}
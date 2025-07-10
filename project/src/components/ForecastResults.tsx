import React from 'react';
import { TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';
import { ProcessedData } from '../types/sales';
import SalesChart from './SalesChart';
import ForecastTable from './ForecastTable';

interface ForecastResultsProps {
  data: ProcessedData;
}

const ForecastResults: React.FC<ForecastResultsProps> = ({ data }) => {
  const { regression, totalRevenue, averageRevenue, cleanedData, nullsRemoved } = data;
  
  if (!regression) return null;

  const accuracy = regression.rSquared * 100;
  const trend = regression.slope > 0 ? 'increasing' : 'decreasing';
  const trendIcon = regression.slope > 0 ? '📈' : '📉';

  return (
    <div className="space-y-6">
      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Model Accuracy (R²)</p>
              <p className="text-2xl font-bold text-slate-900">{accuracy.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Sales Trend</p>
              <p className="text-lg font-bold text-slate-900 capitalize">
                {trendIcon} {trend}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Daily Growth Rate</p>
              <p className="text-2xl font-bold text-slate-900">
                ${regression.slope.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Records Processed</p>
              <p className="text-2xl font-bold text-slate-900">
                {cleanedData.length}
              </p>
              {nullsRemoved > 0 && (
                <p className="text-xs text-slate-500">{nullsRemoved} cleaned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Sales Forecast Visualization</h3>
          <p className="text-slate-600 text-sm">
            Historical data (blue) vs. predicted trend (red) with 30-day forecast
          </p>
        </div>
        
        <SalesChart data={data} />
      </div>

      {/* Forecast Table */}
      <ForecastTable forecasts={regression.forecasts} />

      {/* Model Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Linear Regression Model Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Model Equation</h4>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
              <div className="text-slate-800">
                Revenue = {regression.intercept.toFixed(2)} + {regression.slope.toFixed(2)} × Days
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Performance Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">R-squared:</span>
                <span className="font-medium text-slate-900">{regression.rSquared.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Slope (Daily Change):</span>
                <span className="font-medium text-slate-900">${regression.slope.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Intercept:</span>
                <span className="font-medium text-slate-900">${regression.intercept.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Model Interpretation</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• R² of {accuracy.toFixed(1)}% indicates {accuracy > 70 ? 'good' : accuracy > 50 ? 'moderate' : 'low'} model fit</li>
            <li>• Sales are {trend} by approximately ${Math.abs(regression.slope).toFixed(2)} per day</li>
            <li>• Baseline revenue (intercept) is ${regression.intercept.toFixed(2)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForecastResults;
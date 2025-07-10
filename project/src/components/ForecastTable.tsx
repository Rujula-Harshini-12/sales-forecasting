import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { TimeSeriesPoint } from '../types/sales';

interface ForecastTableProps {
  forecasts: TimeSeriesPoint[];
}

const ForecastTable: React.FC<ForecastTableProps> = ({ forecasts }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">30-Day Sales Forecast</h3>
            <p className="text-slate-600 text-sm">Predicted revenue for upcoming periods</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Predicted Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {forecasts.map((forecast, index) => {
              const isWeekend = new Date(forecast.date).getDay() % 6 === 0;
              const previousRevenue = index > 0 ? forecasts[index - 1].y : forecast.y;
              const change = forecast.y - previousRevenue;
              const changePercent = previousRevenue > 0 ? (change / previousRevenue) * 100 : 0;
              
              return (
                <tr key={index} className={`hover:bg-slate-50 ${isWeekend ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(forecast.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    Day {forecast.x}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    ${Math.round(forecast.y).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {index === 0 ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className={`w-3 h-3 ${change >= 0 ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
                        <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {change >= 0 ? '+' : ''}${Math.round(change).toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-xs">
                          ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%)
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">
            Total Forecast Period: {forecasts.length} days
          </span>
          <span className="font-medium text-slate-900">
            Expected Revenue: ${Math.round(forecasts.reduce((sum, f) => sum + f.y, 0)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForecastTable;
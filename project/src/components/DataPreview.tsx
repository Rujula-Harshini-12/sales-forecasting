import React from 'react';
import { Play, Database, Calendar, Package, DollarSign, TrendingUp } from 'lucide-react';
import { SalesData } from '../types/sales';

interface DataPreviewProps {
  data: SalesData[];
  onProcess: () => void;
  isProcessing: boolean;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, onProcess, isProcessing }) => {
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const uniqueProducts = new Set(data.map(item => item.product)).size;
  const dateRange = data.length > 0 ? {
    start: new Date(Math.min(...data.map(item => new Date(item.date).getTime()))).toLocaleDateString(),
    end: new Date(Math.max(...data.map(item => new Date(item.date).getTime()))).toLocaleDateString()
  } : null;

  const nullCount = data.reduce((count, item) => {
    return count + 
      (item.date ? 0 : 1) + 
      (item.product ? 0 : 1) + 
      (isNaN(item.quantity) ? 1 : 0) + 
      (isNaN(item.revenue) ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Data Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Records</p>
              <p className="text-2xl font-bold text-slate-900">{data.length.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Unique Products</p>
              <p className="text-2xl font-bold text-slate-900">{uniqueProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Date Range</p>
              <p className="text-sm font-medium text-slate-900">
                {dateRange ? `${dateRange.start} - ${dateRange.end}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality */}
      {nullCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-100 p-1 rounded">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-900">Data Quality Notice</h4>
              <p className="text-yellow-700 text-sm">
                Found {nullCount} missing values that will be cleaned during processing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Data Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Data Preview</h3>
          <p className="text-slate-600 text-sm">Showing first 10 rows of your dataset</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.slice(0, 10).map((row, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {row.date ? new Date(row.date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {row.product || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {!isNaN(row.quantity) ? row.quantity.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {!isNaN(row.revenue) ? `$${row.revenue.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.length > 10 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-sm text-slate-600">
            ... and {data.length - 10} more rows
          </div>
        )}
      </div>

      {/* Process Button */}
      <div className="flex justify-center">
        <button
          onClick={onProcess}
          disabled={isProcessing}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
              Processing Data...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-3" />
              Run Linear Regression Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DataPreview;
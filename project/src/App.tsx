import React, { useState } from 'react';
import { Upload, BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import ForecastResults from './components/ForecastResults';
import { SalesData, ProcessedData } from './types/sales';
import { preprocessData, trainLinearRegression } from './utils/dataProcessing';

function App() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'results'>('upload');

  const handleDataUpload = (data: SalesData[]) => {
    setSalesData(data);
    setCurrentStep('preview');
  };

  const handleProcessData = async () => {
    setIsProcessing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const processed = preprocessData(salesData);
    const regression = trainLinearRegression(processed.timeSeriesData);
    
    setProcessedData({
      ...processed,
      regression
    });
    
    setIsProcessing(false);
    setCurrentStep('results');
  };

  const resetApp = () => {
    setSalesData([]);
    setProcessedData(null);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Sales Forecasting</h1>
                <p className="text-sm text-slate-600">AI-Powered Sales Prediction with Linear Regression</p>
              </div>
            </div>
            
            {currentStep !== 'upload' && (
              <button
                onClick={resetApp}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-600' : currentStep === 'preview' || currentStep === 'results' ? 'text-green-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'upload' ? 'bg-blue-100 text-blue-600' : currentStep === 'preview' || currentStep === 'results' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
              1
            </div>
            <span className="text-sm font-medium">Upload Data</span>
          </div>
          
          <div className={`w-16 h-0.5 ${currentStep === 'preview' || currentStep === 'results' ? 'bg-green-600' : 'bg-slate-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${currentStep === 'preview' ? 'text-blue-600' : currentStep === 'results' ? 'text-green-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'preview' ? 'bg-blue-100 text-blue-600' : currentStep === 'results' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
              2
            </div>
            <span className="text-sm font-medium">Preview & Process</span>
          </div>
          
          <div className={`w-16 h-0.5 ${currentStep === 'results' ? 'bg-green-600' : 'bg-slate-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${currentStep === 'results' ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'results' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
              3
            </div>
            <span className="text-sm font-medium">View Forecast</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'upload' && (
            <FileUpload onDataUpload={handleDataUpload} />
          )}
          
          {currentStep === 'preview' && (
            <DataPreview 
              data={salesData} 
              onProcess={handleProcessData}
              isProcessing={isProcessing}
            />
          )}
          
          {currentStep === 'results' && processedData && (
            <ForecastResults data={processedData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { SalesData } from '../types/sales';

interface FileUploadProps {
  onDataUpload: (data: SalesData[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseCSV = (csvText: string): SalesData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Validate headers
    const requiredHeaders = ['date', 'product', 'quantity', 'revenue'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const data: SalesData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) continue;
      
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      // Parse and validate data
      try {
        const parsedRow: SalesData = {
          date: row.date,
          product: row.product,
          quantity: parseFloat(row.quantity),
          revenue: parseFloat(row.revenue)
        };

        // Validate date format
        if (isNaN(Date.parse(parsedRow.date))) {
          throw new Error(`Invalid date format in row ${i + 1}: ${row.date}`);
        }

        data.push(parsedRow);
      } catch (err) {
        console.warn(`Skipping row ${i + 1}: ${err}`);
      }
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found');
    }

    return data;
  };

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      if (!file.name.endsWith('.csv')) {
        throw new Error('Please upload a CSV file');
      }

      const text = await file.text();
      const data = parseCSV(text);
      
      setTimeout(() => {
        onDataUpload(data);
        setIsProcessing(false);
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setIsProcessing(false);
    }
  }, [onDataUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-slate-300 bg-white hover:border-blue-300 hover:bg-blue-50/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            isProcessing ? 'bg-blue-100' : error ? 'bg-red-100' : 'bg-slate-100'
          }`}>
            {isProcessing ? (
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            ) : error ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <Upload className="w-6 h-6 text-slate-600" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {isProcessing ? 'Processing your data...' : 'Upload Sales Data'}
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            
            {!isProcessing && (
              <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer shadow-lg hover:shadow-xl">
                <FileText className="w-4 h-4 mr-2" />
                Choose File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900">Upload Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Sample Data Format */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          Expected CSV Format
        </h3>
        
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <div className="text-slate-600 mb-2">Your CSV should have these columns:</div>
          <table className="min-w-full">
            <thead>
              <tr className="text-slate-800 font-semibold">
                <td className="pr-8">date</td>
                <td className="pr-8">product</td>
                <td className="pr-8">quantity</td>
                <td>revenue</td>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr>
                <td className="pr-8">2024-01-01</td>
                <td className="pr-8">Widget A</td>
                <td className="pr-8">100</td>
                <td>5000</td>
              </tr>
              <tr>
                <td className="pr-8">2024-01-02</td>
                <td className="pr-8">Widget B</td>
                <td className="pr-8">75</td>
                <td>3750</td>
              </tr>
              <tr>
                <td className="pr-8">2024-01-03</td>
                <td className="pr-8">Widget A</td>
                <td className="pr-8">120</td>
                <td>6000</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-slate-600">
          <strong>Requirements:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Date format: YYYY-MM-DD</li>
            <li>Quantity and revenue must be numeric values</li>
            <li>Missing values will be automatically handled</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
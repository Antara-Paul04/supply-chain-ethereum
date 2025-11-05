'use client';

import { useState } from 'react';
import { useGetBatch } from '@/hooks/useContract';
import QRScanner from '@/components/QRScanner';
import Link from 'next/link';


export default function VerifyPage() {
  const [batchId, setBatchId] = useState('');
  const [searchedBatchId, setSearchedBatchId] = useState<number | undefined>();
  const { data: batchData, error: contractError, isLoading } = useGetBatch(searchedBatchId);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const parsedBatchId = parseInt(batchId);
      if (isNaN(parsedBatchId)) {
        setError('Please enter a valid batch ID');
        return;
      }
      
      setSearchedBatchId(parsedBatchId);
    } catch {
      setError('Invalid batch ID format');
    }
  };

  const handleQRScan = (result: string) => {
    setShowScanner(false);
    
    // Extract batch ID from QR code data
    if (result.startsWith('coffeechain://batch/')) {
      const extractedBatchId = result.replace('coffeechain://batch/', '');
      setBatchId(extractedBatchId);
      
      // Auto-verify the scanned batch
      const parsedBatchId = parseInt(extractedBatchId);
      if (!isNaN(parsedBatchId)) {
        setSearchedBatchId(parsedBatchId);
      }
    } else {
      setError('Invalid QR code format');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-semibold text-gray-900">CoffeeChain</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Verify Coffee</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Verify Your Coffee</h1>
            </div>

            <form onSubmit={handleVerify} className="mb-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter batch ID"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading && searchedBatchId !== undefined}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading && searchedBatchId !== undefined ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">or</span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Scan QR Code</span>
                </button>
              </div>
              
              {(error || contractError) && (
                <p className="text-red-600 text-sm mt-2">{error || 'Batch not found. Please check the ID and try again.'}</p>
              )}
            </form>

            {batchData && batchData.exists && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-green-800">Verified Authentic Coffee</h2>
                  </div>
                  <p className="text-green-700">
                    This coffee has been verified on the blockchain. Here&apos;s its complete journey:
                  </p>
                </div>

                {/* Coffee Journey Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Coffee Journey</h3>
                  
                  {/* Farm Stage */}
                  <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L13 14l-3-1-3 1z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Harvested</h4>
                      <p className="text-sm text-gray-700">
                        <strong>{batchData.farmName}</strong> in {batchData.farmLocation}
                      </p>
                      <p className="text-sm text-gray-600">
                        {batchData.coffeeVariety} • {batchData.quantity}kg • {formatDate(batchData.harvestDate)}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Stage */}
                  <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Shipped</h4>
                      <p className="text-sm text-gray-700">
                        Transported from farm to roasting facility
                      </p>
                    </div>
                  </div>

                  {/* Roasting Stage */}
                  {batchData.roasterName && (
                    <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Roasted</h4>
                        <p className="text-sm text-gray-700">
                          <strong>{batchData.roasterName}</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          {batchData.roastProfile} • {formatDate(batchData.roastDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Packaging Stage */}
                  <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Packaged</h4>
                      <p className="text-sm text-gray-700">
                        Ready for retail distribution
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">About This Coffee</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Origin:</span> {batchData.farmLocation}
                    </div>
                    <div>
                      <span className="font-medium">Variety:</span> {batchData.coffeeVariety}
                    </div>
                    <div>
                      <span className="font-medium">Harvest:</span> {formatDate(batchData.harvestDate)}
                    </div>
                    <div>
                      <span className="font-medium">Roast:</span> {batchData.roastProfile}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
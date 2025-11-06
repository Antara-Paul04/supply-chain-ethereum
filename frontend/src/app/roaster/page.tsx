'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContractWrite, useGetBatchesByState } from '@/hooks/useContract';
import { getTransactionUrl } from '@/utils/explorer';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { useAccount, useChainId } from 'wagmi';

export default function RoasterDashboard() {
  const { user, logout, hasAccess } = useAuth();
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeAsync, isPending, isConfirming, isSuccess } = useContractWrite();
  const { data: shippedBatches, isLoading: batchesLoading, refetch } = useGetBatchesByState('Shipped');
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [roastData, setRoastData] = useState({
    roasterName: '',
    roastProfile: ''
  });
  const [qrCodeData, setQrCodeData] = useState<string>('');

  // Refetch batches when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      // Wait a bit for the blockchain to update
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isSuccess]);

  const handleRoast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBatch === null || !address) return;
    
    try {
      // Call smart contract roastBatch function
      const txHash = await writeAsync('roastBatch', [
        selectedBatch,
        roastData.roasterName,
        roastData.roastProfile
      ]) as string;

      // Show success with transaction link
      const txUrl = getTransactionUrl(chainId, txHash);
      if (txUrl) {
        alert(`Batch roasted successfully!\n\nView transaction:\n${txUrl}`);
      } else {
        alert('Batch roasted successfully!');
      }
      setRoastData({ roasterName: '', roastProfile: '' });
    } catch (err) {
      console.error('Error roasting batch:', err);
      alert('Failed to roast batch. Please try again.');
    }
  };

  const handlePackage = async () => {
    if (selectedBatch === null || !address) return;

    try {
      // Generate QR code data
      const qrData = `coffeechain://batch/${selectedBatch}`;
      setQrCodeData(qrData);

      // Call smart contract packageBatch function
      const txHash = await writeAsync('packageBatch', [selectedBatch, qrData]) as string;

      // Show success with transaction link
      const txUrl = getTransactionUrl(chainId, txHash);
      if (txUrl) {
        alert(`Batch packaged successfully with QR code!\n\nView transaction:\n${txUrl}`);
      } else {
        alert('Batch packaged successfully with QR code!');
      }
    } catch (err) {
      console.error('Error packaging batch:', err);
      alert('Failed to package batch. Please try again.');
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (with padding)
    const padding = 40;
    const size = 200;
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2;

    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw image on canvas with padding
      ctx.drawImage(img, padding, padding, size, size);

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `coffeechain-batch-${selectedBatch}-qr.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      });

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  if (!user || !hasAccess('roaster')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              This dashboard is only available to registered coffee roasters.
            </p>
            <Link href="/register/roaster" className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
              Register as Roaster
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-semibold text-gray-900">CoffeeChain</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Roaster Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Available Batches */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 110 2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 110-2V4z"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Available Batches</h2>
            </div>

            {batchesLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 110 2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 110-2V4z"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Loading batches...</p>
              </div>
            ) : shippedBatches.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 110 2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 110-2V4z"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No shipped batches available</p>
                <p className="text-gray-400 text-xs mt-1">Waiting for farmers to ship coffee batches</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {shippedBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedBatch === batch.id
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedBatch(batch.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">Batch #{batch.id}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {batch.state}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{batch.farmName}</p>
                    <p className="text-xs text-gray-500">{batch.farmLocation}</p>
                    <p className="text-xs text-gray-500">{batch.coffeeVariety} • {batch.quantity}kg</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Roasting Interface */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Roast Batch</h2>
            </div>

            {selectedBatch !== null ? (
              <div className="space-y-6">
                <form onSubmit={handleRoast} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roaster Name</label>
                    <input
                      type="text"
                      value={roastData.roasterName}
                      onChange={(e) => setRoastData({...roastData, roasterName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Blue Mountain Roasters"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roast Profile</label>
                    <select
                      value={roastData.roastProfile}
                      onChange={(e) => setRoastData({...roastData, roastProfile: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
                      required
                    >
                      <option value="">Select roast profile...</option>
                      <option value="Light Roast">Light Roast</option>
                      <option value="Medium Roast">Medium Roast</option>
                      <option value="Medium-Dark Roast">Medium-Dark Roast</option>
                      <option value="Dark Roast">Dark Roast</option>
                      <option value="French Roast">French Roast</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 text-sm font-medium"
                  >
                    {isPending ? 'Submitting...' : isConfirming ? 'Confirming...' : 'Complete Roasting'}
                  </button>
                </form>

                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handlePackage}
                    disabled={isPending || isConfirming || !roastData.roasterName}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm font-medium"
                  >
                    {isPending ? 'Submitting...' : isConfirming ? 'Confirming...' : 'Package & Generate QR Code'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L13 14l-3-1-3 1z"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Select a batch to start roasting</p>
              </div>
            )}
          </div>

          {/* QR Code Display */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Package QR Code</h2>
            </div>

            {qrCodeData ? (
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block mb-4">
                  <QRCode id="qr-code-svg" value={qrCodeData} size={160} />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Ready for Packaging</p>
                <p className="text-xs text-gray-500">
                  Print this QR code on your coffee packaging for consumer verification
                </p>
                <button
                  onClick={handleDownloadQR}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Download QR Code
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">QR code will appear here</p>
                <p className="text-gray-400 text-xs mt-1">Complete roasting and packaging to generate QR code</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
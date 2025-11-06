'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContractWrite, useGetFarmerBatches } from '@/hooks/useContract';
import { getTransactionUrl } from '@/utils/explorer';
import Link from 'next/link';
import { useAccount, useChainId } from 'wagmi';

export default function FarmerDashboard() {
  const { user, logout, hasAccess } = useAuth();
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeAsync, isPending, isConfirming, isSuccess, hash } = useContractWrite();
  const { data: farmerBatches, isLoading: batchesLoading } = useGetFarmerBatches(address);
  const [formData, setFormData] = useState({
    farmName: '',
    farmLocation: '',
    coffeeVariety: '',
    quantity: ''
  });

  // Pre-fill form with user's registration data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        farmName: user.name || '',
        farmLocation: user.location || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission:', { address, user, formData });

    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Call smart contract createBatch function
      const txHash = await writeAsync('createBatch', [
        formData.farmName,
        formData.farmLocation,
        formData.coffeeVariety,
        parseInt(formData.quantity)
      ]) as string;

      // Reset form on success
      setFormData({ farmName: user?.name || '', farmLocation: user?.location || '', coffeeVariety: '', quantity: '' });

      // Show success with transaction link
      const txUrl = getTransactionUrl(chainId, txHash as string);
      if (txUrl) {
        alert(`Coffee batch created successfully!\n\nView transaction:\n${txUrl}`);
      } else {
        alert('Coffee batch created successfully!');
      }
    } catch (err) {
      console.error('Error creating batch:', err);
      alert('Failed to create batch. Please try again.');
    }
  };

  const handleShipBatch = async (batchId: number) => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!confirm(`Ship batch #${batchId} to roaster?`)) {
      return;
    }

    try {
      const txHash = await writeAsync('shipBatch', [batchId]) as string;

      // Show success with transaction link
      const txUrl = getTransactionUrl(chainId, txHash);
      if (txUrl) {
        alert(`Batch shipped successfully!\n\nView transaction:\n${txUrl}`);
      } else {
        alert('Batch shipped successfully!');
      }
    } catch (err) {
      console.error('Error shipping batch:', err);
      alert('Failed to ship batch. Please try again.');
    }
  };

  if (!user || !hasAccess('farmer')) {
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
              This dashboard is only available to registered coffee farmers.
            </p>
            <Link href="/register/farmer" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Register as Farmer
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
              <span className="text-gray-600">Farmer Dashboard</span>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Create Batch Form */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L13 14l-3-1-3 1z"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Create New Coffee Batch</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  value={formData.farmName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  value={formData.farmLocation}
                  onChange={(e) => setFormData({...formData, farmLocation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Huehuetenango, Guatemala"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coffee Variety</label>
                <select
                  value={formData.coffeeVariety}
                  onChange={(e) => setFormData({...formData, coffeeVariety: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
                  required
                >
                  <option value="">Select variety...</option>
                  <option value="Arabica - Bourbon">Arabica - Bourbon</option>
                  <option value="Arabica - Typica">Arabica - Typica</option>
                  <option value="Arabica - Caturra">Arabica - Caturra</option>
                  <option value="Arabica - Geisha">Arabica - Geisha</option>
                  <option value="Robusta">Robusta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
                  placeholder="e.g., 100"
                  min="1"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 text-sm font-medium"
              >
                {isPending ? 'Submitting...' : isConfirming ? 'Confirming...' : 'Create Coffee Batch'}
              </button>
            </form>
          </div>

          {/* Recent Batches */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Coffee Batches</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {batchesLoading ? '...' : `${farmerBatches.length} batch${farmerBatches.length !== 1 ? 'es' : ''}`}
              </span>
            </div>

            {batchesLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L13 14l-3-1-3 1z"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Loading batches...</p>
              </div>
            ) : farmerBatches.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L13 14l-3-1-3 1z"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No batches created yet</p>
                <p className="text-gray-400 text-xs mt-1">Create your first batch using the form on the left</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {farmerBatches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">Batch #{batch.id}</h3>
                        <p className="text-xs text-gray-500">{batch.coffeeVariety}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        batch.state === 'Harvested' ? 'bg-yellow-100 text-yellow-800' :
                        batch.state === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        batch.state === 'Roasted' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {batch.state}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{batch.quantity} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Harvest Date:</span>
                        <span className="font-medium">{batch.harvestDate}</span>
                      </div>
                      {batch.roasterName && (
                        <div className="flex justify-between">
                          <span>Roaster:</span>
                          <span className="font-medium">{batch.roasterName}</span>
                        </div>
                      )}
                    </div>
                    {batch.state === 'Harvested' && (
                      <button
                        onClick={() => handleShipBatch(batch.id)}
                        disabled={isPending || isConfirming}
                        className="mt-3 w-full bg-blue-600 text-white py-1.5 px-3 rounded text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {isPending || isConfirming ? 'Processing...' : 'Ship to Roaster'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
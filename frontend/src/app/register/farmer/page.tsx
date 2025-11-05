'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function FarmerRegistration() {
  const { login, isLoading } = useAuth();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'email' | 'wallet'>('email');
  const [formData, setFormData] = useState({
    email: '',
    farmName: '',
    location: ''
  });
  const [walletFormData, setWalletFormData] = useState({
    farmName: '',
    location: ''
  });

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, 'farmer', formData.farmName, formData.location);
      router.push('/farmer');
    } catch (error) {
      console.error('Email signup failed:', error);
    }
  };

  const handleWalletRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    
    try {
      // For wallet users, we'll use the address as identifier and register directly
      await login(address, 'farmer', walletFormData.farmName, walletFormData.location);
      router.push('/farmer');
    } catch (error) {
      console.error('Wallet registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">CoffeeChain</Link>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-600">Farmer Registration</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L13 14l-3-1-3 1z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join as Coffee Farmer</h1>
            <p className="text-gray-600">Track your coffee from harvest to market</p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => setAuthMethod('email')}
              className={`w-full flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
                authMethod === 'email'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              Sign up with Email (Recommended)
            </button>

            <button
              onClick={() => setAuthMethod('wallet')}
              className={`w-full flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
                authMethod === 'wallet'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z"/>
              </svg>
              Connect Crypto Wallet
            </button>
          </div>

          {authMethod === 'email' ? (
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Sunrise Coffee Farm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Huehuetenango, Guatemala"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Join as Farmer'}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                We&apos;ll send you a magic link to complete registration and create your secure wallet
              </p>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <ConnectButton />
              </div>
              
              {isConnected && address ? (
                <form onSubmit={handleWalletRegistration} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">Wallet Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                    <input
                      type="text"
                      value={walletFormData.farmName}
                      onChange={(e) => setWalletFormData({...walletFormData, farmName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Sunrise Coffee Farm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
                    <input
                      type="text"
                      value={walletFormData.location}
                      onChange={(e) => setWalletFormData({...walletFormData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Huehuetenango, Guatemala"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </form>
              ) : (
                <p className="text-xs text-gray-500 text-center">
                  Connect your crypto wallet above to continue registration
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
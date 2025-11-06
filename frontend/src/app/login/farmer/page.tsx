'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function FarmerLogin() {
  const { loginExisting, user, isLoading } = useAuth();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'email' | 'wallet'>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.role === 'farmer') {
      router.push('/farmer');
    }
  }, [user, router]);

  // Check wallet connection
  useEffect(() => {
    if (authMethod === 'wallet' && isConnected && address) {
      handleWalletLogin();
    }
  }, [isConnected, address, authMethod]);

  const handleWalletLogin = async () => {
    if (!address) return;

    const success = await loginExisting(address);
    if (success) {
      router.push('/farmer');
    } else {
      setError('Wallet not registered. Please register first.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await loginExisting(email);
      if (success) {
        router.push('/farmer');
      } else {
        setError('Email not registered. Please register first.');
      }
    } catch (error) {
      console.error('Email login failed:', error);
      setError('Login failed. Please try again.');
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
              <span className="text-gray-600">Farmer Login</span>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Farmer Login</h1>
            <p className="text-gray-600">Access your coffee dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
              <Link href="/register/farmer" className="text-sm text-red-600 hover:text-red-800 underline mt-2 inline-block">
                Register as Farmer →
              </Link>
            </div>
          )}

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
              Login with Email
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
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
              Login with Wallet
            </button>
          </div>

          {authMethod === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 text-sm font-medium"
              >
                {isLoading ? 'Logging in...' : 'Login with Email'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Connect your wallet to login</p>
                <ConnectButton />
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register/farmer" className="text-green-600 hover:text-green-700 font-medium">
                Register as Farmer
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

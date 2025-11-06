'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">CoffeeChain</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/verify" className="text-gray-600 hover:text-gray-900">
                Verify Coffee
              </Link>
              {user && (
                <>
                  {user.role === 'farmer' && (
                    <Link href="/farmer" className="text-gray-600 hover:text-gray-900">
                      Farmer Dashboard
                    </Link>
                  )}
                  {user.role === 'roaster' && (
                    <Link href="/roaster" className="text-gray-600 hover:text-gray-900">
                      Roaster Dashboard
                    </Link>
                  )}
                  <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Track Coffee from Farm to Cup
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent supply chain tracking powered by blockchain technology. 
            Verify authenticity, support fair trade, and discover your coffee&apos;s unique journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L13 14l-3-1-3 1z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Coffee Farmers</h3>
            <p className="text-gray-600 text-center mb-6">
              Register your farm and start tracking your coffee batches from harvest to market.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/register/farmer" className="w-full">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                  Register as Farmer
                </button>
              </Link>
              <Link href="/login/farmer" className="w-full">
                <button className="w-full px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm font-medium">
                  Login
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Coffee Roasters</h3>
            <p className="text-gray-600 text-center mb-6">
              Connect with coffee farmers and manage your roasting operations with full traceability.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/register/roaster" className="w-full">
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
                  Register as Roaster
                </button>
              </Link>
              <Link href="/login/roaster" className="w-full">
                <button className="w-full px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition-colors text-sm font-medium">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <Link href="/verify" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Verify Coffee (No Registration Required)
          </Link>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Follow the coffee journey from harvest to your cup</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L13 14l-3-1-3 1z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Harvest</h3>
              <p className="text-sm text-gray-600">Farmers register coffee batches with origin details and quality metrics</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Transport</h3>
              <p className="text-sm text-gray-600">Secure shipping with blockchain-recorded logistics data</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Roast</h3>
              <p className="text-sm text-gray-600">Professional roasting with recorded profiles and quality control</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Verify</h3>
              <p className="text-sm text-gray-600">Consumers scan QR codes to verify authenticity and trace origins</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
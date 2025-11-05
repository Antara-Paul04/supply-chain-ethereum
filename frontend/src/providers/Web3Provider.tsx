'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import '@rainbow-me/rainbowkit/styles.css';

const hoodi = {
  id: 560048,
  name: 'Hoodi Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://ethereum-hoodi-rpc.publicnode.com/'] },
  },
  blockExplorers: {
    default: { name: 'Hoodi Explorer', url: 'https://hoodi.etherscan.io/' },
  },
  testnet: true,
} as const;

const config = getDefaultConfig({
  appName: 'CoffeeChain',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your_project_id_here',
  chains: [mainnet, polygon, optimism, arbitrum, sepolia, hoodi],
  ssr: true,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
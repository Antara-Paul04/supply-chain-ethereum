// Block explorer utility functions

const CHAIN_EXPLORERS: Record<number, string> = {
  1: 'https://etherscan.io',           // Mainnet
  11155111: 'https://sepolia.etherscan.io', // Sepolia
  560048: 'https://hoodi.etherscan.io',     // Hoodi
  137: 'https://polygonscan.com',      // Polygon
  10: 'https://optimistic.etherscan.io', // Optimism
  42161: 'https://arbiscan.io',        // Arbitrum
  31337: 'http://localhost:8545',      // Local (no explorer)
};

export function getExplorerUrl(chainId: number | undefined): string {
  if (!chainId) return '';
  return CHAIN_EXPLORERS[chainId] || '';
}

export function getTransactionUrl(chainId: number | undefined, txHash: string): string {
  const explorerUrl = getExplorerUrl(chainId);
  if (!explorerUrl || chainId === 31337) return '';
  return `${explorerUrl}/tx/${txHash}`;
}

export function getAddressUrl(chainId: number | undefined, address: string): string {
  const explorerUrl = getExplorerUrl(chainId);
  if (!explorerUrl || chainId === 31337) return '';
  return `${explorerUrl}/address/${address}`;
}

export function getBlockUrl(chainId: number | undefined, blockNumber: number | string): string {
  const explorerUrl = getExplorerUrl(chainId);
  if (!explorerUrl || chainId === 31337) return '';
  return `${explorerUrl}/block/${blockNumber}`;
}

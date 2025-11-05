// Import the exact ABI from contract artifacts
import { COFFEE_BATCH_ABI } from './generated-abi';

// Contract address - Update this after deployment
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

// Enum mappings
export const BatchState = {
  Harvested: 0,
  Shipped: 1,
  Roasted: 2,
  Packaged: 3
};

export const UserRole = {
  Farmer: 0,
  Roaster: 1,
  Admin: 2
};

export const BatchStateNames = {
  0: 'Harvested',
  1: 'Shipped', 
  2: 'Roasted',
  3: 'Packaged'
};

export const UserRoleNames = {
  0: 'Farmer',
  1: 'Roaster',
  2: 'Admin'
};

// Contract configuration
export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: COFFEE_BATCH_ABI,
} as const;

// Type definitions for contract interaction
export type CoffeeBatchData = {
  id: number;
  farmName: string;
  farmLocation: string;
  coffeeVariety: string;
  quantity: number;
  harvestDate: string;
  farmer: string;
  state: string;
  roasterName: string;
  roastDate: string;
  roastProfile: string;
  qrCode: string;
};

export type UserData = {
  role: string;
  name: string;
  email: string;
  location: string;
  isRegistered: boolean;
};
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { magic } from '@/lib/magic';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { useContractWrite, useGetUser } from '@/hooks/useContract';
import { getTransactionUrl } from '@/utils/explorer';

type UserRole = 'farmer' | 'roaster' | 'admin';

type User = {
  email?: string;
  address: string;
  role: UserRole;
  name: string;
  location?: string;
  authMethod: 'magic' | 'wallet';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, role: UserRole, name: string, location?: string) => Promise<void>;
  loginExisting: (emailOrAddress: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasAccess: (requiredRole: UserRole) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { writeAsync } = useContractWrite();
  const { data: contractUser, isLoading: userLoading } = useGetUser(address);

  // Handle wallet connection and load existing user data
  useEffect(() => {
    if (isConnected && address && !user && !userLoading) {
      if (contractUser && contractUser.isRegistered) {
        // User is already registered, load their data
        setUser({
          address,
          role: contractUser.role.toLowerCase() as UserRole,
          name: contractUser.name,
          location: contractUser.location,
          authMethod: 'wallet'
        });
      }
    }
  }, [isConnected, address, user, contractUser, userLoading]);

  const login = async (emailOrAddress: string, role: UserRole, name: string, location?: string) => {
    setIsLoading(true);
    try {
      // Check if this is a wallet address (starts with 0x) or email
      const isWalletAddress = emailOrAddress.startsWith('0x');
      
      if (isWalletAddress && address) {
        // Wallet-based registration - register with smart contract
        console.log('Registering user with contract:', {
          address,
          role: role === 'farmer' ? 0 : role === 'roaster' ? 1 : 2,
          name,
          email: emailOrAddress,
          location: location || ''
        });
        
        const txHash = await writeAsync('registerUser', [
          address, // user address
          role === 'farmer' ? 0 : role === 'roaster' ? 1 : 2, // UserRole enum
          name,
          emailOrAddress, // Store wallet address as identifier
          location || '' // location parameter
        ]) as string;

        console.log('Registration transaction:', txHash);

        // Show success with transaction link
        const txUrl = getTransactionUrl(chainId, txHash);
        if (txUrl) {
          alert(`Registration successful!\n\nView transaction:\n${txUrl}`);
        }

        setUser({
          address,
          role,
          name,
          location,
          authMethod: 'wallet'
        });
      } else if (magic) {
        // Email-based registration with Magic Link
        await magic.auth.loginWithMagicLink({ email: emailOrAddress });
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const userMetadata = await magic.user.getInfo();
          const userAddress = userMetadata.publicAddress || '';
          
          // Register user with smart contract
          const txHash = await writeAsync('registerUser', [
            userAddress, // user address from Magic Link
            role === 'farmer' ? 0 : role === 'roaster' ? 1 : 2, // UserRole enum
            name,
            emailOrAddress, // Store actual email for Magic Link users
            location || '' // location parameter
          ]) as string;

          console.log('Registration transaction:', txHash);

          // Show success with transaction link
          const txUrl = getTransactionUrl(chainId, txHash);
          if (txUrl) {
            alert(`Registration successful!\n\nView transaction:\n${txUrl}`);
          }

          setUser({
            email: emailOrAddress,
            address: userAddress,
            role,
            name,
            location,
            authMethod: 'magic'
          });
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    setIsLoading(false);
  };

  const loginExisting = async (emailOrAddress: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const isWalletAddress = emailOrAddress.startsWith('0x');

      if (isWalletAddress && address) {
        // Wallet-based login - check if already registered
        if (contractUser && contractUser.isRegistered) {
          // User data will be set by the useEffect above
          setIsLoading(false);
          return true;
        }
        setIsLoading(false);
        return false; // Not registered
      } else if (magic) {
        // Email-based login with Magic Link
        await magic.auth.loginWithMagicLink({ email: emailOrAddress });
        const isLoggedIn = await magic.user.isLoggedIn();

        if (isLoggedIn) {
          const userMetadata = await magic.user.getInfo();
          const userAddress = userMetadata.publicAddress || '';

          // Manually fetch user data from contract using ethers
          // We need to check if the user is registered
          // For now, we'll use a simple fetch approach via the contract
          const response = await fetch(`/api/checkUser?address=${userAddress}`);
          if (response.ok) {
            const userData = await response.json();
            if (userData.isRegistered) {
              setUser({
                email: emailOrAddress,
                address: userAddress,
                role: userData.role.toLowerCase() as UserRole,
                name: userData.name,
                location: userData.location,
                authMethod: 'magic'
              });
              setIsLoading(false);
              return true;
            }
          }
        }
        setIsLoading(false);
        return false; // Not registered
      }
    } catch (error) {
      console.error('Login existing failed:', error);
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    if (user?.authMethod === 'magic' && magic) {
      await magic.user.logout();
    } else if (user?.authMethod === 'wallet') {
      disconnect();
    }
    setUser(null);
  };

  const hasAccess = (requiredRole: UserRole) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, login, loginExisting, logout, isLoading, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
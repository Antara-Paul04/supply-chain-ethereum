import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG, UserRoleNames, BatchStateNames } from '@/utils/contract';

// Custom hook for contract reads
export function useContractRead(functionName: string, args?: readonly unknown[]) {
  return useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName,
    args,
  });
}

// Custom hook for contract writes
export function useContractWrite() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const writeAsync = async (functionName: string, args: readonly unknown[]) => {
    return writeContract({
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_CONFIG.abi,
      functionName,
      args,
    });
  };

  return {
    writeAsync,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  };
}

// Specific contract function hooks
export function useGetBatch(batchId: number | undefined) {
  const { data, error, isLoading } = useContractRead('getBatch', batchId ? [batchId] : undefined);
  
  if (!data || error) return { data: null, error, isLoading };
  
  // Type assertion for contract return data
  const batchArray = data as readonly [bigint, string, string, string, bigint, bigint, string, number, string, bigint, string, string, boolean];
  
  return {
    data: {
      id: Number(batchArray[0]),
      farmName: batchArray[1],
      farmLocation: batchArray[2],
      coffeeVariety: batchArray[3],
      quantity: Number(batchArray[4]),
      harvestDate: new Date(Number(batchArray[5]) * 1000).toISOString().split('T')[0],
      farmer: batchArray[6],
      state: BatchStateNames[batchArray[7] as keyof typeof BatchStateNames],
      roasterName: batchArray[8],
      roastDate: Number(batchArray[9]) > 0 ? new Date(Number(batchArray[9]) * 1000).toISOString().split('T')[0] : '',
      roastProfile: batchArray[10],
      qrCode: batchArray[11],
      exists: batchArray[12]
    },
    error,
    isLoading
  };
}

export function useGetUser(address: string | undefined) {
  const { data, error, isLoading } = useContractRead('getUserInfo', address ? [address] : undefined);
  
  if (!data || error) {
    return { data: null, error, isLoading };
  }
  
  // Type assertion for contract return data - now includes location
  const userArray = data as readonly [number, string, string, string, boolean];
  
  return {
    data: {
      role: UserRoleNames[userArray[0] as keyof typeof UserRoleNames],
      name: userArray[1],
      email: userArray[2],
      location: userArray[3],
      isRegistered: userArray[4]
    },
    error,
    isLoading
  };
}

export function useContractAddress() {
  return CONTRACT_CONFIG.address;
}
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

// Hook to get next batch ID (total batches count)
export function useGetNextBatchId() {
  const { data, error, isLoading } = useContractRead('nextBatchId');
  return {
    data: data ? Number(data) : 0,
    error,
    isLoading
  };
}

// Hook to get all batch IDs
export function useGetAllBatchIds() {
  const { data, error, isLoading } = useContractRead('getAllBatches');
  return {
    data: data ? (data as bigint[]).map(id => Number(id)) : [],
    error,
    isLoading
  };
}

// Hook to get multiple batches by IDs
export function useGetBatches(batchIds: number[]) {
  // This will make multiple contract calls
  const batches = batchIds.map(id => useGetBatch(id));

  return {
    data: batches
      .filter(b => b.data && b.data.exists)
      .map(b => b.data!),
    isLoading: batches.some(b => b.isLoading),
    error: batches.find(b => b.error)?.error
  };
}

// Hook to filter batches by farmer address
export function useGetFarmerBatches(farmerAddress: string | undefined) {
  const { data: batchIds, isLoading: idsLoading } = useGetAllBatchIds();
  const batches = useGetBatches(batchIds);

  if (!farmerAddress) {
    return { data: [], isLoading: false, error: null };
  }

  const filteredData = batches.data.filter(
    batch => batch.farmer.toLowerCase() === farmerAddress.toLowerCase()
  );

  return {
    data: filteredData,
    isLoading: idsLoading || batches.isLoading,
    error: batches.error
  };
}

// Hook to filter batches by state
export function useGetBatchesByState(state: string) {
  const { data: batchIds, isLoading: idsLoading } = useGetAllBatchIds();
  const batches = useGetBatches(batchIds);

  const filteredData = batches.data.filter(batch => batch.state === state);

  return {
    data: filteredData,
    isLoading: idsLoading || batches.isLoading,
    error: batches.error
  };
}
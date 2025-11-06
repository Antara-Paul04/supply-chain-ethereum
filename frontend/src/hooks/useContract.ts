import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG, UserRoleNames, BatchStateNames } from '@/utils/contract';
import { useMemo } from 'react';

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
  const { writeContractAsync, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const writeAsync = async (functionName: string, args: readonly unknown[]) => {
    return await writeContractAsync({
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

// Hook to filter batches by farmer address
export function useGetFarmerBatches(farmerAddress: string | undefined) {
  const { data: nextBatchId, isLoading: countLoading } = useGetNextBatchId();

  // Create array of contract calls for all batches
  const contracts = useMemo(() => {
    if (!nextBatchId || nextBatchId === 0) return [];

    return Array.from({ length: nextBatchId }, (_, i) => ({
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'getBatch' as const,
      args: [i],
    }));
  }, [nextBatchId]);

  const { data: batchesData, isLoading: batchesLoading, error, refetch } = useReadContracts({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contracts: contracts as any,
    query: {
      enabled: contracts.length > 0,
    },
  });

  // Process and filter batches
  const batches = useMemo(() => {
    if (!batchesData || !farmerAddress) return [];

    console.log('Raw batchesData from contract:', batchesData);

    const allBatches = batchesData
      .map((result, index) => {
        console.log(`Processing batch ${index}:`, result);

        if (result.status !== 'success' || !result.result) {
          console.log(`Batch ${index} failed or has no result`);
          return null;
        }

        // const batchArray = result.result as readonly [bigint, string, string, string, bigint, bigint, string, number, string, bigint, string, string, boolean];
        console.log(`Batch ${index} data:`, {
          rawData: result.result,
        });

        // Check if batch exists before processing dates
        // if (!batchArray.exists) {
        //   console.log(`Batch ${index} does not exist (exists=false)`);
        //   return null;
        // }

        const harvestTimestamp = Number(result,result[5]);
        const roastTimestamp = Number(result.result[9]);
        return result.result;
      });

    // Debug logging
    console.log('Processed all batches:', allBatches);
    console.log('All existing batches:', allBatches.map(b => ({ farmer: b.farmer, farmName: b.farmName })));
    console.log('Looking for farmer address:', farmerAddress);
    console.log('Filtered result:', allBatches.filter(b => b.farmer.toLowerCase() === farmerAddress.toLowerCase()));

    return allBatches.filter(b => b.farmer.toLowerCase() === farmerAddress.toLowerCase());
  }, [batchesData, farmerAddress]);

  return {
    data: batches,
    isLoading: countLoading || batchesLoading,
    error,
    refetch
  };
}

// Hook to filter batches by state
export function useGetBatchesByState(state: string) {
  const { data: nextBatchId, isLoading: countLoading } = useGetNextBatchId();
  
  // Create array of contract calls for all batches
  const contracts = useMemo(() => {
    if (!nextBatchId || nextBatchId === 0) return [];
    
    return Array.from({ length: nextBatchId }, (_, i) => ({
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'getBatch' as const,
      args: [i],
    }));
  }, [nextBatchId]);
  
  const { data: batchesData, isLoading: batchesLoading, error, refetch } = useReadContracts({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contracts: contracts as any,
    query: {
      enabled: contracts.length > 0,
    },
  });
  
  // Process and filter batches
  const batches = useMemo(() => {
    if (!batchesData) return [];
    console.log('Raw batchesData from contract:', batchesData);

    return batchesData
      .map((result, index) => {
        if (result.status !== 'success' || !result.result) return null;

        const batch = result.result as {
          id: bigint;
          farmName: string;
          farmLocation: string;
          coffeeVariety: string;
          quantity: bigint;
          harvestDate: bigint;
          farmer: string;
          state: number;
          roasterName: string;
          roastDate: bigint;
          roastProfile: string;
          qrCode: string;
          exists: boolean;
        };

        // Check if batch exists and matches state
        // if (!batch.exists || batch.state !== state) return null;

        const harvestTimestamp = Number(batch.harvestDate);
        const roastTimestamp = Number(batch.roastDate);
        
        return {
          id: Number(batch.id),
          farmName: batch.farmName,
          farmLocation: batch.farmLocation,
          coffeeVariety: batch.coffeeVariety,
          quantity: Number(batch.quantity),
          harvestDate: harvestTimestamp > 0 ? new Date(harvestTimestamp * 1000).toISOString().split('T')[0] : '',
          farmer: batch.farmer,
          state: BatchStateNames[batch.state as keyof typeof BatchStateNames],
          roasterName: batch.roasterName,
          roastDate: roastTimestamp > 0 ? new Date(roastTimestamp * 1000).toISOString().split('T')[0] : '',
          roastProfile: batch.roastProfile,
          qrCode: batch.qrCode,
          exists: batch.exists
        };
      })
      .filter((batch): batch is NonNullable<typeof batch> =>
        batch !== null &&
        batch.exists &&
        batch.state === state
      );
  }, [batchesData, state]);

  return {
    data: batches,
    isLoading: countLoading || batchesLoading,
    error,
    refetch
  };
}
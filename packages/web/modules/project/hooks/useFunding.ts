import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useQueryClient } from "react-query";

import { contractTypes } from "config";

export function useFundedAmount(addressOrName: string) {
  return useContractRead(
    { addressOrName, contractInterface: contractTypes.project },
    "fundedAmount"
  );
}

export function useVestingStart(addressOrName: string) {
  return useContractRead(
    { addressOrName, contractInterface: contractTypes.project },
    "start"
  );
}

export function useVestingDuration(addressOrName: string) {
  return useContractRead(
    { addressOrName, contractInterface: contractTypes.project },
    "duration"
  );
}

export function useTokenCap(addressOrName: string) {
  return useContractRead(
    { addressOrName, contractInterface: contractTypes.token },
    "cap"
  );
}

export function useAvailableFunds(addressOrName: string) {
  return useContractRead(
    { addressOrName, contractInterface: contractTypes.project },
    "availableFunds"
  );
}

export function useReleasedFunds(addressOrName: string) {
  return useContractRead(
    { addressOrName, contractInterface: contractTypes.project },
    "releasedFunds"
  );
}

export function useWithdrawFunds(
  addressOrName: string,
  props = { onSuccess: Function }
) {
  const cache = useQueryClient();
  const release = useContractWrite(
    { addressOrName, contractInterface: contractTypes.project },
    "withdraw",
    {
      onSuccess: () => {
        cache.invalidateQueries();
        props.onSuccess();
      },
    }
  );

  const tx = useWaitForTransaction({
    hash: release.data?.hash,
    enabled: Boolean(release.data?.hash),
  });

  return { ...release, isLoading: release.isLoading || tx.isLoading };
}

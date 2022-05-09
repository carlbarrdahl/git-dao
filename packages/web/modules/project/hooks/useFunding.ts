import { contractTypes } from "config";
import { useContractRead, useToken } from "wagmi";

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

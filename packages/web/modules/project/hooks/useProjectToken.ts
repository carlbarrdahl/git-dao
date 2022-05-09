import { contractTypes } from "config";
import { useContractRead, useToken } from "wagmi";

export function useProjectToken(addressOrName: string) {
  const { data: address } = useContractRead(
    { addressOrName, contractInterface: contractTypes.project },
    "token"
  );
  // @ts-ignore
  return useToken({ address, skip: !address });
}

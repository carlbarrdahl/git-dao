import { contractTypes } from "config";
import { useContractWrite, useWaitForTransaction } from "wagmi";

export default function useMint(addressOrName: string, props = {}) {
  const mint = useContractWrite(
    { addressOrName, contractInterface: contractTypes.token },
    "mint",
    props
  );

  const tx = useWaitForTransaction({
    hash: mint.data?.hash,
    enabled: Boolean(mint.data?.hash),
  });

  return { ...mint, isLoading: mint.isLoading || tx.isLoading };
}

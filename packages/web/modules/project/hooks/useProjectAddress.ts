import { useContractRead, useNetwork } from "wagmi";

import { contractTypes, contractAddresses } from "config";

export function useContractAddresses() {
  const { activeChain } = useNetwork();

  const addresses = contractAddresses[activeChain?.id || "31337"];
  return addresses;
}
export function useProjectAddress(repo: string) {
  const addresses = useContractAddresses();
  console.log("addresses", addresses);
  return useContractRead(
    {
      addressOrName: addresses.projectFactory,
      contractInterface: contractTypes.projectFactory,
    },
    "projects",
    {
      args: repo,
    }
  );
}

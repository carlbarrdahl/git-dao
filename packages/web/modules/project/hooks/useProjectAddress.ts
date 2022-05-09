import { useContractRead } from "wagmi";

import { PROJECT_FACTORY_ADDRESS, contractTypes } from "config";

export function useProjectAddress(repo: string) {
  return useContractRead(
    {
      addressOrName: PROJECT_FACTORY_ADDRESS,
      contractInterface: contractTypes.projectFactory,
    },
    "projects",
    {
      args: repo,
    }
  );
}

import axios from "lib/axios";
import { useMutation } from "react-query";
import { useContractWrite } from "wagmi";

import { useContractAddresses } from "modules/project/hooks/useProjectAddress";
import { contractTypes } from "config";

type SignatureResponse = { hash: string; signature: string };

export function useCreateRepoSignature() {
  const path = `api/signature`;

  return useMutation(
    [path],
    async (params: { address: string; repo: string }) =>
      axios.post<SignatureResponse>(path, params)
  );
}

export function useCreateProject() {
  const addresses = useContractAddresses();
  return useContractWrite(
    {
      addressOrName: addresses.projectFactory,
      contractInterface: contractTypes.projectFactory,
    },
    "create"
  );
}

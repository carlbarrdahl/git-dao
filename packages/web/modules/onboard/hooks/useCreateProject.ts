import axios from "lib/axios";
import { useMutation } from "react-query";
import { useContractWrite } from "wagmi";

import ProjectFactory from "contracts/ProjectFactory.json";

const PROJECT_FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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
  return useContractWrite(
    {
      addressOrName: PROJECT_FACTORY_ADDRESS,
      contractInterface: ProjectFactory.abi,
    },
    "create"
  );
}

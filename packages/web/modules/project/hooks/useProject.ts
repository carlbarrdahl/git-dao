import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useProvider,
  useSigner,
  useToken,
  useTransaction,
} from "wagmi";
import { useQuery } from "react-query";

import ProjectFactoryABI from "contracts/ProjectFactory.json";
import ProjectABI from "contracts/Project.json";
import ERC20TokenABI from "contracts/ERC20Token.json";

import { Contract } from "ethers";

// const PROJECT_FACTORY_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const PROJECT_FACTORY_ADDRESS = "0x175Ef0447d9878d823E3a93649b517581CF5CaC3";

export function useCreateProject() {
  return useContractWrite(
    {
      addressOrName: PROJECT_FACTORY_ADDRESS,
      contractInterface: ProjectFactoryABI,
    },
    "create"
  );
}

// export function useProjectFactory() {
//   // const provider = useProvider();
//   return useContract({
//     addressOrName: PROJECT_FACTORY_ADDRESS,
//     contractInterface: ProjectFactoryABI,
//     // signerOrProvider: provider,
//   });
// }
// export function useProjectContract(address: string) {
//   const [{ data: signer }] = useSigner();
//   return useContract({
//     addressOrName: address,
//     contractInterface: ProjectABI,
//     signerOrProvider: signer,
//   });
// }

function useProjectFactory(method: string, args?: string | string[]) {
  const [{ data: signer }] = useSigner();
  return useContractRead(
    {
      addressOrName: PROJECT_FACTORY_ADDRESS,
      contractInterface: ProjectFactoryABI,
      signerOrProvider: signer,
    },
    method,
    { args, skip: !signer }
  );
}

export function useProject(
  method: string,
  address: string,
  args?: string | string[]
) {
  const [{ data: signer }] = useSigner();
  return useContractRead(
    {
      addressOrName: address,
      contractInterface: ProjectABI,
      signerOrProvider: signer,
    },
    method,
    { args, skip: !signer }
  );
}

export function useProjectWrite(
  method: string,
  address: string,
  args?: string | string[]
) {
  const [{ data: signer }] = useSigner();
  return useContractWrite(
    {
      addressOrName: address,
      contractInterface: ProjectABI,
      signerOrProvider: signer,
    },
    method,
    { args }
  );
}

// export function useToken(
//   method: string,
//   address: string,
//   args?: string | string[]
// ) {
//   const [{ data: signer }] = useSigner();
//   return useContractRead(
//     {
//       addressOrName: address,
//       contractInterface: erc20ABI,
//       signerOrProvider: signer,
//     },
//     method,
//     { args, skip: !signer }
//   );
// }

function useContract(address: string, abi: any) {
  const provider = useProvider();
  return new Contract(address, abi, provider);
}

// function useToken(address) {
//   const contract = useContract(address, ProjectABI);

//   return useQuery([address, "token"], async () => {});
// }
export function useTokenSupply(address: string) {
  const contract = useContract(address, erc20ABI);
  return useQuery([address, "supply"], async (address) => {
    return contract.totalSupply();
  });
}

export function useProjectAddress(repo: string) {
  return useProjectFactory("projectByRepo", repo);
}
export function useProjectToken(address: string) {
  const [{ data }] = useProject("token", address);
  return useToken({ address: String(data), skip: !data });
}

export function useMint(address: string) {
  const [{ data: signer }] = useSigner();

  console.log("UseMint", address);
  return useContractWrite(
    {
      addressOrName: address,
      contractInterface: ERC20TokenABI,
      signerOrProvider: signer,
    },
    "mint"
  );
}

export function useFundProject(address: string) {
  return useTransaction({});
}

// export function useProject(functionName, args = undefined) {
//   const [{ data: signer }] = useSigner();

//   console.log("useProject", functionName, args);
//   return useContractRead(
//     {
//       addressOrName: PROJECT_FACTORY_ADDRESS,
//       contractInterface: ProjectABI,
//       signerOrProvider: signer,
//     },
//     functionName,
//     { args, skip: !signer }
//   );

//   // console.log("contract", data);

//   // return useQuery(["projects", repo],async  () => {
//   //   const signer = await data?.connector?.getSigner()
//   //   const contract = useProjectFactory()
//   //   // console.log(contract);
//   //   // console.log("repo", repo);
//   //   // return contract.getProject(repo);
//   // });
// }

// export function useVesting(contract) {
//   return useProject("token");
// }

import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";

import { contractTypes } from "config";

import BorderedBox from "components/BorderedBox";
import { useProjectToken } from "../hooks/useProjectToken";

import { useContractEvent, useProvider, useQuery } from "wagmi";
import { Contract } from "ethers";

export function useTokenEvents(tokenAddress: string) {
  const provider = useProvider();
  console.log("useTokenEvents", tokenAddress);
  return useQuery(
    [tokenAddress, "events"],
    async () => {
      const contract = new Contract(
        tokenAddress,
        contractTypes.token,
        provider
      );
      console.log("contract", contract);
      const eventFilter = contract.filters.Transfer(tokenAddress);
      let events = await contract.queryFilter(eventFilter);
      console.log("events", events, eventFilter);
      return events;
    },
    { enabled: !!tokenAddress }
  );
}

export default function TokenHolders({ address }: { address: string }) {
  const { data } = useProjectToken(address);

  console.log("useProjectToken", data);

  const events = useTokenEvents(data?.address);
  return <BorderedBox>TokenHolders</BorderedBox>;
}

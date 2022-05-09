import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import BorderedBox from "components/BorderedBox";
import { useProjectToken } from "../hooks/useProjectToken";

export default function TokenSupply({ address }: { address: string }) {
  const { data } = useProjectToken(address);
  return (
    <BorderedBox>
      <Stat>
        <StatLabel>Token supply</StatLabel>
        <StatNumber>{data?.totalSupply.formatted}</StatNumber>
        <StatHelpText>Max: {"1M"}</StatHelpText>
      </Stat>
    </BorderedBox>
  );
}

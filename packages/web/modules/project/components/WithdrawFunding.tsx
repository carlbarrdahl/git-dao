import {
  Button,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import BorderedBox from "components/BorderedBox";
import ErrorMessage from "components/ErrorMessage";
import {
  useWithdrawFunds,
  useAvailableFunds,
  useReleasedFunds,
} from "../hooks/useFunding";

function round(value = 0, decimals = 6) {
  return (
    Math.round(Number(ethers.utils.formatUnits(value)) * 10 ** decimals) /
    10 ** decimals
  );
}

export default function WithdrawFunding({ address }: { address: string }) {
  const funds = useAvailableFunds(address);
  const released = useReleasedFunds(address);
  const withdraw = useWithdrawFunds(address);
  console.log("funds", funds.data, funds.error);

  return (
    <BorderedBox>
      <Stat>
        <StatLabel>Available for withdrawal</StatLabel>
        <StatNumber>{round(funds.data)}</StatNumber>
        <StatHelpText>Withdrawn: {round(released.data)}</StatHelpText>
      </Stat>
      <ErrorMessage error={funds.error} />
      <Button
        w="100%"
        colorScheme={"purple"}
        onClick={() => withdraw.write()}
        isLoading={withdraw.isLoading}
      >
        Withdraw
      </Button>
    </BorderedBox>
  );
}

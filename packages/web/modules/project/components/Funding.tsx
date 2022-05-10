import { addSeconds, format } from "date-fns";

import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import {
  useFundedAmount,
  useVestingDuration,
  useVestingStart,
} from "../hooks/useFunding";
import { ethers } from "ethers";
import BorderedBox from "components/BorderedBox";

const formatDate = (d: Date) => format(d, "yyyy-MM-dd");

export default function Funding({ address }: { address: string }) {
  const { data: start } = useVestingStart(address);
  const { data: duration } = useVestingDuration(address);
  const { data: funded } = useFundedAmount(address);
  if (!start || !duration || !funded) return null;

  // @ts-ignore
  const end = addSeconds(new Date(), duration);

  return (
    <>
      <BorderedBox>
        <Stat>
          <StatLabel>Funding</StatLabel>
          <StatNumber>{ethers.utils.formatUnits(funded)}</StatNumber>
          <StatHelpText>
            {/* @ts-ignore */}
            Vesting: {formatDate(new Date(start * 1000))} - {formatDate(end)}
          </StatHelpText>
        </Stat>
      </BorderedBox>
    </>
  );
}

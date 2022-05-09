import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useAccount, useBalance, useSendTransaction } from "wagmi";

import BorderedBox from "components/BorderedBox";

interface Props {
  address: string;
}
export default function SendETH({ address }: Props) {
  const account = useAccount({});
  const { data: balance } = useBalance({
    addressOrName: account.data?.address,
  });

  const { isLoading, sendTransactionAsync } = useSendTransaction();

  const { register, reset, setValue, handleSubmit, formState } = useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        amount: z.number().min(0, { message: "required" }),
      })
    ),
  });

  function handleMax() {
    setValue("amount", balance?.formatted);
  }

  return (
    <form
      onSubmit={handleSubmit(({ amount }) => {
        console.log(amount);
        sendTransactionAsync({
          request: {
            to: address,
            value: ethers.utils.parseEther(String(amount)),
          },
        }).then(reset);
      })}
    >
      <BorderedBox>
        <InputGroup>
          <InputLeftElement mt={1} pointerEvents="none">
            <Text fontSize={"xs"}>ETH</Text>
          </InputLeftElement>
          <Input
            size="lg"
            placeholder="0.00"
            border="none"
            type="number"
            {...register("amount", { valueAsNumber: true })}
          />
          <InputRightElement>
            <Button size="sm" onClick={handleMax}>
              Max
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text ml={2} color="gray.500" fontSize={"xs"}>
          Balance: {balance?.formatted}
        </Text>
      </BorderedBox>
      <Button
        disabled={isLoading || !formState.isValid}
        isLoading={isLoading}
        colorScheme="purple"
        w="100%"
        mt={2}
        type="submit"
      >
        Send ETH
      </Button>
    </form>
  );
}

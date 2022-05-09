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
import { useQueryClient } from "react-query";

import BorderedBox from "components/BorderedBox";
import ErrorMessage from "components/ErrorMessage";

interface Props {
  address: string;
}
export default function SendETH({ address }: Props) {
  const account = useAccount({});
  const { data: balance } = useBalance({
    addressOrName: account.data?.address,
  });

  const cache = useQueryClient();
  const { isLoading, error, sendTransaction } = useSendTransaction({
    onSuccess() {
      cache.invalidateQueries();
      reset();
    },
  });

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
        sendTransaction({
          request: {
            to: address,
            value: ethers.utils.parseEther(String(amount)),
          },
        });
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
            min="0"
            step="0.0000000001"
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
      <ErrorMessage error={error} />
      <Button
        disabled={isLoading || !formState.isValid}
        isLoading={isLoading}
        colorScheme="purple"
        w="100%"
        mt={2}
        type="submit"
      >
        Fund project
      </Button>
    </form>
  );
}

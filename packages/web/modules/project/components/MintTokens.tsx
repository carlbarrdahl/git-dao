import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "react-query";

import BorderedBox from "components/BorderedBox";
import ErrorMessage from "components/ErrorMessage";
import { useProjectToken } from "../hooks/useProjectToken";
import useMint from "../hooks/useMint";

export default function MintTokens({ address }: { address: string }) {
  const { data } = useProjectToken(address);

  const { register, reset, handleSubmit, formState } = useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        to: z
          .string()
          .regex(/^0x[0-9a-fA-F]{40}$/, { message: "Must be a valid address" }),
        amount: z.number().min(0, { message: "Must be a value > 0" }),
      })
    ),
  });

  const cache = useQueryClient();
  const mint = useMint(data?.address, {
    onSuccess: (data) => {
      console.log("Mint success", data);
      reset();
      cache.invalidateQueries();
    },
  });

  return (
    <BorderedBox>
      <form
        onSubmit={handleSubmit(({ to, amount }) => {
          mint.write({ args: [to, ethers.utils.parseEther(String(amount))] });
        })}
      >
        <FormControl isInvalid={!!formState.errors.to}>
          <FormLabel mb={2}>
            <Text textTransform={"uppercase"} fontSize="xs">
              To
            </Text>

            <Input placeholder="0x..." {...register("to")} />
            <FormErrorMessage>{formState.errors.to?.message}</FormErrorMessage>
          </FormLabel>
        </FormControl>
        <FormControl isInvalid={!!formState.errors.amount}>
          <FormLabel mb={2}>
            <Text textTransform={"uppercase"} fontSize="xs">
              Amount
            </Text>
            <Input
              placeholder="0.00"
              type="number"
              min="0"
              step="0.0000000001"
              {...register("amount", { valueAsNumber: true })}
            />
            <FormErrorMessage>
              {formState.errors.amount?.message}
            </FormErrorMessage>
          </FormLabel>
        </FormControl>
        <ErrorMessage error={mint.error} />
        <Button
          type="submit"
          w="100%"
          colorScheme={"purple"}
          mt={2}
          disabled={mint.isLoading || !formState.isValid}
          isLoading={mint.isLoading}
        >
          Mint to address
        </Button>
      </form>
    </BorderedBox>
  );
}

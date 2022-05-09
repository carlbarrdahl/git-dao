import {
  Box,
  Flex,
  FormLabel,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useContractRead, useContractWrite } from "wagmi";

import BorderedBox from "components/BorderedBox";

interface Props {
  name: string;
  address: string;
  abi: [];
  devdoc: {};
  userdoc: {};
}

function createResolver(inputs) {
  return zodResolver(
    z.object(
      inputs.reduce(
        (acc, x) => ({ ...acc, [x.name]: getValidation(x.type) }),
        {}
      )
    )
  );
}
const getValidation = (type) => {
  const validations = {
    address: z
      .string()
      .regex(/^0x[0-9a-fA-F]{40}$/, { message: "Must be a valid address" }),
    uint8: z.number().min(0).max(255),
  };
  return validations[type] || z.string();
};

const ContractFunction = ({
  address,
  abi,
  name,
  inputs,
  params,
  details,
  notice,
  ...rest
}) => {
  const { register, handleSubmit, formState } = useForm({
    mode: "onChange",
    resolver: createResolver(inputs),
  });

  // TODO: Check stateMutability if read (pure or view) or write (payable or nonpayable)
  const { data, write } = useContractWrite(
    {
      addressOrName: address,
      contractInterface: abi,
    },
    name
  );

  return (
    <BorderedBox
      as="form"
      mb={3}
      onSubmit={handleSubmit((form) => console.log(Object.values(form)))}
    >
      <Heading as="h5" fontSize="lg">
        {name}
      </Heading>
      <Text mb={2}>{notice}</Text>
      {inputs.map((input) => {
        const error = formState.errors[input.name];
        return (
          <FormControl
            key={input.name}
            as="fieldset"
            mb={3}
            isInvalid={!!error}
          >
            <FormLabel htmlFor={input.name}>
              {input.name}
              {!error ? (
                <FormHelperText>
                  {params[input.name]} ({input.type})
                </FormHelperText>
              ) : (
                <FormErrorMessage>{error.message}</FormErrorMessage>
              )}
            </FormLabel>
            <Input
              id={input.name}
              {...register(input.name, {
                valueAsNumber: input.type.includes("uint"),
              })}
            />
          </FormControl>
        );
      })}
      <Button type="submit">Send</Button>
    </BorderedBox>
  );
};

export default function Contract({
  name,
  address,
  abi,
  devdoc,
  userdoc,
}: Props) {
  console.log(abi, devdoc, userdoc);

  // TODO: Move to function and build better object from outside component
  const doc = abi.map(({ name, inputs, outputs, type }) => {
    const types = inputs.map((i) => i.type).join(",");
    return {
      name,
      inputs,
      outputs,
      type,
      ...devdoc.methods[`${name}(${types})`],
      ...userdoc.methods[`${name}(${types})`],
    };
  });

  console.log("doc", doc);
  return (
    <BorderedBox>
      <Heading as="h3" fontSize={"2xl"} mb={2}>
        {name}
      </Heading>
      <Text mb={2}>{devdoc.title}</Text>
      <Text mb={2}>{userdoc.notice}</Text>
      {doc
        .filter(({ type }) => type === "function")
        .map((method) => (
          <ContractFunction
            key={method.name}
            address={address}
            abi={abi}
            {...method}
          ></ContractFunction>
        ))}
    </BorderedBox>
  );
}

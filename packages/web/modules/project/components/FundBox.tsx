import React, { useState } from "react";

import {
  Button,
  Box,
  Text,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { useFundProject } from "../hooks/useProject";
import { ethers } from "ethers";
import { useAccount, useBalance } from "wagmi";

function FundBox({ address }) {
  const [amount, setAmount] = useState("");
  const [{ loading, error }, fund] = useFundProject(address);
  const [{ data }] = useAccount({});
  const [{ data: balance }] = useBalance({
    addressOrName: data?.address,
    skip: !data?.address,
  });

  function handleMax() {
    setAmount(balance?.formatted);
  }
  function handleChange(e) {
    const { value } = e.target;
    setAmount(value || "");
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fund({
          request: { to: address, value: ethers.utils.parseEther(amount) },
        }).then(({ data }) => {
          setAmount("");
        });
      }}
    >
      <Box
        borderWidth={1}
        borderColor="gray.300"
        borderRadius="md"
        px={3}
        py={2}
      >
        <InputGroup>
          <InputLeftElement mt={1} pointerEvents="none">
            <Text fontSize={"xs"}>ETH</Text>
          </InputLeftElement>
          <Input
            size="lg"
            placeholder="0.00"
            border="none"
            type="number"
            value={amount ? amount : ""}
            onChange={handleChange}
          />
          <InputRightElement>
            <Button size="sm" onClick={handleMax}>
              Max
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text ml={2} color="gray.500" fontSize={"xs"}>
          Balance: {balance?.formatted.slice(0, 8)}
        </Text>
      </Box>
      <Button
        disabled={loading}
        isLoading={loading}
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

export default FundBox;

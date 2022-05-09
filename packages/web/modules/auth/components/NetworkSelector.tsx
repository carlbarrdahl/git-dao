import {
  Button,
  Flex,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useNetwork } from "wagmi";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SiEthereum } from "react-icons/si";
import { useMountedState } from "react-use";

export default function NetworkSelector() {
  const isMounted = useMountedState();
  const {
    activeChain,
    chains,
    error,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useNetwork();

  if (isLoading) {
    return (
      <Flex
        width={"40px"}
        height="40px"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size={"md"} />
      </Flex>
    );
  }

  if (error) {
    return <pre>{error.message}</pre>;
  }
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="outline"
        leftIcon={<SiEthereum />}
        rightIcon={<ChevronDownIcon />}
      >
        {activeChain?.name}
      </MenuButton>
      <MenuList>
        {chains.map((chain) => (
          <MenuItem
            key={chain.id}
            onClick={() => switchNetwork && switchNetwork(chain.id)}
          >
            {chain.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

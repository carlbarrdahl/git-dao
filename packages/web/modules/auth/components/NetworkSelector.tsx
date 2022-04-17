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

export default function NetworkSelector() {
  const [{ data, error, loading }, switchNetwork] = useNetwork();

  if (loading) {
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
        {data?.chain?.name}
      </MenuButton>
      <MenuList>
        {data.chains.map((chain) => (
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

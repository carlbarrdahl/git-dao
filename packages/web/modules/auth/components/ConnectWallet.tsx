import { Button, Flex, Spinner } from "@chakra-ui/react";
import { useAccount, useConnect } from "wagmi";
import Avatar from "boring-avatars";

import { truncate } from "utils/truncate";

function ConnectedAccount({ address, onDisconnect }) {
  return (
    <Button
      variant="outline"
      onClick={onDisconnect}
      leftIcon={<Avatar size={20} name={address} />}
    >
      {truncate(address)}
    </Button>
  );
}

export default function ConnectWallet() {
  const [{ data: account }, disconnect] = useAccount();
  const [{ data, error, loading }, connect] = useConnect();

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
  const { address } = account || {};

  return address ? (
    <ConnectedAccount address={address} onDisconnect={disconnect} />
  ) : (
    <Button onClick={() => connect(data.connectors[0])}>Connect wallet</Button>
  );
}

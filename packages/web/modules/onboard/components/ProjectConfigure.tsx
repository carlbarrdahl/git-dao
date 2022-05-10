import { useAccount } from "wagmi";

import {
  Box,
  Flex,
  Button,
  Text,
  Heading,
  Input,
  Divider,
  FormLabel,
} from "@chakra-ui/react";

import ConnectWallet from "modules/auth/components/ConnectWallet";
import {
  useCreateProject,
  useCreateRepoSignature,
} from "../hooks/useCreateProject";
import ErrorMessage from "components/ErrorMessage";

interface Props {
  repo: string;
  onSuccess: () => void;
}

export default function ProjectConfigure({ repo, onSuccess }: Props) {
  const { data: account } = useAccount();
  const project = useCreateProject();
  const sig = useCreateRepoSignature();

  const address = account?.address || "";

  console.log("project", project);
  console.log("sig", sig);
  function handleCreate() {
    console.log("Getting signature from API...");
    sig.mutate(
      { repo, address },

      {
        onSuccess: async (data) => {
          console.log("Creating project...");
          return (
            project
              .writeAsync({
                args: [repo, data.hash, data.signature],
                overrides: { gasLimit: 4000000 },
              })
              // Redirect to project page when tx is confirmed
              .then(({ wait }) => wait().then(onSuccess))
          );
        },
      }
    );
  }

  console.log("error", project.error, sig.error);
  return (
    <Box
      borderRadius={6}
      borderWidth={1}
      borderColor="gray.200"
      boxShadow={"2xl"}
      width={"2xl"}
      p={6}
    >
      <Heading fontSize={"2xl"}>Configure project</Heading>
      <Divider my={4} />

      {!address ? (
        <Flex justify={"center"}>
          <ConnectWallet />
        </Flex>
      ) : null}

      <FormLabel mb={6}>
        <Text textTransform={"uppercase"} fontSize="xs" mb={2}>
          Project name
        </Text>
        <Input value={repo} disabled />
      </FormLabel>

      <FormLabel mb={6}>
        <Text textTransform={"uppercase"} fontSize="xs" mb={2}>
          Vesting duration
        </Text>
        <Input value={3600 * 24 * 365} disabled />
      </FormLabel>
      <ErrorMessage error={project.error} />
      <ErrorMessage error={sig.error} />

      <Button
        w="100%"
        colorScheme="purple"
        isLoading={project.isLoading}
        loadingText="Creating..."
        disabled={!address || project.isLoading}
        onClick={handleCreate}
      >
        Create
      </Button>
    </Box>
  );
}

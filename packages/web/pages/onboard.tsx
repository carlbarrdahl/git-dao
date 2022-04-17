import type { NextPage } from "next";
import { useAccount } from "wagmi";

import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Layout from "layouts/Layout";
import { useCreateProject } from "modules/project/hooks/useProject";
import ConnectGithub from "modules/auth/components/ConnectGithub";
import { useSession } from "next-auth/react";
import {
  Box,
  Flex,
  Button,
  StackDivider,
  VStack,
  Text,
  HStack,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Container,
  Divider,
  FormLabel,
} from "@chakra-ui/react";

import { FiSearch } from "react-icons/fi";
import { AiFillGithub } from "react-icons/ai";
import { useState } from "react";
import { fromToday } from "utils/date";
import Link from "next/link";
import { useUserRepos } from "modules/project/hooks/useGithub";
import ConnectWallet from "modules/auth/components/ConnectWallet";

interface Props {
  onSelect: (repo: string) => void;
}
function RepoList({ onSelect }: Props) {
  const { data: repos = [], error, isLoading } = useUserRepos();
  const [filter, setFilter] = useState("");

  return (
    <>
      <Heading fontSize={"2xl"} mb={4}>
        Select Git Repository
      </Heading>

      <InputGroup mb={4}>
        <InputLeftElement color="gray.500">
          <FiSearch />
        </InputLeftElement>
        <Input
          placeholder="Search"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
      </InputGroup>
      <VStack
        py={4}
        borderRadius={4}
        borderWidth="1px"
        borderColor={"gray.200"}
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        {repos
          .filter((repo) => !repo.private)
          .sort((a, b) =>
            new Date(a.pushed_at) < new Date(b.pushed_at) ? 1 : -1
          )
          .filter((repo) => repo.name.includes(filter))
          .slice(0, 5)
          .map((repo) => (
            <HStack
              fontSize={"sm"}
              key={repo.full_name}
              px={4}
              justify="space-between"
            >
              <HStack divider={<Text px={1}>·</Text>}>
                <Text fontWeight={600}>{repo.name}</Text>
                <Text color="gray.500">{fromToday(repo.pushed_at)}</Text>
              </HStack>
              <Button onClick={() => onSelect(repo.full_name)}>Select</Button>
            </HStack>
          ))}
      </VStack>
    </>
  );
}

const Onboard: NextPage = ({}) => {
  const { data: session, status } = useSession();

  console.log("sess", session);
  const router = useRouter();
  const [{ data: account }] = useAccount({});
  const [{ data, error, loading }, create] = useCreateProject();

  const address = account?.address;
  const repo = router.query.repo;

  function handleSelectRepo(repo: string) {
    console.log("handleSelectRepo", repo, account);

    router.push(`/onboard?repo=${encodeURI(repo)}`);
  }

  function handleCreate() {
    create({
      args: [address, repo, 3600 * 24 * 365],
      overrides: { gasLimit: 4000000 },
    }).then(({ data }) =>
      data?.wait().then((tx) => {
        router.push(`/${repo}`);
      })
    );
  }

  if (repo) {
    return (
      <Layout>
        <Box mb={16}>
          <Link href="/onboard" passHref>
            <Button mb={4} variant="ghost" leftIcon={<ChevronLeftIcon />}>
              Back
            </Button>
          </Link>
          <Heading fontSize={"5xl"} mb={4}>
            Configure Project
          </Heading>
          <Text color="gray.600">
            Connect your wallet and follow the steps to configure your project.
          </Text>
        </Box>

        <Flex justify={"center"} flex={"1 100%"}>
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
                Owner
              </Text>
              <Input value={address} />
            </FormLabel>
            <FormLabel mb={6}>
              <Text textTransform={"uppercase"} fontSize="xs" mb={2}>
                Project name
              </Text>
              <Input value={router.query.repo} disabled />
            </FormLabel>
            <FormLabel mb={6}>
              <Text textTransform={"uppercase"} fontSize="xs" mb={2}>
                Vesting duration
              </Text>
              <Input value={3600 * 24 * 365} disabled />
            </FormLabel>

            <Button
              w="100%"
              colorScheme="purple"
              isLoading={loading}
              loadingText="Creating..."
              disabled={!address || loading}
              onClick={handleCreate}
            >
              Create
            </Button>
          </Box>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading fontSize={"5xl"} mb={4}>
        Onboard new project
      </Heading>
      <Text color="gray.600" mb={16}>
        To setup a new project, login with Github and select a Repository.
      </Text>
      <Container maxW={"container.md"}>
        <Card>
          {session ? (
            <RepoList onSelect={handleSelectRepo} />
          ) : (
            <Flex justify={"center"}>
              <ConnectGithub />
            </Flex>
          )}
        </Card>
      </Container>
    </Layout>
  );
};

const Card = (props) => (
  <Box
    borderRadius={6}
    borderWidth={1}
    borderColor="gray.200"
    boxShadow={"2xl"}
    width={"2xl"}
    p={6}
    {...props}
  />
);

export default Onboard;

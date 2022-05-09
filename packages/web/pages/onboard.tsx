import type { NextPage } from "next";

import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Layout from "components/Layout";
import ConnectGithub from "modules/auth/components/ConnectGithub";
import { useSession } from "next-auth/react";
import { Box, Flex, Button, Text, Heading, Container } from "@chakra-ui/react";

import Link from "next/link";
import RepoList from "modules/onboard/components/RepoList";
import ProjectConfigure from "modules/onboard/components/ProjectConfigure";
import Card from "components/Card";

const Onboard: NextPage = ({}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const repo = router.query.repo as string;

  function handleSelectRepo(repo: string) {
    router.push(`/onboard?repo=${encodeURI(repo)}`);
  }
  function handleProjectCreated() {
    router.push(`/${repo}`);
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
            {session ? null : (
              <Flex justify={"center"} mb={6}>
                <ConnectGithub />
              </Flex>
            )}
          </Text>
        </Box>
        <Flex justify={"center"} flex={"1 100%"}>
          <ProjectConfigure repo={repo} onSuccess={handleProjectCreated} />
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

export default Onboard;

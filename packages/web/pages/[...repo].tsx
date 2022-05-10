import type { NextPage } from "next";

import { useRouter } from "next/router";
import Layout from "components/Layout";
import {
  Box,
  Button,
  Text,
  Heading,
  Grid,
  HStack,
  Divider,
} from "@chakra-ui/react";
import Markdown from "components/Markdown";
import { useGithubContent } from "modules/project/hooks/useGithubContent";
import { useProjectAddress } from "modules/project/hooks/useProjectAddress";
import Link from "next/link";
import Funding from "modules/project/components/Funding";
import Fund from "modules/project/components/Fund";
import TokenSupply from "modules/project/components/TokenSupply";
import MintTokens from "modules/project/components/MintTokens";
import WithdrawFunding from "modules/project/components/WithdrawFunding";

const GithubContent = ({
  repo,
  content,
}: {
  repo: string;
  content: string;
}) => {
  const router = useRouter();
  const { data = "", error } = useGithubContent({ repo, content });

  if (error?.status === 404) {
    router.replace("/404");
    return <pre>404: not found</pre>;
  }
  return <Markdown>{data}</Markdown>;
};

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const ProjectDetails = ({ repo }: { repo: string }) => {
  const { data, error } = useProjectAddress(repo);

  const address = String(data);

  if (!address || address === NULL_ADDRESS) {
    return (
      <Box>
        <Text>No project found</Text>
        <Link href={`/onboard?repo=${repo}`} passHref>
          <Button>Onboard project</Button>
        </Link>
      </Box>
    );
  }
  return (
    <Box>
      <Funding address={address} />
      <Divider my={4} borderColor="white" />
      <WithdrawFunding address={address} />
      <Divider my={4} borderColor="white" />
      <TokenSupply address={address} />
      <Divider my={4} borderColor="white" />
      <Fund address={address} />
      <Divider my={4} borderColor="white" />
      <MintTokens address={address} />
    </Box>
  );
};

const ProjectPage: NextPage = ({}) => {
  const router = useRouter();

  const repo = ((router.query.repo || [""]) as string[]).join("/");
  if (!repo) {
    return null;
  }
  return (
    <Layout>
      <HStack justify={"space-between"}>
        <Box>
          <Heading fontSize={"5xl"} mb={4}>
            {repo}
          </Heading>
        </Box>
        <Link href={`https://github.com/${repo}`} passHref>
          <Button as="a" target="_blank">
            Visit Github
          </Button>
        </Link>
      </HStack>
      <Text color="gray.600" mb={8}></Text>
      <Grid templateColumns={["auto", "auto", "auto 320px"]} gap={8}>
        <Box>
          <GithubContent repo={repo} content="README.md" />
        </Box>
        <Box>
          <ProjectDetails repo={repo} />
        </Box>
      </Grid>
    </Layout>
  );
};

export default ProjectPage;

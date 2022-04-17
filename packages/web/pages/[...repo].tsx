import type { NextPage } from "next";

import Layout from "layouts/Layout";
import Link from "next/link";
import {
  useFundProject,
  useMint,
  useProject,
  useProjectAddress,
  useProjectToken,
} from "modules/project/hooks/useProject";
import { addSeconds, format } from "date-fns";
import { useState } from "react";
import { ethers } from "ethers";
import {
  useGithubRepo,
  useGithubContent,
} from "modules/project/hooks/useGithub";
import Markdown from "components/Markdown";
import {
  Heading,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
  Grid,
  Box,
  Divider,
  HStack,
  ButtonGroup,
  Text,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import FundBox from "modules/project/components/FundBox";

const formatDate = (d: Date) => format(d, "yyyy-MM-dd");

const VestingStart = ({ address }) => {
  const [{ data: start }] = useProject("start", address);
  const [{ data: duration }] = useProject("duration", address);
  const [{ data: funding }] = useProject("fundedAmount", address);
  if (!start || !duration || !funding) return null;

  const end = addSeconds(new Date(), duration?.toNumber());
  return (
    <div>
      <Stat>
        <StatLabel>Funding</StatLabel>
        <StatNumber>{ethers.utils.formatUnits(funding)}</StatNumber>
        <StatHelpText>
          {formatDate(new Date(start.toNumber() * 1000))} - {formatDate(end)}
        </StatHelpText>
      </Stat>
    </div>
  );
};
const Funding = ({ address }) => {
  const [{ data, error }] = useProject("fundedAmount", address);
  if (!data) return null;
  return <div>Funding: {ethers.utils.formatUnits(data)}</div>;
};

const VestingDuration = ({ address }) => {
  const [{ data, error }] = useProject("duration", address);
  if (!data) return null;
  const duration = addSeconds(new Date(), data?.toNumber());
  return <div>Vesting duration: {formatDate(duration)}</div>;
};

const MintTokens = ({ address }) => {
  const [{ to, amount }] = useState({
    to: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    amount: ethers.utils.parseEther("0.1"),
  });
  const [, mint] = useMint(address);
  return (
    <div>
      Mint tokens
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(mint);
          mint({ args: [to, amount] })
            .then(console.log)
            .catch(console.error);
        }}
      >
        <Input placeholder="Address" value={to} />
        <Input placeholder="Amount" value={amount} />
        <Button type="submit" w="100%" colorScheme={"purple"} mt={2}>
          Mint
        </Button>
      </form>
    </div>
  );
};

const FundProject = ({ address }) => {
  const [{ amount }] = useState({
    amount: "0.1",
    // amount: ethers.utils.parseEther("0.1"),
  });
  const [, fund] = useFundProject(address);
  return (
    <div>
      Fund project
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fund({ request: { to: address, value: amount } })
            .then(console.log)
            .catch(console.error);
        }}
      >
        <FormControl>
          <InputGroup>
            <Input placeholder="Amount" value={amount} />
            <InputRightElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
            >
              ETH
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button colorScheme={"purple"} w="100%" type="submit">
          Fund
        </Button>
      </form>
    </div>
  );
};

const TokenSupply = ({ address }) => {
  const [{ data }] = useProjectToken(address);
  console.log("token supply", data);

  return (
    <Stat>
      <StatLabel>Token supply</StatLabel>
      <StatNumber>{data?.totalSupply.formatted}</StatNumber>
      <StatHelpText>Max: {"1M"}</StatHelpText>
    </Stat>
  );
  return <div>Token supply: {data?.totalSupply.formatted} / 1M</div>;
};

const Project = ({ address, repo }) => {
  const [{ data }] = useProjectToken(address);

  console.log("projectToken", data);
  // const contract = useContract(address);
  // const [{ data: vesting, error }] = useProject("start", address);
  return (
    <div>
      <h3>{repo}</h3>
      <small>
        <pre>{address}</pre>
      </small>
      <a
        target={"_blank"}
        href={`https://github.com/${repo}`}
        rel="noreferrer"
      >{`https://github.com/${repo}`}</a>
      <div>Details</div>
      <ul>
        <li>beneficiary</li>
        <li>address</li>
        <li>
          <TokenSupply address={address} />
        </li>
        <li>token distribution</li>
        <li>
          <VestingStart address={address} />
        </li>
        <li>
          <VestingDuration address={address} />
        </li>
        <li>
          <Funding address={address} />
        </li>
      </ul>
      <div>Actions</div>
      <ul>
        <li>{data?.address ? <MintTokens address={data.address} /> : null}</li>
        <li>{<FundProject address={address} />}</li>
        <li>Provide liquidity</li>
      </ul>
    </div>
  );
};

const GithubContent = ({ repo, content }) => {
  const { data = "", loading } = useGithubContent(repo, content);
  return (
    <Skeleton isLoaded={!loading}>
      <Markdown>{data}</Markdown>
    </Skeleton>
  );
};

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const ProjectDetails = ({ repo }) => {
  const [{ data }] = useProjectAddress(repo);

  if (!data) return null;
  if (data === NULL_ADDRESS) {
    return <div>No project found</div>;
  }
  return (
    <Box>
      <FundBox address={data} />
      <Divider my={4} />
      <VestingStart address={data} />
      <Divider my={4} />
      <TokenSupply address={data} />
      {/* <Divider my={4} /> */}
      {/* <MintTokens address={data} /> */}
      {/* <FundProject address={data} /> */}
    </Box>
  );
};

const ProjectPage: NextPage = ({ repo }) => {
  return (
    <Grid templateColumns={["auto", "auto", "auto 18rem"]} gap={8}>
      <Box>
        <HStack justify={"space-between"}>
          <Box>
            <Heading fontSize="4xl">{repo}</Heading>

            {/* <Text>{address}</Text> */}
          </Box>
          <ButtonGroup>
            <Link href={`https://github.com/${repo}`} passHref>
              <Button as="a" target="_blank">
                Visit Github
              </Button>
            </Link>
          </ButtonGroup>
        </HStack>
        <Divider my={5} />
        <GithubContent key="1" repo={repo} content="README.md" />
      </Box>

      <Box>
        <ProjectDetails repo={repo} />
      </Box>
    </Grid>
  );
};

ProjectPage.getInitialProps = async (ctx) => {
  return { repo: ctx.query.repo.join("/") };
};

ProjectPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProjectPage;

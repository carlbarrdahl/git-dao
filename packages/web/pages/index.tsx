import type { NextPage } from "next";

import Layout from "components/Layout";
import { Box, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import Link from "next/link";
import { useGithubContent } from "modules/project/hooks/useGithubContent";

const projects = ["carlbarrdahl/git-dao"];
const Landing: NextPage = ({}) => {
  return (
    <Layout>
      <Heading mb={8}>Browse projects</Heading>
      <SimpleGrid columns={[1, 1, 2, 3, 4]}>
        {projects.map((repo) => (
          <ProjectCard repo={repo} key={repo} />
        ))}
      </SimpleGrid>
    </Layout>
  );
};

function ProjectCard({ repo }) {
  const { data } = useGithubContent({
    repo,
    content: ".gitdao/screenshot.png",
    responseType: "arraybuffer",
  });

  let imgSrc;

  try {
    console.log(data);
    imgSrc = `data:${"image/png"};base64,${Buffer.from(
      data || "",
      "binary"
    ).toString("base64")}`;
  } catch (error) {
    console.log(error);
  }
  return (
    <Link href={`/${repo}`} passHref>
      <Box as="a" boxShadow={"2xl"} borderWidth={1} borderColor={"gray.300"}>
        <Image alt={repo} fit={"cover"} src={imgSrc} minH={300} />
        <Box p={4}>
          <Heading fontSize="md">{repo}</Heading>
        </Box>
      </Box>
    </Link>
  );
}

export default Landing;

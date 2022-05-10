import type { NextPage } from "next";

import Layout from "components/Layout";
import { Box, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import Link from "next/link";

const projects = [
  {
    repo: "carlbarrdahl/git-dao",
    img: "https://raw.githubusercontent.com/carlbarrdahl/git-dao/master/.gitdao/screenshot.png",
  },
  {
    repo: "carlbarrdahl/kaly",
    img: "https://kaly.vercel.app/kaly.jpg",
  },
];
const Landing: NextPage = ({}) => {
  return (
    <Layout>
      <Heading mb={8}>Browse projects</Heading>
      <SimpleGrid columns={[1, 1, 2, 3, 4]} spacing={16}>
        {projects.map((project) => (
          <ProjectCard key={project.repo} {...project} />
        ))}
      </SimpleGrid>
    </Layout>
  );
};

function ProjectCard({ repo, img }) {
  return (
    <Link href={`/${repo}`} passHref>
      <Box as="a" boxShadow={"xl"} borderWidth={1} borderColor={"gray.300"}>
        <Image alt={repo} fit={"cover"} src={img} />
        <Box p={4}>
          <Heading fontSize="md">{repo}</Heading>
        </Box>
      </Box>
    </Link>
  );
}

export default Landing;

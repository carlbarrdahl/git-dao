import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { DefaultSeo } from "next-seo";

import NetworkSelector from "modules/auth/components/NetworkSelector";
import ConnectWallet from "modules/auth/components/ConnectWallet";

interface Props {
  children: React.ReactNode;
  title?: string;
}
const maxWidth = "container.xl";
export default function Layout({ children, title = "Git DAO" }: Props) {
  const borderColor = useColorModeValue("gray.100", "gray.700");

  title = "Git DAO - Tokenize your GitHub project";
  const description = "Create a DAO from your GiHub repo";
  const url = "https://git-dao.vercel.app";
  return (
    <>
      <Head>
        <meta name="description" content="Decentralized powered by Ceramic" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description,
          images: [
            {
              url: `${url}/gitdao.jpg`,
              width: 1024,
              height: 537,
              alt: "Git DAO",
              type: "image/jpeg",
            },
          ],
          type: "website",
          site_name: "Git DAO",
        }}
        twitter={{
          handle: "@CarlBarrdahl",
          site: "@CarlBarrdahl",
          cardType: "summary_large_image",
        }}
      />
      <Flex flexDir={"column"} minH={"100vh"}>
        <Flex as="header" borderBottom={"1px solid"} borderColor={borderColor}>
          <Flex as={Container} maxW={maxWidth} justify="space-between" py={4}>
            <HStack>
              <Link href={"/"} passHref>
                <Heading as="a">Git DAO</Heading>
              </Link>

              <NavLink href={"/onboard"}>New project</NavLink>
            </HStack>
            <HStack>
              <NetworkSelector />
              <ConnectWallet />
            </HStack>
          </Flex>
        </Flex>
        <Box bg="white" flex={1}>
          <Container maxW={maxWidth} pt={14} pb={24}>
            {children}
          </Container>
        </Box>
        <Box as="footer" py={32} bg={"gray.900"} />
      </Flex>
    </>
  );
}

function NavLink({ href, ...props }) {
  return (
    <Link href={href} passHref>
      <Button variant={"ghost"} {...props} />
    </Link>
  );
}

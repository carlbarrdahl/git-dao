import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import NetworkSelector from "modules/auth/components/NetworkSelector";
import ConnectWallet from "modules/auth/components/ConnectWallet";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  title?: string;
}
const maxWidth = "container.xl";
export default function Layout({ children, title = "gitDAO" }: Props) {
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex flexDir={"column"} minH={"100vh"}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="header" borderBottom={"1px solid"} borderColor={borderColor}>
        <Flex as={Container} maxW={maxWidth} justify="space-between" py={4}>
          <Link href={"/"}>
            <Heading>{title}</Heading>
          </Link>
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
  );
}

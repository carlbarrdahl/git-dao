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

interface Props {
  children: React.ReactNode;
  title?: string;
}
const maxWidth = "container.xl";
export default function Layout({ children, title = "Git DAO" }: Props) {
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box>
      <Head>
        <title>{title}</title>
        <meta name="description" content="..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="header" borderBottom={"1px solid"} borderColor={borderColor}>
        <Flex as={Container} maxW={maxWidth} justify="space-between" py={4}>
          <Heading>{title}</Heading>
          <HStack>
            <NetworkSelector />
            <ConnectWallet />
          </HStack>
        </Flex>
      </Flex>
      <Container maxW={maxWidth} pt={14}>
        {children}
      </Container>
    </Box>
  );
}

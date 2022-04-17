import React from "react";

import {
  Divider,
  Box,
  Heading,
  Text,
  Flex,
  OrderedList,
  UnorderedList,
  ListItem,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  h1: (p) => <Heading as="h1" fontSize="4xl" {...p} />,
  h2: (p) => <Heading as="h2" fontSize="2xl" {...p} />,
  h3: (p) => <Heading as="h3" fontSize="xl" {...p} />,
  h4: (p) => <Heading as="h3" fontSize="lg" {...p} />,
  p: (p) => <Text mb={8} fontSize="lg" {...p} />,
  ul: (p) => <UnorderedList {...p} ml={8} mb={16} />,
  ol: (p) => <OrderedList {...p} ml={8} mb={16} />,
  li: (p) => <ListItem {...p} fontSize="xl" mb={4} />,
  img: (p) => <Image {...p} my={8} />,
  a: (p) => <a {...p} my={8} />,
  hr: (p) => <Divider {...p} my={8} />,
};

const remarkPlugins = [remarkGfm];
export default function Markdown({ children }) {
  return (
    <ReactMarkdown components={components} remarkPlugins={remarkPlugins}>
      {children}
    </ReactMarkdown>
  );
}

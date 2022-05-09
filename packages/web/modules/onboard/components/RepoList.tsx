import {
  Button,
  StackDivider,
  VStack,
  Text,
  HStack,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Skeleton,
} from "@chakra-ui/react";

import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { fromToday } from "utils/date";
import { useGithubRepos } from "../hooks/useGithubRepos";

const MAX_COUNT = 5;
function createLoadingRepos() {
  return Array(MAX_COUNT)
    .fill(null)
    .map((_, i) => ({ name: i, full_name: String(i), pushed_at: new Date() }));
}

interface Props {
  onSelect: (repo: string) => void;
}
export default function RepoList({ onSelect }: Props) {
  let { data: repos = [], error, isLoading } = useGithubRepos();

  console.log("REPOS", repos);
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
        {(isLoading
          ? createLoadingRepos()
          : repos
              .filter((repo) => !repo.private)
              .sort((a, b) =>
                new Date(a.pushed_at) < new Date(b.pushed_at) ? 1 : -1
              )
              .filter((repo) => repo.name.includes(filter))
              .slice(0, MAX_COUNT)
        ).map((repo) => (
          <HStack
            fontSize={"sm"}
            key={repo.full_name}
            px={4}
            justify="space-between"
          >
            <Skeleton isLoaded={!isLoading}>
              <HStack divider={<Text px={1}>·</Text>}>
                <Text fontWeight={600}>{repo.name}</Text>
                <Text color="gray.500">{fromToday(repo.pushed_at)}</Text>
              </HStack>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Button onClick={() => onSelect(repo.full_name)}>Select</Button>
            </Skeleton>
          </HStack>
        ))}
      </VStack>
    </>
  );
}

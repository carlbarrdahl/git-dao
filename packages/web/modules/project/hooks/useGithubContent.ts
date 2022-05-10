import axios from "lib/axios";
import { useQuery } from "react-query";

export function useGithubContent({
  repo,
  content,
  ...params
}: {
  repo: string;
  content: string;
  responseType?: string;
}) {
  const path = `https://raw.githubusercontent.com/${repo}/master/${content}`;

  return useQuery([path], async () => axios.get(path, params), {
    enabled: Boolean(repo),
  });
}

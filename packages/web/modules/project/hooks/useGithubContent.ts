import axios from "lib/axios";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

interface Repo {
  name: string;
  full_name: string;
  private: boolean;
  pushed_at: string;
}
export function useGithubContent(params: { repo: string; content: string }) {
  const path = `https://raw.githubusercontent.com/${params.repo}/master/${params.content}`;

  return useQuery([path], async () => axios.get(path), {
    enabled: Boolean(params.repo),
  });
}

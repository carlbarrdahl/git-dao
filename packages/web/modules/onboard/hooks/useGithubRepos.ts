import axios from "lib/axios";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

interface Repo {
  name: string;
  full_name: string;
  private: boolean;
  pushed_at: string;
}
export function useGithubRepos() {
  const { data } = useSession();

  const token = data?.accessToken;
  const path = `https://api.github.com/user/repos`;

  return useQuery<Repo[]>(
    [path],
    async () =>
      axios.get(path, {
        headers: { Authorization: `token ${token}` },
      }),
    { enabled: Boolean(token) }
  );
}

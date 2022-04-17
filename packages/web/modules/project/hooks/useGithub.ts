import axios from "lib/axios";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

export function useGithubRepo(repo: string) {
  return useQuery(["github", "repo", repo], async () => {
    return axios.get(`https://api.github.com/repos/${repo}`);
  });
}

interface Repo {
  name: string;
  full_name: string;
  private: boolean;
  pushed_at: string;
}
export function useUserRepos() {
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

export function useGithubContent(repo: string, content: string) {
  return useQuery(
    ["github", "repo", repo, content],
    async () =>
      axios.get(`https://raw.githubusercontent.com/${repo}/master/${content}`)
    // .get(`https://api.github.com/repos/${repo}/contents/${content}`)
    // .then(({ download_url }) => axios.get(download_url))
  );
}

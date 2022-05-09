import { ethers } from "ethers";
import { useBalance } from "wagmi";

interface Props {
  token: string;
  account: string;
}

export default function TokenBalance({ token, account }: Props) {
  const { data } = useBalance({
    addressOrName: account,
    token,
  });

  return <span>{ethers.utils.formatEther(data?.value || 0)}</span>;
}

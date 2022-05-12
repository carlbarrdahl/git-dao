import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Provider, createClient, chain } from "wagmi";

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

import { providers } from "ethers";
import { QueryClientProvider } from "react-query";
import { InjectedConnector } from "@wagmi/core";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const chains = [chain.rinkeby, chain.hardhat];
const client = createClient({
  autoConnect: true,
  provider: ({ chainId }) => {
    if (chainId == 31337) {
      return new providers.JsonRpcProvider("http://localhost:8545", 31337);
    }
    return new providers.InfuraProvider(chainId);
  },
  connectors: ({}) => {
    return [
      new InjectedConnector({
        chains,
        options: { shimDisconnect: true },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
    ];
  },
});

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider client={client}>
      <QueryClientProvider client={client.queryClient}>
        <ChakraProvider>
          <SessionProvider session={session}>
            {getLayout(<Component {...pageProps} />)}
          </SessionProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;

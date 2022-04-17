import { ReactElement, ReactNode, useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Provider, chain, defaultChains, InjectedConnector } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";

import { providers } from "ethers";

const connectors = [
  new InjectedConnector({
    chains: [...defaultChains, chain.hardhat, chain.gnosis],
    options: { shimDisconnect: true },
  }),
];

const provider = ({ chainId, connector }) => {
  if (chainId == 31337) {
    const chain = connector?.chains.find((x) => x.id == 31337)?.rpcUrls[0];
    return new providers.JsonRpcProvider(chain);
  }
  return providers.getDefaultProvider(chainId);
};

const localStoragePersistor = createWebStoragePersistor({
  storage: global.localStorage,
});

function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: Infinity,
        cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnWindowFocus: false,
      },
    },
  });
  persistQueryClient({ queryClient, persistor: localStoragePersistor });
  return queryClient;
}

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
  const [queryClient] = useState(() => createQueryClient());

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider autoConnect connectors={connectors} provider={provider}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ChakraProvider>
            <SessionProvider session={session}>
              {getLayout(<Component {...pageProps} />)}
            </SessionProvider>
          </ChakraProvider>
        </Hydrate>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;

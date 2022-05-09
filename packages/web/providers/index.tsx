import React from "react";
import { Provider, createClient, allChains, defaultChains, chain } from "wagmi";

const client = createClient({});

export default function Providers({ children }: { children: React.ReactNode }) {
  <Provider client={client}>
    <ChakraProvider>{children}</ChakraProvider>
  </Provider>;
}

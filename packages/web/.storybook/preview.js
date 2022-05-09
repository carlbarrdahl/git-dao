import React from "react";
import { Provider, createClient, allChains, defaultChains, chain } from "wagmi";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const client = createClient({});

export const decorators = [
  (Story) => (
    <Provider client={client}>
      <Story />
    </Provider>
  ),
];

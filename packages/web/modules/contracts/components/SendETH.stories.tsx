import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SendETH from "./SendETH";

export default {
  title: "Features/SendETH",
  component: SendETH,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    // layout: "fullscreen",
  },
} as ComponentMeta<typeof SendETH>;

const Template: ComponentStory<typeof SendETH> = () => (
    <SendETH address={"0x2546BcD3c84621e976D8185a91A922aE77ECEc30"} />
);


export const Default = Template.bind({});
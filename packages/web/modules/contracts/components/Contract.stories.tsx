import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Contract from "./Contract";

import ABI from "contracts/Garden.json";
export default {
  title: "Features/Contract",
  component: Contract,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    // layout: "fullscreen",
  },
} as ComponentMeta<typeof Contract>;

const Template: ComponentStory<typeof Contract> = () => <Contract {...ABI} />;

export const Default = Template.bind({});

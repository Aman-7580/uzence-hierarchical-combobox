import type { Meta, StoryObj } from "@storybook/react";
import { HierarchicalCombobox } from "./HierarchicalCombobox";
import { LoadChildrenFn } from "./utils";

const meta: Meta<typeof HierarchicalCombobox> = {
  title: "Components/HierarchicalCombobox",
  component: HierarchicalCombobox,
};

export default meta;

export const Default: StoryObj<typeof HierarchicalCombobox> = {};

export const Empty: StoryObj<typeof HierarchicalCombobox> = {
  render: () => {
    const emptyLoader: LoadChildrenFn = async () => [];
    return <HierarchicalCombobox />;
  },
};

export const Loading: StoryObj<typeof HierarchicalCombobox> = {
  render: () => {
    const slowLoader: LoadChildrenFn = async () => {
      await new Promise((r) => setTimeout(r, 3000));
      return [];
    };
    return <HierarchicalCombobox />;
  },
};

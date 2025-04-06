import type { Meta, StoryObj } from '@storybook/react';
import WindowControls from '.';
import DocIcon from '.';

const meta = {
  title: 'Molecules/Dock Icon',
  component: DocIcon,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DocIconPrieview: Story = {
  args: {}
};

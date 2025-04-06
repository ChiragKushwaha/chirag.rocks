import type { Meta, StoryObj } from '@storybook/react';
import WindowControls from '.';

const meta = {
  title: 'Molecules/Combo Boxes',
  component: WindowControls,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

import type { Meta, StoryObj } from '@storybook/react';
import WindowControls from '.';
import ArrowButton from '.';

const meta = {
  title: 'Atoms/Arrow Button',
  component: ArrowButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ArrowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

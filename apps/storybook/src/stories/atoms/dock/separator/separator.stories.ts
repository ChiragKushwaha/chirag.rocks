import type { Meta, StoryObj } from '@storybook/react';
import Separator from '.';

const meta = {
  title: 'Atoms/Dock/Separator',
  component: Separator,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: ['light', 'dark']
      },
      defaultValue: 'light',
      description: 'Light or dark mode'
    }
  },
  args: {
    variant: 'light'
  }
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SeparatorLight: Story = {
  args: {
    variant: 'light'
  }
};
export const SeparatorDark: Story = {
  args: {
    variant: 'dark'
  }
};

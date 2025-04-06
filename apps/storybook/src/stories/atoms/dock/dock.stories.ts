import type { Meta, StoryObj } from '@storybook/react';
import { default as Dock, default as WindowControls } from '.';

const meta = {
  title: 'Atoms/Dock',
  component: Dock,
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
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DockLight: Story = {
  args: {
    variant: 'light'
  }
};
export const DockDark: Story = {
  args: {
    variant: 'dark'
  }
};

import type { Meta, StoryObj } from '@storybook/react';
import WindowControls from '.';
import DocIcon from '.';
import Notification from '.';
import OpenIndicator from '.';

const meta = {
  title: 'Molecules/Dock Icon/Open Indicator',
  component: OpenIndicator,
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
} satisfies Meta<typeof OpenIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenIndicatorLight: Story = {
  args: {
    variant: 'light'
  }
};

export const OpenIndicatorDark: Story = {
  args: {
    variant: 'dark'
  }
};

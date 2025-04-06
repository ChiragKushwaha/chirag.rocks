import type { Meta, StoryObj } from '@storybook/react';
import WindowControls from '.';
import DocIcon from '.';
import Notification from '.';

const meta = {
  title: 'Molecules/Dock Icon/Notification',
  component: Notification,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: {
        type: 'range',
        min: 0,
        max: 99,
        step: 1
      }
    }
  },
  args: {
    count: 1
  }
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotificationPrieview: Story = {
  args: {
    count: 2
  }
};

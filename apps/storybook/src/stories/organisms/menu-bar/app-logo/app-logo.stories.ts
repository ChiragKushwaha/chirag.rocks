import type { Meta, StoryObj } from '@storybook/react';
import { default as AppLogo } from './';

const meta = {
  title: 'Organisms/Menu Bar/App Logo',
  component: AppLogo,
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
  args: {}
} satisfies Meta<typeof AppLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppLogoLight: Story = {
  args: {
    variant: 'light'
  }
};

export const AppLogoDark: Story = {
  args: {
    variant: 'dark'
  }
};

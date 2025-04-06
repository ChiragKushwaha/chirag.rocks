import type { Meta, StoryObj } from '@storybook/react';
import { default as AppLogo, default as WindowControls } from '.';

const meta = {
  title: 'Organisms/Menu Bar/App Name',
  component: AppLogo,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppNameLight: Story = {
  args: {}
};

export const AppNameDark: Story = {
  args: {}
};

import type { Meta, StoryObj } from '@storybook/react';
import WindowControls from '.';
import MenuBar from '.';

const meta = {
  title: 'Organisms/Menu Bar',
  component: MenuBar,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MenuBarLight: Story = {
  args: {}
};

export const MenuBarDark: Story = {
  args: {}
};

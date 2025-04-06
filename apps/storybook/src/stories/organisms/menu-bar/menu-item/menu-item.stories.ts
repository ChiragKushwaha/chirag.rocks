import type { Meta, StoryObj } from '@storybook/react';
import MenuItem, { default as AppLogo, default as WindowControls } from '.';

const meta = {
  title: 'Organisms/Menu Bar/Menu Item',
  component: MenuItem,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MenuItemLight: Story = {
  args: {}
};

export const MenuItemDark: Story = {
  args: {}
};

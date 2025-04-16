import type { Meta, StoryObj } from '@storybook/react';
import '../../../../../packages/ui/dist/index.css';
import { WindowView, WindowWithSidebar } from '../../../../../packages/ui';

const meta = {
  title: 'Molecules/Window with Sidebar',
  component: WindowWithSidebar,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowWithSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

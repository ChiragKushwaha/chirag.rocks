import type { Meta, StoryObj } from '@storybook/react';
import { TabBar } from '../../../../../packages/ui';
import '../../../../../packages/ui/dist/index.css';

const meta = {
  title: 'Molecules/TabBar',
  component: TabBar,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

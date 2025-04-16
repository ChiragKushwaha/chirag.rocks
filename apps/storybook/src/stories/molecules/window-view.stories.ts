import type { Meta, StoryObj } from '@storybook/react';
import '../../../../../packages/ui/dist/index.css';
import { WindowView } from '../../../../../packages/ui';

const meta = {
  title: 'Molecules/Window View',
  component: WindowView,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

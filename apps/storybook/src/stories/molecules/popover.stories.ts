import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '../../../../../packages/ui';
import '../../../../../packages/ui/dist/index.css';

const meta = {
  title: 'Molecules/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsi̦ve'
    }
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

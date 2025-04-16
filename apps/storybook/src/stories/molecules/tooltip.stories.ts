import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, WindowControls } from '../../../../../packages/ui';

const meta = {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

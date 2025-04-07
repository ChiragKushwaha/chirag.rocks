import type { Meta, StoryObj } from '@storybook/react';
import { TitleBar } from '../../../../../packages/ui';
import '../../../../../packages/ui/dist/index.css';

const meta = {
  title: 'Molecules/Titlebar',
  component: TitleBar,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof TitleBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

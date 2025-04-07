import type { Meta } from '@storybook/react';
import { Toolbar } from '../../../../../packages/ui';
import '../../../../../packages/ui/dist/index.css';

const meta = {
  title: 'Molecules/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Toolbar>;

export default meta;

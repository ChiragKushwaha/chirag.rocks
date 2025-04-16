import type { Meta, StoryObj } from '@storybook/react';
import { Toolbar } from '../../../../../packages/ui';
import '../../../../../packages/ui/dist/index.css';
import { ToolbarType } from '../../../../../packages/ui/src/bars/toolbar';

const meta = {
  title: 'Molecules/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive'
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: [ToolbarType.STANDARD, ToolbarType.MONO],
      control: { type: 'select' }
    },
    title: {
      control: { type: 'text' }
    },
    subtitle: {
      control: { type: 'text' }
    }
  },
  args: {
    type: ToolbarType.STANDARD,
    title: 'Title',
    subtitle: 'Subtitle'
  }
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    type: ToolbarType.STANDARD
  }
};

export const Mono: Story = {
  args: {
    type: ToolbarType.MONO
  }
};

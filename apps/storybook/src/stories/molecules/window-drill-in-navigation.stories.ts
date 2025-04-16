import type { Meta, StoryObj } from '@storybook/react';
import '../../../../../packages/ui/dist/index.css';
import {
  WindowDrillInNavigation,
  WindowView
} from '../../../../../packages/ui';

const meta = {
  title: 'Molecules/Window Drill In Navigation',
  component: WindowDrillInNavigation,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowDrillInNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {}
};

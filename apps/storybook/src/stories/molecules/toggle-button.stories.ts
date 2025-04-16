import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton, WindowControls } from '../../../../../packages/ui';
import { ToggleButtonType } from '../../../../../packages/ui/src/toggle-button';

const meta = {
  title: 'Molecules/Toggle Button',
  component: ToggleButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    type: ToggleButtonType.TYPE_1
  }
};

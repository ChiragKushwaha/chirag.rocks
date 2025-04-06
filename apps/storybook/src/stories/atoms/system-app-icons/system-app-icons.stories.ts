import type { Meta, StoryObj } from '@storybook/react';
import WindowControls from '.';
import SystemAppIcons from '.';

const meta = {
  title: 'Atoms/System App Icons',
  component: SystemAppIcons,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof WindowControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SystemAppIconsPreview: Story = {
  args: {}
};

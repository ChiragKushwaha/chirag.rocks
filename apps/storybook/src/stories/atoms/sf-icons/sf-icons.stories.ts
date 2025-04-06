import type { Meta, StoryObj } from '@storybook/react';
import SFIcons from '.';

const meta = {
  title: 'Atoms/Sf Icons',
  component: SFIcons,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof SFIcons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SystemAppIconsPreview: Story = {
  args: {}
};

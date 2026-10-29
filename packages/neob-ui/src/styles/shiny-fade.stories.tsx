import { Button } from '@/components/ui/button';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Utility/ShinyFade',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Button color="gold" className="shiny-fade">
			Generate idea
		</Button>
	),
};

import { Button } from '../button/button';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Experiments/ShinyFade',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Button variant="accent" className="shiny-fade">
			Generate idea
		</Button>
	),
};

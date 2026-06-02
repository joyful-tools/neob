import { Button } from './button';
import { Pill } from './pill';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Experiments/ButtonBadge',
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusDot: Story = {
	render: () => (
		<Button className="relative">
			Hello World
			<span className="absolute top-0 right-0 flex size-3 translate-x-1/3 -translate-y-1/3">
				<span className="absolute inset-0 -z-10 animate-ping rounded-full bg-yellow-dark opacity-90 dark:bg-yellow" />
				<Pill color="yellow" className="size-3 min-w-0 rounded-full border-2 border-black p-0 shadow-none" />
			</span>
		</Button>
	),
};

export const WithLabel: Story = {
	render: () => (
		<Button className="relative">
			Hello World
			<Pill color="yellow" size="xs" className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 border-2 border-black shadow-none">
				NEW
			</Pill>
		</Button>
	),
};

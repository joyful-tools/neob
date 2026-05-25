import * as React from 'react';

import { Button } from './button';
import { Tooltip, TooltipProvider } from './tooltip';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Components/Tooltip',
	component: Tooltip,
	parameters: {
		layout: 'centered',
	},
	decorators: [
		(Story) => (
			<TooltipProvider>
				<Story />
			</TooltipProvider>
		),
	],
	tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		content: 'This is a premium neo-brutalist tooltip!',
		side: 'top',
		children: <Button variant="subtle">Hover Me</Button>,
	},
};

export const GatedTouch: Story = {
	render: () => (
		<div className="flex flex-col items-center gap-4 p-8">
			<p className="max-w-sm text-center text-sm">
				This tooltip is touch-gated for mobile devices. It opens immediately on mouse hover, but on touch devices it requires a deliberate
				long-press (700ms) to avoid misfires during scrolling.
			</p>
			<Tooltip content="Success! Long press worked.">
				<Button variant="accent">Touch / Hover Test</Button>
			</Tooltip>
		</div>
	),
};

import { useState, useEffect } from 'react';

import { Meter } from './meter';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Meter is a visual scale tracker (progress bar or meter metrics).
 *
 * ### Usage
 * ```tsx
 * import { Meter } from '@timowilhelm/neob';
 *
 * <Meter value={60} max={100} />
 * ```
 */
const meta = {
	title: 'Feedback/Meter',
	component: Meter,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 65,
		className: 'w-80',
		'aria-label': 'Default Meter',
	},
};

export const Animated: Story = {
	args: {
		'aria-label': 'Asset upload progress',
	},
	render: (args) => {
		const [value, setValue] = useState(20);

		useEffect(() => {
			const interval = setInterval(() => {
				setValue((prev) => (prev >= 100 ? 0 : Math.min(prev + 15, 100)));
			}, 1000);
			return () => clearInterval(interval);
		}, []);

		return (
			<div className="flex w-96 flex-col items-center gap-4 rounded-xl border-2 border-black bg-white p-4 text-black shadow-cel-sm dark:bg-zinc dark:text-white">
				<div className="font-display text-sm font-bold">Uploading Assets...</div>
				<Meter {...args} value={value} />
				<div className="text-xs font-bold text-muted-foreground">{value}% Complete</div>
			</div>
		);
	},
};

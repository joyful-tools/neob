import * as React from 'react';
import { useState, useEffect } from 'react';

import { Meter } from './meter';

import type { Meta, StoryObj } from '@storybook/react-vite';

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
	render: () => {
		const [value, setValue] = useState(20);

		useEffect(() => {
			const interval = setInterval(() => {
				setValue((prev) => (prev >= 100 ? 0 : prev + 15));
			}, 1000);
			return () => clearInterval(interval);
		}, []);

		return (
			<div className="flex w-96 flex-col items-center gap-4 rounded-xl border-2 border-black bg-white p-4 text-black shadow-brutal-sm dark:bg-zinc dark:text-white">
				<div className="font-display text-sm font-bold">Uploading Assets...</div>
				<Meter value={value} aria-label="Asset upload progress" />
				<div className="text-xs font-bold text-muted-foreground">{value}% Complete</div>
			</div>
		);
	},
};

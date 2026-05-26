import * as React from 'react';
import { useState, useEffect } from 'react';

import { Progress } from './progress';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Feedback/Progress',
	component: Progress,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 65,
		className: 'w-80',
	},
};

export const Animated: Story = {
	render: () => {
		const [progress, setProgress] = useState(20);

		useEffect(() => {
			const interval = setInterval(() => {
				setProgress((prev) => (prev >= 100 ? 0 : prev + 15));
			}, 1000);
			return () => clearInterval(interval);
		}, []);

		return (
			<div className="flex w-96 flex-col items-center gap-4 rounded-xl border-2 border-black bg-white p-4 text-black shadow-brutal-sm dark:bg-zinc dark:text-white">
				<div className="font-display text-sm font-bold">Uploading Assets...</div>
				<Progress value={progress} />
				<div className="text-xs font-bold text-muted-foreground">{progress}% Complete</div>
			</div>
		);
	},
};

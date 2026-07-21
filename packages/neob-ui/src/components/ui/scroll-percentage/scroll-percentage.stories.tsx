import { useRef } from 'react';

import { useScrollPercentage } from './scroll-percentage';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ScrollPercentage tracks and displays the scroll percentage of an element.
 */
const meta = {
	title: 'Experiments/ScrollPercentage',
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const containerRef = useRef<HTMLDivElement>(null);
		const percentage = useScrollPercentage('y', containerRef);

		return (
			<div className="flex flex-col items-center gap-4 p-6">
				<div className="w-full text-center">
					<span className="rounded-md border-2 border-black bg-yellow px-4 py-2 font-mono text-lg font-black text-black shadow-cel-sm">
						Scroll percentage: {percentage.toFixed(0)}%
					</span>
				</div>
				<div
					ref={containerRef}
					className="relative h-96 w-64 overflow-y-scroll rounded-xl border-4 border-black bg-white shadow-cel-lg select-none dark:bg-zinc"
				>
					<div className="h-[200%] w-full bg-linear-to-b from-orange via-gold to-purple opacity-90" />
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-4">
						<span className="rounded-sm border-2 border-black bg-white px-2 py-1 font-sans text-sm font-black text-black dark:bg-zinc dark:text-white">
							Scroll Down ↓
						</span>
					</div>
				</div>
			</div>
		);
	},
};

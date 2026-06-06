import { CaretDoubleRightIcon } from '@phosphor-icons/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * HoverClip demonstrates interactive background clips/reveal designs.
 */
const meta = {
	title: 'Experiments/HoverClip',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="group relative aspect-[0.7142857142857143] w-28 cursor-pointer overflow-hidden rounded-lg border-2 border-black bg-orange shadow-lg">
			<div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100 dark:bg-black/20">
				<div className="absolute inset-0 flex size-full items-center justify-center gap-1 ps-2 font-semibold text-black italic select-none [clip-path:inset(0_100%_0_0)] [transition:clip-path_0.4s_0.1s_cubic-bezier(0.19,1,0.22,1)] group-hover:[clip-path:inset(0)] dark:text-white">
					<span>View More</span>
					<CaretDoubleRightIcon size={16} weight="bold" />
				</div>
			</div>
		</div>
	),
};

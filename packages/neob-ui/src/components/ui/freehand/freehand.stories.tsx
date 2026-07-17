import { Freehand } from './freehand';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Freehand showcases SVG filter effects to create a hand-drawn sketch look (Freehand) or fuzzy noise texture edges.
 */
const meta = {
	title: 'Experiments/Freehand',
	component: Freehand,
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof Freehand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="flex flex-col gap-12 p-8">
			<div className="relative flex size-56 items-center justify-center rounded-xl">
				{/* Apply Freehand filter only to background to prevent text from wiggling */}
				<Freehand variant="freehand" className="absolute inset-0 -z-10 rounded-xl border-4 border-black bg-orange" />
				<div>
					<div className="m-4 text-center font-display text-4xl font-black text-black">Hello World</div>
				</div>
			</div>

			<Freehand variant="fuzzy" className="h-12 w-56 rounded-sm border-2 border-black bg-gold shadow-cel-sm" />
		</div>
	),
};

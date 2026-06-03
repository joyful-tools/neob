import { expect, fireEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { SmartSticky } from './smart-sticky';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * SmartSticky is a smart sticky header wrapper that hides/reveals itself based on scroll direction.
 *
 * ### General Usage
 * ```tsx
 * import { SmartSticky } from 'neob';
 *
 * <SmartSticky>
 *   <nav>Header Navigation</nav>
 * </SmartSticky>
 * ```
 */
const meta = {
	title: 'Utility/SmartSticky',
	component: SmartSticky,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof SmartSticky>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div
			data-testid="scroll-container"
			tabIndex={0}
			className="h-60 w-80 overflow-y-auto rounded-xl border-2 border-black bg-white select-none focus:ring-2 focus:ring-black focus:outline-hidden"
		>
			<div className="h-20 bg-muted/40 p-4 font-sans text-xs">Scroll down to stick the header...</div>

			<SmartSticky
				sticky={({ stuck }) => (
					<div
						data-testid="sticky-header"
						className={`border-b-2 border-black p-3 font-display transition-all duration-200 ${
							stuck ? 'bg-orange text-black shadow-cel-sm' : 'bg-white text-zinc'
						}`}
					>
						{stuck ? 'STUCK HEADER' : 'Sticky Header'}
					</div>
				)}
			>
				<div className="h-[400px] bg-muted/10 p-4 font-sans text-sm/relaxed">
					This is some scrollable text area inside the sticky observer.
					<br />
					<br />
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum dolor a lectus elementum sodales.
				</div>
			</SmartSticky>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const container = canvas.getByTestId('scroll-container');
		const header = canvas.getByTestId('sticky-header');

		await expect(header).toHaveTextContent('Sticky Header');
		await expect(header).not.toHaveClass('bg-orange');

		container.scrollTop = 100;
		fireEvent.scroll(container);
		// Wait for animation frame / observer
		await new Promise((resolve) => setTimeout(resolve, 300));

		await expect(header).toHaveTextContent('STUCK HEADER');
		await expect(header).toHaveClass('bg-orange');

		container.scrollTop = 0;
		fireEvent.scroll(container);
		await new Promise((resolve) => setTimeout(resolve, 300));

		await expect(header).toHaveTextContent('Sticky Header');
		await expect(header).not.toHaveClass('bg-orange');
	}),
};

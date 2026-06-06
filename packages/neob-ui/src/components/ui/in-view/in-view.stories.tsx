import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { InView } from './in-view';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * InView triggers animations and events when a component scrolls into view.
 */
const meta = {
	title: 'Experiments/InView',
	component: InView,
	parameters: {
		layout: 'centered',
	},
	args: {
		once: true,
		rootMargin: '-15%',
		threshold: 0,
		children: () => null,
	},
} satisfies Meta<typeof InView>;

export default meta;
type Story = StoryObj<typeof meta>;

function InViewDemo(args: Omit<React.ComponentProps<typeof InView>, 'root' | 'rootMargin' | 'children'>) {
	// useState + callback ref so InView receives the real DOM element after mount,
	// triggering IO reconstruction with the correct root (instead of null).
	const [container, setContainer] = useState<HTMLDivElement | null>(null);

	return (
		<div
			ref={setContainer}
			// tabIndex makes the scrollable region keyboard-accessible, satisfying the axe scrollable-region-focusable rule
			tabIndex={0}
			className="h-96 w-64 overflow-y-scroll rounded-xl border-4 border-black bg-white shadow-cel-md dark:bg-zinc"
			data-testid="container"
		>
			<div className="flex h-[150%] flex-col items-center justify-between p-10 select-none">
				<div className="text-center font-mono text-lg font-black text-black dark:text-white">Scroll down ↓</div>
				{/* root=container scopes the IntersectionObserver to the scrollable div,
				    so container.scroll() reliably fires the callback in both browser and headless environments. */}
				<InView {...args} root={container} rootMargin="0px" onviewchange={action('view-change')}>
					{({ inView, visibility }) => (
						<div
							style={{ visibility }}
							data-testid="target"
							className={`rounded-lg border-2 border-black bg-pink px-4 py-2 font-mono text-sm font-black text-black shadow-cel-sm transition-all duration-700 ${
								inView ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
							}`}
						>
							Hello World
						</div>
					)}
				</InView>
			</div>
		</div>
	);
}

export const Default: Story = {
	render: (args) => <InViewDemo {...args} />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const container = canvas.getByTestId('container');
		container.scroll(0, container.scrollHeight);

		await waitFor(async () => {
			await expect(canvas.getByTestId('target')).toBeVisible();
		});
	}),
};

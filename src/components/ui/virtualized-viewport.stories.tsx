import * as React from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';
import { cn } from '@/lib/utilities';

import { Button } from './button';
import { Card } from './card';
import { VirtualizedViewport, type VirtualizedViewportProps } from './virtualized-viewport';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Utility/VirtualizedViewport',
	component: VirtualizedViewport,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<VirtualizedViewportProps<MockItem>>;

export default meta;
type Story = StoryObj<VirtualizedViewportProps<MockItem>>;

interface MockItem {
	id: string;
	title: string;
	description: string;
	color: string;
	height: number;
}

const COLORS = [
	'bg-orange-light text-zinc-900 border-orange-dark dark:text-orange-light',
	'bg-gold-light text-zinc-900 border-gold-dark dark:text-gold-light',
	'bg-blue-light text-zinc-900 border-blue-dark dark:text-blue-light',
	'bg-purple-light text-zinc-900 border-purple-dark dark:text-purple-light',
	'bg-pink-light text-zinc-900 border-pink-dark dark:text-pink-light',
	'bg-yellow-light text-zinc-900 border-yellow-dark dark:text-yellow-light',
	'bg-red-light text-zinc-900 border-red-dark dark:text-red-light',
	'bg-green-light text-zinc-900 border-green-dark dark:text-green-light',
];

const LOREM_IPSUM = [
	'Lorem ipsum dolor sit amet.',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna.',
];

const generateItems = (count: number, variableHeights = false, startIndex = 0): MockItem[] => {
	return Array.from({ length: count }, (_, i) => {
		const globalIndex = startIndex + i;
		const loremIndex = variableHeights ? globalIndex % 3 : 0;
		const height = variableHeights ? (loremIndex === 2 ? 120 : loremIndex === 1 ? 80 : 60) : 60;
		return {
			id: `item-${globalIndex}`,
			title: `Item #${globalIndex + 1}`,
			description: LOREM_IPSUM[loremIndex]!,
			color: COLORS[globalIndex % COLORS.length]!,
			height,
		};
	});
};

export const Basic: Story = {
	args: {
		items: generateItems(100, false),
		estimatedItemHeight: 60,
		overscan: 5,
	},
	render: (args: VirtualizedViewportProps<MockItem>) => {
		const [itemsList, setItemsList] = React.useState<MockItem[]>(args.items);

		return (
			<div className="flex w-[600px] flex-col gap-4">
				<div className="flex items-center justify-between rounded-xl border-2 border-black bg-muted/40 p-4">
					<div>
						<h3 className="font-display text-lg">Virtualized Viewport</h3>
					</div>
					<div className="flex gap-2">
						<Button variant="subtle" size="sm" onClick={() => setItemsList((prev) => [...prev, ...generateItems(50, false, prev.length)])}>
							Add 50 Items
						</Button>
						<Button variant="danger" size="sm" onClick={() => setItemsList([])}>
							Clear List
						</Button>
					</div>
				</div>

				<Card className="h-[400px] overflow-hidden border-2 border-black bg-white p-0 dark:bg-zinc">
					<VirtualizedViewport
						items={itemsList}
						estimatedItemHeight={args.estimatedItemHeight}
						overscan={args.overscan}
						className="size-full"
						onScroll={(e) => {
							action('onScroll')(e.currentTarget.scrollTop);
						}}
						renderItem={(item) => (
							<div
								style={{ height: item.height }}
								className="flex items-center gap-3 border-b-2 border-black bg-white px-4 transition-all duration-150 hover:bg-muted/10 dark:bg-zinc"
							>
								<div
									className={cn(
										'inline-flex items-center justify-center rounded-lg border-2 border-black px-3 py-1 font-sans text-[10px] font-bold shadow-cel-sm',
										item.color,
									)}
								>
									{item.title}
								</div>
								<span className="text-xs font-medium text-muted-foreground">{item.description}</span>
							</div>
						)}
					/>
				</Card>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const scrollContainer = canvasElement.querySelector('.overflow-y-auto');
		await expect(scrollContainer).toBeInTheDocument();

		if (!scrollContainer) throw new Error('Scroll container not found');

		// 1. Initially check that early items are rendered and visible
		await expect(canvas.getByText('Item #1')).toBeInTheDocument();
		await expect(canvas.getByText('Item #5')).toBeInTheDocument();

		// Items far down the list should NOT be in the DOM
		await expect(canvas.queryByText('Item #50')).not.toBeInTheDocument();

		// 2. Perform a scroll
		scrollContainer.scrollTop = 1200; // Scroll past 20 items (20 * 60 = 1200)
		scrollContainer.dispatchEvent(new Event('scroll'));

		// Wait a brief moment for state synchronization
		await new Promise((resolve) => setTimeout(resolve, 50));

		// Now item 20-30 should be visible, and item 1 should be virtualized out of DOM
		await expect(canvas.getByText('Item #22')).toBeInTheDocument();
		await expect(canvas.queryByText('Item #1')).not.toBeInTheDocument();

		// 3. Test clear list button
		const clearButton = canvas.getByRole('button', { name: 'Clear List' });
		await userEvent.click(clearButton);
		await expect(canvas.queryByText('Item #22')).not.toBeInTheDocument();
	}),
};

export const DynamicHeights: Story = {
	args: {
		items: generateItems(200, true),
		estimatedItemHeight: 100,
		overscan: 5,
	},
	render: (args: VirtualizedViewportProps<MockItem>) => {
		const [itemsList, setItemsList] = React.useState<MockItem[]>(args.items);

		return (
			<div className="flex w-[600px] flex-col gap-4">
				<div className="flex items-center justify-between rounded-xl border-2 border-black bg-muted/40 p-4">
					<div>
						<h3 className="font-display text-lg">Virtualized Viewport</h3>
					</div>
					<div className="flex gap-2">
						<Button
							variant="accent"
							size="sm"
							onClick={() =>
								setItemsList((prev) => {
									const prepended = Array.from({ length: 10 }, (_, i) => {
										const loremIndex = i % 3;
										const height = loremIndex === 2 ? 120 : loremIndex === 1 ? 80 : 60;
										const id = `prepend-${Date.now()}-${i}`;
										return {
											id,
											title: `Prepended #${i + 1}`,
											description: LOREM_IPSUM[loremIndex]!,
											color: COLORS[i % COLORS.length]!,
											height,
										};
									});
									return [...prepended, ...prev];
								})
							}
						>
							Prepend 10 Items
						</Button>
						<Button variant="subtle" size="sm" onClick={() => setItemsList((prev) => [...prev, ...generateItems(10, true, prev.length)])}>
							Append 10 Items
						</Button>
					</div>
				</div>

				<Card className="h-[450px] overflow-hidden border-2 border-black bg-white p-0 shadow-cel-md dark:bg-zinc">
					<VirtualizedViewport
						items={itemsList}
						estimatedItemHeight={args.estimatedItemHeight}
						overscan={args.overscan}
						className="size-full"
						renderItem={(item) => (
							<div
								style={{ minHeight: item.height }}
								className="flex flex-col gap-2 border-b-2 border-black bg-white p-4 transition-colors duration-150 hover:bg-muted/10 dark:bg-zinc"
							>
								<div className="flex items-center">
									<span
										className={cn('rounded-md border border-black px-2 py-0.5 font-sans text-[10px] font-bold shadow-cel-sm', item.color)}
									>
										{item.title}
									</span>
								</div>
								<p className="text-xs/relaxed font-medium text-muted-foreground">{item.description}</p>
							</div>
						)}
					/>
				</Card>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const scrollContainer = canvasElement.querySelector('.overflow-y-auto');
		if (!scrollContainer) throw new Error('Scroll container not found');

		// 1. Verify dynamic height items rendering
		await expect(canvas.getByText('Item #1')).toBeInTheDocument();

		// Scroll to a mid point
		scrollContainer.scrollTop = 500;
		scrollContainer.dispatchEvent(new Event('scroll'));
		await new Promise((resolve) => setTimeout(resolve, 50));

		const firstScrollTop = scrollContainer.scrollTop;
		expect(firstScrollTop).toBeGreaterThanOrEqual(450);

		// 2. Prepend items (adds offset of prepended items, triggering scroll anchoring adjustment)
		const prependButton = canvas.getByRole('button', { name: 'Prepend 10 Items' });
		await userEvent.click(prependButton);

		// Wait for sizes/offsets recalculation and layout effect anchoring adjustment
		await new Promise((resolve) => setTimeout(resolve, 100));

		// ScrollTop should adjust upwards because we prepended 10 items above the current viewport
		const afterPrependScrollTop = scrollContainer.scrollTop;
		expect(afterPrependScrollTop).toBeGreaterThan(firstScrollTop);
	}),
};

export const VisualBufferDebugger: Story = {
	args: {
		items: generateItems(100, true),
		estimatedItemHeight: 120,
		overscan: 4,
	},
	render: (args: VirtualizedViewportProps<MockItem>) => {
		const [itemsList] = React.useState<MockItem[]>(args.items);
		const [range, setRange] = React.useState({
			startIndex: 0,
			endIndex: -1,
			firstVisibleIndex: 0,
			lastVisibleIndex: -1,
		});

		return (
			<div className="flex w-[680px] flex-col gap-4">
				<div className="rounded-xl border-2 border-black bg-muted/40 p-4">
					<h3 className="font-display text-lg">Virtualized Viewport Debugger</h3>
				</div>

				<div className="flex gap-4">
					{/* Scrollable Viewport */}
					<Card className="h-[450px] w-[380px] overflow-hidden border-2 border-black bg-white p-0 shadow-cel-md">
						<VirtualizedViewport
							items={itemsList}
							estimatedItemHeight={args.estimatedItemHeight}
							overscan={args.overscan}
							className="size-full"
							onRangeChange={setRange}
							renderItem={(item) => (
								<div
									style={{ minHeight: item.height }}
									className="flex flex-col gap-2 border-b-2 border-black bg-white p-4 transition-colors duration-150 hover:bg-muted/10 dark:bg-zinc"
								>
									<div className="flex items-center">
										<span
											className={cn(
												'rounded-md border border-black px-2.5 py-0.5 font-sans text-[10px] font-bold shadow-cel-sm',
												item.color,
											)}
										>
											{item.title}
										</span>
									</div>
									<p className="text-xs/relaxed font-medium text-muted-foreground">{item.description}</p>
								</div>
							)}
						/>
					</Card>

					{/* Virtualization Map */}
					<Card className="flex flex-1 flex-col border-2 border-black bg-white p-4 shadow-cel-md">
						{/* Legend */}
						<div className="mb-3 flex flex-wrap gap-2 font-mono text-[10px]">
							<div className="flex items-center gap-1">
								<div className="size-3 rounded-sm border border-black bg-green-light shadow-cel-inset-sm" />
								<span>Visible</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="size-3 rounded-sm border border-black bg-orange-light shadow-cel-inset-sm" />
								<span>Buffer</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="size-3 rounded-sm border border-black bg-muted shadow-cel-inset-sm" />
								<span>Virtualized</span>
							</div>
						</div>

						{/* Grid Map */}
						<div className="grid max-h-[300px] flex-1 grid-cols-10 gap-1 overflow-y-auto pr-1">
							{itemsList.map((_, i) => {
								const isVisible = i >= range.firstVisibleIndex && i <= range.lastVisibleIndex;
								const isRendered = i >= range.startIndex && i <= range.endIndex;

								let statusClass = 'bg-muted text-zinc-700 dark:text-zinc-400';
								if (isVisible) {
									statusClass = 'bg-green-light border-green-dark text-green-950 font-bold';
								} else if (isRendered) {
									statusClass = 'bg-orange-light border-orange-dark text-orange-950 font-bold';
								}

								return (
									<div
										key={i}
										title={`Item #${i + 1}`}
										className={cn(
											'flex size-6 items-center justify-center rounded-sm border border-black font-mono text-[9px] shadow-cel-sm transition-all duration-150',
											statusClass,
										)}
									>
										{i + 1}
									</div>
								);
							})}
						</div>
					</Card>
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('Virtualized Viewport Debugger')).toBeInTheDocument();
		await expect(canvas.getByText('Item #1')).toBeInTheDocument();
	}),
};

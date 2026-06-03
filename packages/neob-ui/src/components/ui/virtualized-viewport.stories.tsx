import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';
import { cn } from '@/lib/utilities';

import { Button } from './button';
import { Card } from './card';
import { VirtualizedViewport, type VirtualizedViewportProps } from './virtualized-viewport';

import type { Meta, StoryObj } from '@storybook/react-vite';

interface Slab {
	id: string;
	label: number;
	bg: string;
	height: number;
}

const BG = ['bg-orange', 'bg-gold', 'bg-blue', 'bg-purple', 'bg-pink', 'bg-yellow', 'bg-red', 'bg-green'] as const;

const hexId = (n: number) => {
	const sign = n < 0 ? '-' : '';
	return sign + Math.abs(n).toString(16).toUpperCase().padStart(3, '0');
};

const makeSlabs = (count: number, dynamic = false, offset = 0): Slab[] =>
	Array.from({ length: count }, (_, i) => {
		const idx = offset + i;
		return {
			id: `s-${idx}`,
			label: idx,
			bg: BG[idx % BG.length]!,
			height: dynamic ? [48, 72, 96][idx % 3]! : 48,
		};
	});

const SlabItem = ({ slab }: { slab: Slab }) => (
	<div
		style={{ height: slab.height }}
		className={cn('flex items-center border-b-2 border-black px-4 transition-colors duration-100 hover:brightness-110', slab.bg)}
	>
		<span className="inline-flex items-center rounded-md bg-black/80 px-2 py-0.5 font-mono text-xs font-bold text-white">
			{hexId(slab.label)}
		</span>
	</div>
);

/**
 * VirtualizedViewport is a viewport for high-performance list virtualization.
 *
 * ### General Usage
 * ```tsx
 * import { VirtualizedViewport } from 'neob';
 *
 * <VirtualizedViewport
 *   items={items}
 *   itemHeight={50}
 *   renderItem={(item) => <div>{item.name}</div>}
 * />
 * ```
 */
const meta = {
	title: 'Utility/VirtualizedViewport',
	component: VirtualizedViewport,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<VirtualizedViewportProps<Slab>>;

export default meta;
type Story = StoryObj<VirtualizedViewportProps<Slab>>;

export const Basic: Story = {
	args: {
		items: makeSlabs(100),
		estimatedItemHeight: 48,
		overscan: 5,
	},
	render: (args: VirtualizedViewportProps<Slab>) => {
		const [items, setItems] = useState<Slab[]>(args.items);

		return (
			<div className="flex w-[480px] flex-col gap-4">
				<div className="flex items-center justify-between rounded-xl border-2 border-black bg-muted/40 p-3">
					<h3 className="font-display text-base">Basic</h3>
					<div className="flex gap-2">
						<Button variant="subtle" size="sm" onClick={() => setItems((p) => [...p, ...makeSlabs(50, false, p.length)])}>
							+50
						</Button>
						<Button variant="danger" size="sm" onClick={() => setItems([])}>
							Clear
						</Button>
					</div>
				</div>

				<Card className="h-[400px] overflow-hidden border-2 border-black p-0">
					<VirtualizedViewport
						items={items}
						estimatedItemHeight={args.estimatedItemHeight}
						overscan={args.overscan}
						className="size-full"
						onScroll={(e) => action('onScroll')(e.currentTarget.scrollTop)}
						renderItem={(item) => <SlabItem slab={item} />}
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

		await expect(canvas.getByText('000')).toBeInTheDocument();
		await expect(canvas.getByText('004')).toBeInTheDocument();

		await expect(canvas.queryByText('031')).not.toBeInTheDocument();

		scrollContainer.scrollTop = 960;
		scrollContainer.dispatchEvent(new Event('scroll'));
		await new Promise((resolve) => setTimeout(resolve, 50));

		await expect(canvas.getByText('015')).toBeInTheDocument();
		await expect(canvas.queryByText('000')).not.toBeInTheDocument();

		const clearButton = canvas.getByRole('button', { name: 'Clear' });
		await userEvent.click(clearButton);
		await expect(canvas.queryByText('015')).not.toBeInTheDocument();
	}),
};

export const DynamicHeights: Story = {
	args: {
		items: makeSlabs(200, true),
		estimatedItemHeight: 72,
		overscan: 5,
	},
	render: (args: VirtualizedViewportProps<Slab>) => {
		const [items, setItems] = useState<Slab[]>(args.items);

		return (
			<div className="flex w-[480px] flex-col gap-4">
				<div className="flex items-center justify-between rounded-xl border-2 border-black bg-muted/40 p-3">
					<h3 className="font-display text-base">Dynamic Heights</h3>
					<div className="flex gap-2">
						<Button
							variant="accent"
							size="sm"
							onClick={() =>
								setItems((prev) => {
									const lowestLabel = prev.length > 0 ? Math.min(...prev.map((s) => s.label)) : 0;
									const prepended = Array.from({ length: 10 }, (_, i) => {
										const label = lowestLabel - 10 + i;
										return {
											id: `pre-${Date.now()}-${i}`,
											label,
											bg: BG[((label % BG.length) + BG.length) % BG.length]!,
											height: [48, 72, 96][((label % 3) + 3) % 3]!,
										};
									});
									return [...prepended, ...prev];
								})
							}
						>
							Prepend 10
						</Button>
						<Button variant="subtle" size="sm" onClick={() => setItems((p) => [...p, ...makeSlabs(10, true, p.length)])}>
							Append 10
						</Button>
					</div>
				</div>

				<Card className="h-[450px] overflow-hidden border-2 border-black p-0 shadow-cel-md">
					<VirtualizedViewport
						items={items}
						estimatedItemHeight={args.estimatedItemHeight}
						overscan={args.overscan}
						className="size-full"
						renderItem={(item) => <SlabItem slab={item} />}
					/>
				</Card>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const scrollContainer = canvasElement.querySelector('.overflow-y-auto');
		if (!scrollContainer) throw new Error('Scroll container not found');

		await expect(canvas.getByText('000')).toBeInTheDocument();

		scrollContainer.scrollTop = 500;
		scrollContainer.dispatchEvent(new Event('scroll'));
		await new Promise((resolve) => setTimeout(resolve, 50));

		const firstScrollTop = scrollContainer.scrollTop;
		expect(firstScrollTop).toBeGreaterThanOrEqual(450);

		const prependButton = canvas.getByRole('button', { name: 'Prepend 10' });
		await userEvent.click(prependButton);
		await new Promise((resolve) => setTimeout(resolve, 100));

		const afterPrependScrollTop = scrollContainer.scrollTop;
		expect(afterPrependScrollTop).toBeGreaterThan(firstScrollTop);
	}),
};

export const VisualBufferDebugger: Story = {
	args: {
		items: makeSlabs(100, true),
		estimatedItemHeight: 72,
		overscan: 4,
	},
	render: (args: VirtualizedViewportProps<Slab>) => {
		const [items] = useState<Slab[]>(args.items);
		const [range, setRange] = useState({
			startIndex: 0,
			endIndex: -1,
			firstVisibleIndex: 0,
			lastVisibleIndex: -1,
		});

		return (
			<div className="flex w-[680px] flex-col gap-4">
				<div className="rounded-xl border-2 border-black bg-muted/40 p-3">
					<h3 className="font-display text-base">Buffer Debugger</h3>
				</div>

				<div className="flex gap-4">
					<Card className="h-[450px] w-[380px] overflow-hidden border-2 border-black p-0 shadow-cel-md">
						<VirtualizedViewport
							items={items}
							estimatedItemHeight={args.estimatedItemHeight}
							overscan={args.overscan}
							className="size-full"
							onRangeChange={setRange}
							renderItem={(item) => <SlabItem slab={item} />}
						/>
					</Card>

					<Card className="flex flex-1 flex-col border-2 border-black p-4 shadow-cel-md">
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
								<span>Virtual</span>
							</div>
						</div>

						<div className="grid max-h-[300px] flex-1 grid-cols-10 gap-1 overflow-y-auto pr-1">
							{items.map((_, i) => {
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
										title={`#${hexId(i)}`}
										className={cn(
											'flex size-6 items-center justify-center rounded-sm border border-black font-mono text-[9px] shadow-cel-sm transition-all duration-150',
											statusClass,
										)}
									>
										{i}
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
		await expect(canvas.getByText('Buffer Debugger')).toBeInTheDocument();
		await expect(canvas.getByText('000')).toBeInTheDocument();
	}),
};

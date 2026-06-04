import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { HoverPreview } from './hover-preview';
import { Skeleton } from './skeleton';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * HoverPreview is a container preview popup triggered on cursor hover.
 *
 * ### Usage
 * ```tsx
 * import { HoverPreview } from '@timowilhelm/neob';
 *
 * <HoverPreview previewContent={<div>Preview UI</div>}>
 *   <span>Hover Me</span>
 * </HoverPreview>
 * ```
 */
const meta = {
	title: 'Feedback/HoverPreview',
	component: HoverPreview,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof HoverPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const PreviewSkeleton = () => (
	<div
		data-testid="preview-skeleton"
		className="flex w-52 flex-col gap-3 rounded-xl border-2 border-black bg-white p-4 shadow-cel-sm dark:bg-zinc"
	>
		<div className="flex items-center gap-3">
			<Skeleton className="size-10 shrink-0 rounded-full" />
			<div className="flex flex-1 flex-col gap-1.5">
				<Skeleton className="h-4 w-2/3" />
				<Skeleton className="h-3 w-1/2" />
			</div>
		</div>
		<div className="mt-1 flex flex-col gap-1.5">
			<Skeleton className="h-3 w-full" />
			<Skeleton className="h-3 w-4/5" />
		</div>
	</div>
);

export const Default: Story = {
	render: () => (
		<div className="p-12">
			<HoverPreview preview={<PreviewSkeleton />}>
				<span className="cursor-help font-sans font-bold text-zinc underline decoration-zinc decoration-2 underline-offset-4 dark:text-white dark:decoration-white">
					Hover for details
				</span>
			</HoverPreview>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const trigger = canvas.getByText('Hover for details');
		expect(trigger).toBeInTheDocument();

		// Initially, card is not visible in DOM (unmounted by default in Base UI Portal when closed)
		const bodyCanvas = within(canvasElement.ownerDocument.body);
		let card = bodyCanvas.queryByTestId('preview-skeleton');
		await expect(card).toBeNull();

		await userEvent.hover(trigger);
		await new Promise((resolve) => setTimeout(resolve, 300));

		card = bodyCanvas.getByTestId('preview-skeleton');
		await expect(card).toBeInTheDocument();

		await userEvent.unhover(trigger);

		// Verify it disappeared (waiting for exit animation to complete)
		await waitFor(async () => {
			const cardAfterUnhover = bodyCanvas.queryByTestId('preview-skeleton');
			await expect(cardAfterUnhover).toBeNull();
		});
	}),
};

export const ForceOpen: Story = {
	render: () => (
		<div className="p-12">
			<HoverPreview forceOpen preview={<PreviewSkeleton />}>
				<span className="cursor-help font-sans font-bold text-zinc underline decoration-zinc decoration-2 underline-offset-4 dark:text-white dark:decoration-white">
					Pinned Open
				</span>
			</HoverPreview>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const bodyCanvas = within(canvasElement.ownerDocument.body);
		const card = bodyCanvas.getByTestId('preview-skeleton');
		await expect(card).toBeInTheDocument();
	}),
};

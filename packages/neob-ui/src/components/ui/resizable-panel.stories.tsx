import { expect, fireEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { ResizablePanel } from './resizable-panel';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ResizablePanel is a height/width animating container that transitions content layout shifts.
 *
 * ### Usage
 * ```tsx
 * import { ResizablePanel } from '@timowilhelm/neob';
 *
 * <ResizablePanel>
 *   <div>Dynamic Animated Height Content</div>
 * </ResizablePanel>
 * ```
 */
const meta = {
	title: 'Utility/ResizablePanel',
	component: ResizablePanel,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ResizablePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
	args: {
		direction: 'horizontal',
		defaultSize: 200,
		minSize: 100,
		maxSize: 350,
	},
	render: (args) => {
		return (
			<div className="flex h-64 w-[500px] overflow-hidden rounded-xl border-2 border-black bg-white text-black shadow-cel-md dark:bg-zinc dark:text-white">
				<ResizablePanel {...args}>
					<div className="flex h-full items-center justify-center bg-orange-light p-4 text-center font-bold">Sidebar (Drag Right Edge)</div>
				</ResizablePanel>
				<div className="flex flex-1 items-center justify-center p-4 text-center font-medium">
					Main content area (takes up remaining space)
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const handle = canvas.getByRole('separator', { name: 'Resize panel width' });
		await expect(handle).toHaveAttribute('aria-valuenow', '200');
		fireEvent.mouseDown(handle, { clientX: 200 });
		fireEvent.mouseMove(document, { clientX: 240 });
		fireEvent.mouseUp(document);
		const currentSize = Number(handle.getAttribute('aria-valuenow'));
		await expect(currentSize).toBeGreaterThanOrEqual(200);
		await expect(currentSize).toBeLessThanOrEqual(350);
	}),
};

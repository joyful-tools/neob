import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { StackHeader } from './stack-header';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Navigation/StackHeader',
	component: StackHeader,
	parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StackHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="min-h-[180vh] bg-muted">
			<StackHeader className="flex items-center justify-between border-b-2 border-edge bg-white p-4 dark:bg-zinc">
				<strong>Workspace</strong>
				<Button size="sm">New document</Button>
			</StackHeader>
			<main className="p-6">Scroll down to hide the header and up to reveal it.</main>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'New document' });
		await userEvent.tab();
		await expect(button).toHaveFocus();
		await expect(canvas.getByRole('banner')).not.toHaveAttribute('data-hidden');
	}),
};

export const ScrollDirection: Story = {
	render: Default.render,
	play: guardPlay(async ({ canvasElement }) => {
		const storyWindow = canvasElement.ownerDocument.defaultView;
		if (!storyWindow) return;
		const header = within(canvasElement).getByRole('banner');

		storyWindow.scrollTo(0, 300);
		await waitFor(() => expect(header).toHaveAttribute('data-hidden'));
		storyWindow.scrollTo(0, 240);
		await waitFor(() => expect(header).not.toHaveAttribute('data-hidden'));
		storyWindow.scrollTo(0, 0);
	}),
};

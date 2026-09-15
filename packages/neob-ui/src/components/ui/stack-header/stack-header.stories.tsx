import { useEffect, useRef } from 'react';
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

function StackHeaderDemo() {
	const headerRef = useRef<HTMLElement>(null);
	const debugRef = useRef<HTMLOutputElement>(null);

	useEffect(() => {
		const header = headerRef.current;
		const debug = debugRef.current;
		if (!header || !debug) return;

		let previousScrollY = window.scrollY;
		let direction: 'up' | 'down' = 'down';
		let frameId: number | undefined;
		const updateDebugInformation = () => {
			const scrollY = window.scrollY;
			if (scrollY !== previousScrollY) direction = scrollY > previousScrollY ? 'down' : 'up';
			previousScrollY = scrollY;
			const bounds = header.getBoundingClientRect();
			const visiblePixels = Math.max(0, Math.min(bounds.height, bounds.bottom) - Math.max(0, bounds.top));
			const offset = header.style.getPropertyValue('--stack-header-offset') || '0px';
			debug.textContent = `Header Visible: ${Math.round(visiblePixels)}px | Direction: ${direction.toUpperCase()} | Offset: ${offset}`;
		};

		const scheduleDebugInformation = () => {
			if (frameId === undefined)
				frameId = requestAnimationFrame(() => {
					frameId = undefined;
					updateDebugInformation();
				});
		};
		const resizeObserver = new ResizeObserver(scheduleDebugInformation);
		resizeObserver.observe(header);
		window.addEventListener('scroll', scheduleDebugInformation, { passive: true });
		updateDebugInformation();
		return () => {
			if (frameId !== undefined) cancelAnimationFrame(frameId);
			resizeObserver.disconnect();
			window.removeEventListener('scroll', scheduleDebugInformation);
		};
	}, []);

	return (
		<div className="min-h-[180vh] bg-muted">
			<StackHeader ref={headerRef} className="flex items-center justify-between border-b-2 border-edge bg-white p-4 dark:bg-zinc">
				<strong>Workspace</strong>
				<Button size="sm">New document</Button>
			</StackHeader>
			<output
				ref={debugRef}
				className="fixed right-4 bottom-4 z-50 rounded-sm border-2 border-edge bg-white p-2 font-mono text-xs font-bold text-black shadow-sm dark:bg-zinc dark:text-white"
			>
				Header Visible: 0px | Direction: DOWN | Offset: 0px
			</output>
			<main className="p-6">Scroll down to move the header out of view and up to progressively reveal it.</main>
		</div>
	);
}

export const Default: Story = {
	render: () => <StackHeaderDemo />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'New document' });
		await userEvent.tab();
		await expect(button).toHaveFocus();
		await expect(canvas.getByRole('banner')).not.toHaveAttribute('data-hidden');
		await expect(canvas.getByText(/Header Visible:/)).toHaveTextContent('Direction: DOWN');
	}),
};

export const ScrollDirection: Story = {
	render: () => <StackHeaderDemo />,
	play: guardPlay(async ({ canvasElement }) => {
		const storyWindow = canvasElement.ownerDocument.defaultView;
		if (!storyWindow) return;
		const canvas = within(canvasElement);
		const header = canvas.getByRole('banner');
		const headerHeight = header.getBoundingClientRect().height;

		storyWindow.scrollTo(0, 0);
		storyWindow.scrollTo(0, headerHeight / 2);
		await waitFor(() =>
			expect(Number.parseFloat(header.style.getPropertyValue('--stack-header-offset'))).toBeCloseTo(-headerHeight / 2, 0),
		);
		await expect(header).not.toHaveAttribute('data-hidden');

		storyWindow.scrollTo(0, headerHeight * 2);
		await waitFor(() => expect(header).toHaveAttribute('data-hidden'));
		storyWindow.scrollTo(0, headerHeight * 1.5);
		await waitFor(() => expect(Number.parseFloat(header.style.getPropertyValue('--stack-header-offset'))).toBeGreaterThan(-headerHeight));
		await expect(header).not.toHaveAttribute('data-hidden');
		await expect(canvas.getByText(/Header Visible:/)).toHaveTextContent('Direction: UP');

		storyWindow.scrollTo(0, 0);
		await waitFor(() => expect(header.style.getPropertyValue('--stack-header-offset')).toBe('0px'));
	}),
};

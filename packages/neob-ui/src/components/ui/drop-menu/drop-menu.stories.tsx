import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { DropMenu, DropMenuItem } from './drop-menu';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * DropMenu renders an animated dropdown container with staggered children scale-in and scaleFly-out transitions.
 */
const meta = {
	title: 'Experiments/DropMenu',
	component: DropMenu,
	parameters: {
		layout: 'centered',
	},
	args: {
		trigger: () => <></>,
		children: null,
	},
} satisfies Meta<typeof DropMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const items = Array.from({ length: 6 });

		return (
			<div className="min-h-96 p-12">
				<DropMenu
					trigger={({ isOpen, anchor }) => (
						<Button ref={anchor} color="gold" aria-expanded={isOpen}>
							Open Menu
						</Button>
					)}
				>
					{items.map((_, i) => (
						<DropMenuItem key={i} action={() => action(`item-click-${i}`)()}>
							Hello {i}
						</DropMenuItem>
					))}
				</DropMenu>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Menu' }));
		const body = within(document.body);
		await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
		await expect(body.getByRole('menuitem', { name: 'Hello 0' })).toBeVisible();
		await userEvent.hover(canvas.getByRole('button', { name: 'Open Menu' }));
		await expect(body.getByRole('menu')).toBeVisible();
	}),
};

export const FlipsNearViewportEdge: Story = {
	render: () => (
		<div className="fixed inset-x-0 bottom-4 flex justify-center">
			<DropMenu
				trigger={({ isOpen, anchor }) => (
					<Button ref={anchor} aria-expanded={isOpen}>
						Open Menu Near Edge
					</Button>
				)}
			>
				{Array.from({ length: 6 }, (_, index) => (
					<DropMenuItem key={index}>Action {index + 1}</DropMenuItem>
				))}
			</DropMenu>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Menu Near Edge' }));
		const menu = await body.findByRole('menu');

		await waitFor(() => {
			expect(menu).toHaveAttribute('data-side', 'top');
			expect(menu.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
			expect(menu.scrollHeight).toBe(menu.clientHeight);
		});
	}),
};

export const ScrollsWithinViewport: Story = {
	render: () => (
		<div className="fixed inset-x-0 top-3/4 flex justify-center">
			<DropMenu
				trigger={({ isOpen, anchor }) => (
					<Button ref={anchor} aria-expanded={isOpen}>
						Open Tall Menu
					</Button>
				)}
			>
				{Array.from({ length: 40 }, (_, index) => (
					<DropMenuItem key={index}>Action {index + 1}</DropMenuItem>
				))}
			</DropMenu>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Tall Menu' }));
		const menu = await body.findByRole('menu');

		await waitFor(() => {
			expect(menu).toHaveAttribute('data-side', 'top');
			expect(menu.scrollHeight).toBeGreaterThan(menu.clientHeight);
			expect(menu).toHaveAttribute('data-edge-fade-bottom');
			expect(menu.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
			expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
		});

		await userEvent.keyboard('{End}');
		const lastItem = body.getByRole('menuitem', { name: 'Action 40' });
		await waitFor(() => {
			expect(lastItem).toHaveFocus();
			expect(menu.scrollTop).toBeGreaterThan(0);
			expect(menu).toHaveAttribute('data-edge-fade-top');
			expect(menu).not.toHaveAttribute('data-edge-fade-bottom');
			expect(lastItem.getBoundingClientRect().bottom).toBeLessThanOrEqual(menu.getBoundingClientRect().bottom);
		});
	}),
};

export const MinimumHeight: Story = {
	render: () => (
		<div className="fixed inset-x-0 top-4 flex justify-center">
			<DropMenu
				trigger={({ isOpen, anchor }) => (
					<Button ref={anchor} aria-expanded={isOpen}>
						Open Short Menu
					</Button>
				)}
			>
				<DropMenuItem>Only Action</DropMenuItem>
			</DropMenu>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		const trigger = canvas.getByRole('button', { name: 'Open Short Menu' });
		await userEvent.click(trigger);
		const menu = await body.findByRole('menu');
		const availableHeight = window.innerHeight - trigger.getBoundingClientRect().bottom - 8 - 5;
		const minimumHeight = Math.min(128, availableHeight);

		await waitFor(() => {
			expect(menu).toHaveAttribute('data-side', 'bottom');
			expect(menu.getBoundingClientRect().height).toBeCloseTo(minimumHeight, 0);
			expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
		});
	}),
};

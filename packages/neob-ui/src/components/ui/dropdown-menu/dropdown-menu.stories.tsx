import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { DropdownMenu } from './dropdown-menu';

import type { Meta, StoryObj } from '@storybook/react-vite';

type DropdownMenuStoryProperties = {
	triggerLabel: string;
};

/**
 * DropdownMenu is a popover menu displaying standard list options.
 *
 * ### Usage
 * ```tsx
 * import { DropdownMenu } from '@joyful-tools/neob';
 *
 * <DropdownMenu>
 *   <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item action={edit}>Edit</DropdownMenu.Item>
 *     <DropdownMenu.Item action={remove}>Delete</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 * ```
 */
const meta = {
	title: 'Navigation/DropdownMenu',
	component: DropdownMenu,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<DropdownMenuStoryProperties>;

export const Default: Story = {
	args: {
		triggerLabel: 'Open Account Menu',
	},
	render: (args) => {
		return (
			<DropdownMenu>
				<DropdownMenu.Trigger>
					<Button variant="default">{String(args.triggerLabel)}</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="center">
					<DropdownMenu.Label>Account Settings</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item action={() => action('dropdown-view-profile')()}>View Profile</DropdownMenu.Item>
						<DropdownMenu.Item action={() => action('dropdown-open-billing-plans')()}>Open Billing & Plans</DropdownMenu.Item>
						<DropdownMenu.Item action={() => action('dropdown-open-security-settings')()}>Open Security Settings</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Item disabled>Developer API (Beta)</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						className="text-red-dark focus:bg-red focus:text-black dark:text-red-light"
						action={() => action('dropdown-sign-out')()}
					>
						Sign Out
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Account Menu' }));
		await expect(await body.findByText('Account Settings')).toBeInTheDocument();
		await expect(await body.findByText('View Profile')).toBeInTheDocument();
	}),
};

export const FlipsNearViewportEdge: Story = {
	render: () => (
		<div className="fixed inset-x-0 bottom-4 flex justify-center">
			<DropdownMenu>
				<DropdownMenu.Trigger>
					<Button>Open Menu Near Edge</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="center">
					{Array.from({ length: 6 }, (_, index) => (
						<DropdownMenu.Item key={index}>Action {index + 1}</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Menu Near Edge' }));
		const menu = await body.findByRole('menu');
		const scrollArea = menu.querySelector<HTMLElement>('.overflow-y-auto') ?? menu;

		await waitFor(() => {
			expect(menu).toHaveAttribute('data-side', 'top');
			expect(menu.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
			expect(scrollArea.scrollHeight).toBe(scrollArea.clientHeight);
		});
	}),
};

export const ScrollsWithinViewport: Story = {
	render: () => (
		<div className="fixed inset-x-0 top-3/4 flex justify-center">
			<DropdownMenu>
				<DropdownMenu.Trigger>
					<Button>Open Tall Menu</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="center">
					{Array.from({ length: 40 }, (_, index) => (
						<DropdownMenu.Item key={index}>Action {index + 1}</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Tall Menu' }));
		const menu = await body.findByRole('menu');
		const scrollArea = menu.querySelector<HTMLElement>('.overflow-y-auto') ?? menu;

		await waitFor(() => {
			expect(menu).toHaveAttribute('data-side', 'top');
			expect(scrollArea.scrollHeight).toBeGreaterThan(scrollArea.clientHeight);
			expect(scrollArea).toHaveAttribute('data-edge-fade-bottom');
			expect(menu.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
			expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
		});

		await userEvent.keyboard('{End}');
		const lastItem = body.getByRole('menuitem', { name: 'Action 40' });
		await waitFor(() => {
			expect(lastItem).toHaveFocus();
			expect(scrollArea.scrollTop).toBeGreaterThan(0);
			expect(scrollArea).toHaveAttribute('data-edge-fade-top');
			expect(scrollArea).not.toHaveAttribute('data-edge-fade-bottom');
			expect(lastItem.getBoundingClientRect().bottom).toBeLessThanOrEqual(menu.getBoundingClientRect().bottom);
		});
	}),
};

export const MinimumHeight: Story = {
	render: () => (
		<div className="fixed inset-x-0 top-4 flex justify-center">
			<DropdownMenu>
				<DropdownMenu.Trigger>
					<Button>Open Short Menu</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="center">
					<DropdownMenu.Item>Only Action</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		const trigger = canvas.getByRole('button', { name: 'Open Short Menu' });
		await userEvent.click(trigger);
		const menu = await body.findByRole('menu');
		const availableHeight = window.innerHeight - trigger.getBoundingClientRect().bottom - 6 - 5;
		const minimumHeight = Math.min(128, availableHeight);

		await waitFor(() => {
			expect(menu).toHaveAttribute('data-side', 'bottom');
			expect(menu.getBoundingClientRect().height).toBeCloseTo(minimumHeight, 0);
			expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
		});
	}),
};

import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { toast } from './toast';
import { Toaster } from './toaster';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

type ToastButtonConfiguration = {
	label: string;
	variant: ComponentProps<typeof Button>['variant'];
	color?: ComponentProps<typeof Button>['color'];
	kind: 'custom' | 'success' | 'error' | 'info' | 'warning';
	title: string;
	description?: string;
	actionLabel?: string;
	actionEvent?: string;
};

type ToastStoryProperties = {
	buttons: ToastButtonConfiguration[];
};

/**
 * toast provides imperative toaster alerts functions.
 *
 * ### Usage
 * ```tsx
 * import { toast } from '@joyful-tools/neob';
 *
 * toast.success('Operation completed!');
 * toast.error('Something went wrong.');
 * ```
 */
const meta = {
	title: 'Feedback/Toast',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	decorators: [
		(Story) => (
			<>
				<Toaster />
				<Story />
			</>
		),
	],
} satisfies Meta;

export default meta;
type Story = StoryObj<ToastStoryProperties>;

const showToast = (button: ToastButtonConfiguration) => {
	const options = {
		description: button.description,
		action: button.actionLabel
			? {
					label: button.actionLabel,
					action: () => action(button.actionEvent ?? 'toast-action')(),
				}
			: undefined,
	};

	switch (button.kind) {
		case 'success': {
			toast.success(button.title, options);
			return;
		}
		case 'error': {
			toast.error(button.title, options);
			return;
		}
		case 'info': {
			toast.info(button.title, options);
			return;
		}
		case 'warning': {
			toast.warning(button.title, options);
			return;
		}
		default: {
			toast.custom(button.title, options);
		}
	}
};

async function expectToastLayout(toastElement: HTMLElement) {
	const heading = within(toastElement).getByRole('heading');
	const closeButton = within(toastElement).getByRole('button', { name: 'Close notification' });
	const actionButton = within(toastElement)
		.queryAllByRole('button')
		.find((button) => button !== closeButton);
	const description = toastElement.querySelector('p');
	const content = heading.parentElement;
	if (!content) throw new Error('Expected toast content.');
	await waitFor(() => expect(closeButton).toBeVisible());
	const headingBounds = heading.getBoundingClientRect();
	const closeBounds = closeButton.getBoundingClientRect();
	const contentBounds = content.getBoundingClientRect();

	await expect(closeBounds.width).toBe(40);
	await expect(closeBounds.height).toBe(40);
	await expect(closeBounds.right).toBeLessThanOrEqual(contentBounds.right - 8);
	await expect(closeBounds.top).toBeGreaterThanOrEqual(contentBounds.top + 8);
	await expect(closeBounds.bottom).toBeLessThanOrEqual(contentBounds.bottom - 8);
	await expect(toastElement.scrollWidth).toBeLessThanOrEqual(toastElement.clientWidth);

	if (description || !actionButton) {
		const firstLineCenter = headingBounds.top + Number.parseFloat(getComputedStyle(heading).lineHeight) / 2;
		await expect(closeBounds.left).toBeGreaterThanOrEqual(headingBounds.right);
		await expect(Math.abs(closeBounds.top + closeBounds.height / 2 - firstLineCenter)).toBeLessThanOrEqual(1);
	}
	if (!actionButton) return;

	const actionBounds = actionButton.getBoundingClientRect();
	await expect(actionBounds.width).toBeLessThan(contentBounds.width);
	await expect(contentBounds.bottom - actionBounds.bottom).toBeGreaterThanOrEqual(16);
	await expect(contentBounds.right - actionBounds.right).toBeGreaterThanOrEqual(16);

	if (description) {
		await expect(actionBounds.top - description.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(12);
		return;
	}

	await expect(actionBounds.right).toBeLessThanOrEqual(closeBounds.left);
	await expect(Math.abs(actionBounds.top + actionBounds.height / 2 - closeBounds.top - closeBounds.height / 2)).toBeLessThanOrEqual(1);
	if (actionBounds.left < headingBounds.right) {
		await expect(actionBounds.top - headingBounds.bottom).toBeGreaterThanOrEqual(12);
		return;
	}
	await expect(Math.abs(actionBounds.top + actionBounds.height / 2 - headingBounds.top - headingBounds.height / 2)).toBeLessThanOrEqual(1);
}

export const AllVariants: Story = {
	args: {
		buttons: [
			{ label: 'Default', variant: 'default', kind: 'custom', title: 'Default Toast', description: 'This is a standard notification.' },
			{
				label: 'Success',
				variant: 'default',
				color: 'green',
				kind: 'success',
				title: 'Success!',
				description: 'Your changes have been saved.',
			},
			{ label: 'Error', variant: 'danger', kind: 'error', title: 'Something went wrong', description: 'Please try again later.' },
			{ label: 'Info', variant: 'subtle', kind: 'info', title: 'Did you know?', description: 'You can drag toasts to dismiss them.' },
			{ label: 'Warning', variant: 'default', kind: 'warning', title: 'Careful!', description: 'This action may have side effects.' },
		],
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} color={button.color} action={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Default' }));
		await expect(document.body.querySelector('[data-sonner-toast]')).not.toBeNull();
	}),
};

export const WithActions: Story = {
	args: {
		buttons: [
			{
				label: 'Default + Action',
				variant: 'default',
				kind: 'custom',
				title: 'File uploaded',
				description: 'document.pdf has been uploaded successfully.',
				actionLabel: 'Open File',
				actionEvent: 'toast-open-file',
			},
			{
				label: 'Success + Action',
				variant: 'default',
				color: 'green',
				kind: 'success',
				title: 'Team created',
				description: 'Your new team is ready to go.',
				actionLabel: 'Invite Team Members',
				actionEvent: 'toast-invite-team-members',
			},
			{
				label: 'Error + Action',
				variant: 'danger',
				kind: 'error',
				title: 'Connection failed',
				description: 'Could not reach the server.',
				actionLabel: 'Retry',
				actionEvent: 'toast-retry-connection',
			},
		],
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} color={button.color} action={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		for (const button of args.buttons) {
			if (!button.actionLabel) throw new Error('Expected a toast action label.');
			await userEvent.click(canvas.getByRole('button', { name: button.label }));
			const toastElement = body.getByRole('heading', { name: button.title }).closest('[data-sonner-toast]');
			if (!(toastElement instanceof HTMLElement)) throw new Error('Expected a toast notification.');
			await expectToastLayout(toastElement);
			await userEvent.click(within(toastElement).getByRole('button', { name: button.actionLabel }));
			await userEvent.click(within(toastElement).getByRole('button', { name: 'Close notification' }));
			await waitFor(() => expect(toastElement.isConnected).toBe(false));
		}
	}),
};

export const InlineWithActions: Story = {
	...WithActions,
	parameters: {
		docs: {
			description: { story: 'Title-only notifications with compact inline actions, without a description.' },
		},
	},
	args: {
		buttons: [
			{ label: 'Default + Action', variant: 'default', kind: 'custom', title: 'Archived', actionLabel: 'Undo' },
			{ label: 'Success + Action', variant: 'default', color: 'green', kind: 'success', title: 'Saved', actionLabel: 'View' },
			{ label: 'Error + Action', variant: 'danger', kind: 'error', title: 'Connection lost', actionLabel: 'Retry' },
			{ label: 'Info + Action', variant: 'subtle', kind: 'info', title: 'Update ready', actionLabel: 'Install' },
			{ label: 'Warning + Action', variant: 'default', kind: 'warning', title: 'Unsaved changes', actionLabel: 'Save' },
		],
	},
	play: guardPlay(async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		for (const button of args.buttons) {
			if (!button.actionLabel) throw new Error('Expected a toast action label.');
			await userEvent.click(canvas.getByRole('button', { name: button.label }));
			const toastElement = body.getByRole('heading', { name: button.title }).closest('[data-sonner-toast]');
			if (!(toastElement instanceof HTMLElement)) throw new Error('Expected a toast notification.');

			const actionButton = within(toastElement).getByRole('button', { name: button.actionLabel });
			await expect(toastElement.querySelector('p')).toBeNull();
			await waitFor(() => expect(actionButton).toBeVisible());
			await expect(actionButton.offsetWidth).toBeLessThan(toastElement.clientWidth);
			await expect(toastElement.scrollWidth).toBeLessThanOrEqual(toastElement.clientWidth);
			await expectToastLayout(toastElement);
			const closeButton = within(toastElement).getByRole('button', { name: 'Close notification' });
			await expect(actionButton.getBoundingClientRect().right).toBeLessThanOrEqual(closeButton.getBoundingClientRect().left);
			await userEvent.click(actionButton);
			await userEvent.click(within(toastElement).getByRole('button', { name: 'Close notification' }));
			await waitFor(() => expect(toastElement.isConnected).toBe(false));
		}
	}),
};

export const LongTitleWithActions: Story = {
	...InlineWithActions,
	parameters: {
		docs: {
			description: { story: 'Multiline titles and localized actions. Action and dismiss controls wrap together when space is tight.' },
		},
	},
	args: {
		buttons: [
			{
				label: 'Multiline + Action',
				variant: 'danger',
				kind: 'error',
				title: 'Connection timed out. Showing limited messages.',
				actionLabel: 'Retry',
			},
			{
				label: 'Localized + Action',
				variant: 'danger',
				kind: 'error',
				title: 'Anslutningen har avbrutits. Visar begränsade meddelanden.',
				actionLabel: 'Försök igen',
			},
			{
				label: 'Long Action Label',
				variant: 'subtle',
				kind: 'info',
				title: 'Connection restored',
				actionLabel: 'Reconnect to the messaging service',
			},
		],
	},
};

export const Minimal: Story = {
	args: {
		buttons: [
			{ label: 'Title Only', variant: 'default', kind: 'custom', title: 'Copied to clipboard' },
			{ label: 'Success Title Only', variant: 'default', color: 'green', kind: 'success', title: 'Saved' },
			{ label: 'Error Title Only', variant: 'danger', kind: 'error', title: 'Failed' },
			{ label: 'Info Title Only', variant: 'subtle', kind: 'info', title: 'Updated' },
			{ label: 'Warning Title Only', variant: 'default', kind: 'warning', title: 'Unsaved changes' },
		],
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} color={button.color} action={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		for (const button of args.buttons) {
			await userEvent.click(canvas.getByRole('button', { name: button.label }));
			const toastElement = body.getByText(button.title).closest('[data-sonner-toast]');
			if (!(toastElement instanceof HTMLElement)) throw new Error('Expected a toast notification.');

			const closeButton = within(toastElement).getByRole('button', { name: 'Close notification' });
			await expect(toastElement.offsetHeight).toBeGreaterThan(0);
			const heading = within(toastElement).getByRole('heading');
			if (heading.offsetHeight <= Number.parseFloat(getComputedStyle(heading).lineHeight)) {
				await expect(toastElement.offsetHeight).toBeLessThanOrEqual(60);
			}
			await expect(closeButton.offsetWidth).toBe(40);
			await expect(closeButton.offsetHeight).toBe(40);
			await expect(toastElement.querySelector('p')).toBeNull();
			await expectToastLayout(toastElement);

			await userEvent.click(closeButton);
			await waitFor(() => expect(toastElement.isConnected).toBe(false));
		}
	}),
};

export const LongContent: Story = {
	args: {
		buttons: [
			{
				label: 'Long notification',
				variant: 'default',
				kind: 'custom',
				title: 'Your workspace changes have been saved and are ready to share with your team',
				description: 'Uploaded workspace-backup-with-a-very-long-unbroken-filename-2026-10-01-final.json successfully.',
				actionLabel: 'View workspace',
			},
		],
	},
	render: (args) => <Button action={() => showToast(args.buttons[0])}>{args.buttons[0].label}</Button>,
	play: guardPlay(async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		const button = args.buttons[0];
		await userEvent.click(canvas.getByRole('button', { name: button.label }));

		const heading = body.getByRole('heading', { name: button.title });
		const toastElement = heading.closest('[data-sonner-toast]');
		if (!(toastElement instanceof HTMLElement)) throw new Error('Expected a toast notification.');

		const closeButton = within(toastElement).getByRole('button', { name: 'Close notification' });
		await expect(toastElement.offsetHeight).toBeGreaterThan(52);
		await expect(toastElement.scrollWidth).toBeLessThanOrEqual(toastElement.clientWidth);
		await expect(heading.getBoundingClientRect().right).toBeLessThanOrEqual(closeButton.getBoundingClientRect().left);
		await expect(within(toastElement).getByRole('button', { name: 'View workspace' })).toBeInTheDocument();
		await expectToastLayout(toastElement);

		await userEvent.click(closeButton);
		await waitFor(() => expect(toastElement.isConnected).toBe(false));
	}),
};

export const VariantDismissal: Story = {
	args: {
		buttons: [
			{
				label: 'Success Variant',
				variant: 'default',
				color: 'green',
				kind: 'success',
				title: 'Deployment complete',
				description: 'All services are healthy.',
			},
			{
				label: 'Warning Variant',
				variant: 'default',
				kind: 'warning',
				title: 'High memory usage',
				description: 'One worker exceeded the soft limit.',
			},
			{
				label: 'Info Variant',
				variant: 'subtle',
				kind: 'info',
				title: 'Maintenance window',
				description: 'Planned maintenance starts in 15 minutes.',
			},
		],
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} color={button.color} action={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await userEvent.click(canvas.getByRole('button', { name: 'Success Variant' }));
		await expect(body.getByText('Deployment complete')).toBeInTheDocument();
		await expect(body.getByText('All services are healthy.')).toBeInTheDocument();

		await userEvent.click(canvas.getByRole('button', { name: 'Warning Variant' }));
		await expect(body.getByText('High memory usage')).toBeInTheDocument();

		await userEvent.click(canvas.getByRole('button', { name: 'Info Variant' }));
		await expect(body.getByText('Maintenance window')).toBeInTheDocument();

		const lastToast = document.body
			.querySelectorAll('[data-sonner-toast]')
			.item(document.body.querySelectorAll('[data-sonner-toast]').length - 1);
		const closeButton = lastToast?.querySelector('button');

		await expect(closeButton).not.toBeNull();
		await userEvent.click(closeButton!);
		await waitFor(() => {
			expect(lastToast?.isConnected).toBe(false);
		});
	}),
};

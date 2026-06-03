import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { toast } from './toast';
import { Toaster } from './toaster';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

type ToastButtonConfiguration = {
	label: string;
	variant: ComponentProps<typeof Button>['variant'];
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
 * ### General Usage
 * ```tsx
 * import { toast } from 'neob';
 *
 * toast.success('Operation completed!');
 * toast.error('Something went wrong.');
 * ```
 */
const meta = {
	title: 'Feedback/Toast',
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
					onClick: () => action(button.actionEvent ?? 'toast-action')(),
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

export const AllVariants: Story = {
	args: {
		buttons: [
			{ label: 'Default', variant: 'default', kind: 'custom', title: 'Default Toast', description: 'This is a standard notification.' },
			{ label: 'Success', variant: 'accent', kind: 'success', title: 'Success!', description: 'Your changes have been saved.' },
			{ label: 'Error', variant: 'danger', kind: 'error', title: 'Something went wrong', description: 'Please try again later.' },
			{ label: 'Info', variant: 'subtle', kind: 'info', title: 'Did you know?', description: 'You can drag toasts to dismiss them.' },
			{ label: 'Warning', variant: 'default', kind: 'warning', title: 'Careful!', description: 'This action may have side effects.' },
		],
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} onClick={() => showToast(button)}>
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
				variant: 'accent',
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
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} onClick={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Default + Action' }));
		const body = within(document.body);
		await expect(body.getByRole('button', { name: 'Open File' })).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Open File' }));
	}),
};

export const Minimal: Story = {
	args: {
		buttons: [
			{ label: 'Title Only', variant: 'default', kind: 'custom', title: 'Copied to clipboard' },
			{ label: 'Success Title Only', variant: 'accent', kind: 'success', title: 'Saved' },
			{ label: 'Error Title Only', variant: 'danger', kind: 'error', title: 'Failed' },
		],
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} onClick={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Title Only' }));
		await expect(document.body.querySelector('[data-sonner-toast]')).not.toBeNull();
	}),
};

export const VariantDismissal: Story = {
	args: {
		buttons: [
			{
				label: 'Success Variant',
				variant: 'accent',
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
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} onClick={() => showToast(button)}>
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

export const MixedActionsAndClosePaths: Story = {
	args: {
		buttons: [
			{
				label: 'Custom Action',
				variant: 'default',
				kind: 'custom',
				title: 'Draft saved',
				actionLabel: 'Review Draft',
				actionEvent: 'toast-review-draft',
			},
			{
				label: 'Info Action',
				variant: 'subtle',
				kind: 'info',
				title: 'New release available',
				description: 'Version 2.1.0 is ready to install.',
				actionLabel: 'Read Notes',
				actionEvent: 'toast-read-notes',
			},
			{ label: 'Warning Title Only', variant: 'default', kind: 'warning', title: 'Storage nearing limit' },
			{
				label: 'Error Close',
				variant: 'danger',
				kind: 'error',
				title: 'Upload failed',
				description: 'A network error interrupted the upload.',
			},
		],
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} onClick={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await userEvent.click(canvas.getByRole('button', { name: 'Custom Action' }));
		await expect(body.getByText('Draft saved')).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Review Draft' }));

		await userEvent.click(canvas.getByRole('button', { name: 'Info Action' }));
		await expect(body.getByText('New release available')).toBeInTheDocument();
		await expect(body.getByText('Version 2.1.0 is ready to install.')).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Read Notes' }));

		await userEvent.click(canvas.getByRole('button', { name: 'Warning Title Only' }));
		await expect(body.getByText('Storage nearing limit')).toBeInTheDocument();

		await userEvent.click(canvas.getByRole('button', { name: 'Error Close' }));
		await expect(body.getByText('Upload failed')).toBeInTheDocument();
	}),
};

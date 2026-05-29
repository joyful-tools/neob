import { expect, userEvent, within } from '@storybook/test';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { toast } from './toast';
import { Toaster } from './toaster';

import type { Meta, StoryObj } from '@storybook/react-vite';

type ToastButtonConfiguration = {
	label: string;
	variant: React.ComponentProps<typeof Button>['variant'];
	kind: 'custom' | 'success' | 'error' | 'info' | 'warning';
	title: string;
	description?: string;
	actionLabel?: string;
	actionEvent?: string;
};

type ToastStoryProperties = {
	buttons: ToastButtonConfiguration[];
};

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

import { expect, userEvent, within } from '@storybook/test';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { toast } from './toast';
import { Toaster } from './toaster';

import type { Meta, StoryObj } from '@storybook/react-vite';

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
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button
				variant="default"
				onClick={() =>
					toast.custom('Default Toast', {
						description: 'This is a standard notification.',
					})
				}
			>
				Default
			</Button>
			<Button
				variant="accent"
				onClick={() =>
					toast.success('Success!', {
						description: 'Your changes have been saved.',
					})
				}
			>
				Success
			</Button>
			<Button
				variant="danger"
				onClick={() =>
					toast.error('Something went wrong', {
						description: 'Please try again later.',
					})
				}
			>
				Error
			</Button>
			<Button
				variant="subtle"
				onClick={() =>
					toast.info('Did you know?', {
						description: 'You can drag toasts to dismiss them.',
					})
				}
			>
				Info
			</Button>
			<Button
				variant="default"
				onClick={() =>
					toast.warning('Careful!', {
						description: 'This action may have side effects.',
					})
				}
			>
				Warning
			</Button>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Default' }));
		await expect(document.body.querySelector('[data-sonner-toast]')).not.toBeNull();
	}),
};

export const WithActions: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button
				variant="default"
				onClick={() =>
					toast.custom('File uploaded', {
						description: 'document.pdf has been uploaded successfully.',
						action: {
							label: 'Open File',
							onClick: () => action('toast-open-file')(),
						},
					})
				}
			>
				Default + Action
			</Button>
			<Button
				variant="accent"
				onClick={() =>
					toast.success('Team created', {
						description: 'Your new team is ready to go.',
						action: {
							label: 'Invite Team Members',
							onClick: () => action('toast-invite-team-members')(),
						},
					})
				}
			>
				Success + Action
			</Button>
			<Button
				variant="danger"
				onClick={() =>
					toast.error('Connection failed', {
						description: 'Could not reach the server.',
						action: {
							label: 'Retry',
							onClick: () => action('toast-retry-connection')(),
						},
					})
				}
			>
				Error + Action
			</Button>
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
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="default" onClick={() => toast.custom('Copied to clipboard')}>
				Title Only
			</Button>
			<Button variant="accent" onClick={() => toast.success('Saved')}>
				Success Title Only
			</Button>
			<Button variant="danger" onClick={() => toast.error('Failed')}>
				Error Title Only
			</Button>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Title Only' }));
		await expect(document.body.querySelector('[data-sonner-toast]')).not.toBeNull();
	}),
};

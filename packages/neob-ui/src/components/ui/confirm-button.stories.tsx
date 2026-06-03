import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { ConfirmButton } from './confirm-button';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ConfirmButton is a button that requires double clicking / secondary confirmation before execution.
 *
 * ### General Usage
 * ```tsx
 * import { ConfirmButton } from 'neob';
 *
 * <ConfirmButton onConfirm={handleDelete} variant="danger">
 *   Delete Resource
 * </ConfirmButton>
 * ```
 */
const meta = {
	title: 'Inputs/ConfirmButton',
	component: ConfirmButton,
	parameters: {
		layout: 'centered',
	},
	args: {
		title: 'Are you sure?',
		description: 'This is an irreversible action.',
		confirmLabel: 'Delete Item',
		cancelLabel: 'Cancel',
	},
} satisfies Meta<typeof ConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<ConfirmButton {...args} onConfirm={() => action('confirm-button-default-confirm')()}>
			{args.children}
		</ConfirmButton>
	),
	args: {
		children: 'Delete Item',
		onConfirm: () => {},
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Delete Item' }));
		await expect(canvas.getByText('Are you sure?')).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Delete Item' }));
	}),
};

export const SubtleAccent: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<ConfirmButton {...args} onConfirm={() => action('confirm-button-upgrade-confirm')()}>
			{args.children}
		</ConfirmButton>
	),
	args: {
		children: 'Upgrade Plan',
		onConfirm: () => {},
		variant: 'accent',
		confirmVariant: 'accent',
		confirmLabel: 'Confirm Upgrade',
		title: 'Confirm upgrade plan?',
		description: 'You will be billed immediately for the new plan tier.',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Upgrade Plan' }));
		await expect(canvas.getByText('Confirm upgrade plan?')).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Confirm Upgrade' }));
	}),
};

export const AsyncDelete: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	args: {
		children: 'Delete Item Asynchronously',
		onConfirm: () => {},
	},
	render: (args) => (
		<ConfirmButton
			{...args}
			title="Are you sure you want to delete this resource?"
			description="This is an asynchronous operation and will display a loading state for 2 seconds."
			confirmLabel="Delete Item"
			onConfirm={() => {
				action('confirm-button-async-delete-confirm')();
				return new Promise<void>((resolve) => setTimeout(resolve, 2000));
			}}
		>
			Delete Item Asynchronously
		</ConfirmButton>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Delete Item Asynchronously' }));
		await expect(canvas.getByText('Are you sure you want to delete this resource?')).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Delete Item' }));
	}),
};

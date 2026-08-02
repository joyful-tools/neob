import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { ConfirmButton } from './confirm-button';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ConfirmButton is a button that requires double clicking / secondary confirmation before execution.
 *
 * ### Usage
 * ```tsx
 * import { ConfirmButton } from '@joyful-tools/neob';
 *
 * <ConfirmButton onConfirm={handleDelete} variant="danger">
 *   Delete Resource
 * </ConfirmButton>
 * ```
 */
const meta = {
	title: 'Inputs/ConfirmButton',
	component: ConfirmButton,
	tags: ['autodocs'],
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
	render: (args) => (
		<ConfirmButton {...args} onConfirm={() => action('confirm-button-default-confirm')()}>
			{args.children}
		</ConfirmButton>
	),
	args: {
		children: 'Delete Item',
		confirmLabel: 'Confirm Delete',
		onConfirm: () => {},
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Keyboard interaction test (opens and cancels via Escape)
		const trigger1 = canvas.getByRole('button', { name: 'Delete Item' });
		trigger1.focus();
		await userEvent.keyboard('{Enter}');
		await expect(await canvas.findByText('Are you sure?')).toBeInTheDocument();
		await expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus();

		await userEvent.keyboard('{ArrowRight}');
		await expect(canvas.getByRole('button', { name: 'Confirm Delete' })).toHaveFocus();

		await userEvent.keyboard('{Tab}');
		await expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(canvas.queryByText('Are you sure?')).not.toBeInTheDocument();
		});

		// Mouse click interaction test (opens and confirms)
		const trigger2 = await canvas.findByRole('button', { name: 'Delete Item' });
		await userEvent.click(trigger2);
		await expect(await canvas.findByText('Are you sure?')).toBeInTheDocument();
		await expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus();
		await userEvent.click(canvas.getByRole('button', { name: 'Confirm Delete' }));
	}),
};

export const SubtleAccent: Story = {
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

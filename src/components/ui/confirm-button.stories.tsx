import { ConfirmButton } from './confirm-button';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/ConfirmButton',
	component: ConfirmButton,
	parameters: {
		layout: 'centered',
	},
	args: {
		title: 'Are you sure?',
		description: 'This is an irreversible action.',
		confirmLabel: 'Yes, Delete',
		cancelLabel: 'Cancel',
		onConfirm: () => {
			alert('Deleted!');
		},
	},
} satisfies Meta<typeof ConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Delete Item',
	},
};

export const SubtleAccent: Story = {
	args: {
		children: 'Upgrade Plan',
		variant: 'accent',
		confirmVariant: 'accent',
		confirmLabel: 'Confirm Upgrade',
		title: 'Confirm upgrade plan?',
		description: 'You will be billed immediately for the new plan tier.',
	},
};

export const AsyncDelete: Story = {
	args: {
		children: 'Async Delete',
		title: 'Are you sure you want to delete this resource?',
		description: 'This is an asynchronous operation and will display a loading state for 2 seconds.',
		confirmLabel: 'Yes, Delete Async',
		onConfirm: () => new Promise((resolve) => setTimeout(resolve, 2000)),
	},
};

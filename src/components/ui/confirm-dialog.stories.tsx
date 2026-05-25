import * as React from 'react';
import { useState } from 'react';

import { Button } from './button';
import { ConfirmDialog } from './confirm-dialog';
import { GlobalDialogBackdrop } from './global-dialog-backdrop';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Components/ConfirmDialog',
	component: ConfirmDialog,
	parameters: {
		layout: 'centered',
	},
	args: {
		open: false,
		onOpenChange: () => {},
		title: 'Confirm Action',
		description: 'Are you sure you want to proceed?',
		onConfirm: () => {},
	},
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const ConfirmDialogWrapper = ({
	variant = 'default',
	title,
	description,
	resourceName,
	confirmLabel,
}: {
	variant?: 'default' | 'danger' | 'warning';
	title: string;
	description: string;
	resourceName?: string;
	confirmLabel?: string;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<GlobalDialogBackdrop />
			<Button variant={variant === 'danger' ? 'danger' : 'default'} onClick={() => setOpen(true)}>
				{variant === 'danger' ? 'Delete Resource' : 'Save Changes'}
			</Button>
			<ConfirmDialog
				open={open}
				onOpenChange={setOpen}
				title={title}
				description={description}
				variant={variant}
				resourceName={resourceName}
				confirmLabel={confirmLabel}
				onConfirm={() => {
					alert('Confirmed!');
					setOpen(false);
				}}
			/>
		</>
	);
};

export const NormalConfirm: Story = {
	render: () => (
		<ConfirmDialogWrapper
			variant="default"
			title="Save Changes?"
			description="Are you sure you want to save the current configuration settings? This will update your production builds."
			confirmLabel="Save"
		/>
	),
};

export const Destructive: Story = {
	render: () => (
		<ConfirmDialogWrapper
			variant="danger"
			title="Delete Production Database?"
			description="This action is extremely dangerous and cannot be undone. All tables, backups, and configurations will be permanently erased."
			resourceName="delete-production-db"
			confirmLabel="Delete Permanently"
		/>
	),
};

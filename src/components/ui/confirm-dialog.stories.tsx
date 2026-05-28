import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { useState } from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { ConfirmDialog } from './confirm-dialog';
import { GlobalDialogBackdrop } from './global-dialog-backdrop';

import type { Meta } from '@storybook/react-vite';

const meta = {
	title: 'Surfaces/ConfirmDialog',
	component: ConfirmDialog,
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

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
			<Button
				variant={variant === 'danger' ? 'danger' : 'default'}
				onClick={() => {
					action('confirm-dialog-open-change')(true);
					setOpen(true);
				}}
			>
				{variant === 'danger' ? 'Open Delete Confirmation' : 'Open Save Confirmation'}
			</Button>
			<ConfirmDialog
				open={open}
				onOpenChange={(nextOpen) => {
					action('confirm-dialog-open-change')(nextOpen);
					setOpen(nextOpen);
				}}
				title={title}
				description={description}
				variant={variant}
				resourceName={resourceName}
				confirmLabel={confirmLabel}
				onConfirm={() => {
					action('confirm-dialog-confirm')();
					action('confirm-dialog-open-change')(false);
					setOpen(false);
				}}
			/>
		</>
	);
};

export const NormalConfirm = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => (
		<ConfirmDialogWrapper
			variant="default"
			title="Save Changes?"
			description="Are you sure you want to save the current configuration settings? This will update your production builds."
			confirmLabel="Save"
		/>
	),
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Save Confirmation' }));
		await expect(body.getByText('Save Changes?')).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Save' }));
	}),
};

export const Destructive = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => (
		<ConfirmDialogWrapper
			variant="danger"
			title="Delete Production Database?"
			description="This action is extremely dangerous and cannot be undone. All tables, backups, and configurations will be permanently erased."
			resourceName="delete-production-db"
			confirmLabel="Delete Permanently"
		/>
	),
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Delete Confirmation' }));
		await expect(body.getByText('Delete Production Database?')).toBeInTheDocument();
		await expect(body.getByRole('button', { name: 'Delete Permanently' })).toBeInTheDocument();
	}),
};

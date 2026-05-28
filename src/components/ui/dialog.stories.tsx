import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { useState } from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { Dialog } from './dialog';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Surfaces/Dialog',
	component: Dialog,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button
					onClick={() => {
						action('dialog-open-change')(true);
						setOpen(true);
					}}
				>
					Open Compound Dialog
				</Button>
				<Dialog
					open={open}
					onOpenChange={(nextOpen) => {
						action('dialog-open-change')(nextOpen);
						setOpen(nextOpen);
					}}
				>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Dialog Title</Dialog.Title>
							<Dialog.Description>This is a description of what this dialog is for.</Dialog.Description>
						</Dialog.Header>
						<div>
							<p className="text-sm">Dialog content goes here.</p>
						</div>
						<Dialog.Footer>
							<Button
								variant="subtle"
								onClick={() => {
									action('dialog-cancel')();
									action('dialog-open-change')(false);
									setOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button
								variant="accent"
								onClick={() => {
									action('dialog-confirm')();
									action('dialog-open-change')(false);
									setOpen(false);
								}}
							>
								Confirm
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog>
			</>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Compound Dialog' }));
		await expect(body.getByText('Dialog Title')).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Confirm' }));
	}),
};

export const ComposedModal: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button
					variant="accent"
					onClick={() => {
						action('composed-dialog-open-change')(true);
						setOpen(true);
					}}
				>
					Open Composed Dialog
				</Button>
				<Dialog
					open={open}
					onOpenChange={(nextOpen) => {
						action('composed-dialog-open-change')(nextOpen);
						setOpen(nextOpen);
					}}
					title="Composed Dialog Heading"
				>
					<Dialog.Body>
						<p className="text-sm">This is the composed modal body. It has proper standard padding.</p>
					</Dialog.Body>
					<Dialog.Footer>
						<Button
							variant="subtle"
							onClick={() => {
								action('composed-dialog-cancel')();
								action('composed-dialog-open-change')(false);
								setOpen(false);
							}}
						>
							Cancel
						</Button>
						<Button
							variant="accent"
							onClick={() => {
								action('composed-dialog-confirm')();
								action('composed-dialog-open-change')(false);
								setOpen(false);
							}}
						>
							Save Changes
						</Button>
					</Dialog.Footer>
				</Dialog>
			</>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Composed Dialog' }));
		await expect(body.getByText('Composed Dialog Heading')).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Save Changes' }));
	}),
};

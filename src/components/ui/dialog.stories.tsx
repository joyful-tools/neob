import * as React from 'react';
import { useState } from 'react';

import { Button } from './button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';

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
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Compound Dialog</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Dialog Title</DialogTitle>
							<DialogDescription>This is a description of what this dialog is for.</DialogDescription>
						</DialogHeader>
						<div>
							<p className="text-sm">Dialog content goes here.</p>
						</div>
						<DialogFooter>
							<Button variant="subtle" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="accent" onClick={() => setOpen(false)}>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	},
};

export const ComposedModal: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button variant="accent" onClick={() => setOpen(true)}>
					Open Composed Dialog
				</Button>
				<Dialog open={open} onOpenChange={setOpen} title="Composed Dialog Heading">
					<DialogBody>
						<p className="text-sm">This is the composed modal body. It has proper standard padding.</p>
					</DialogBody>
					<DialogFooter>
						<Button variant="subtle" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="accent" onClick={() => setOpen(false)}>
							Save Changes
						</Button>
					</DialogFooter>
				</Dialog>
			</>
		);
	},
};

export const ConfirmDelete: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button variant="danger" onClick={() => setOpen(true)}>
					Delete Item
				</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete Item?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your item and all associated data.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="subtle" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="danger" onClick={() => setOpen(false)}>
								Delete
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	},
};

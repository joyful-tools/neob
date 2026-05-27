import * as React from 'react';
import { useState } from 'react';

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
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Compound Dialog</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Dialog Title</Dialog.Title>
							<Dialog.Description>This is a description of what this dialog is for.</Dialog.Description>
						</Dialog.Header>
						<div>
							<p className="text-sm">Dialog content goes here.</p>
						</div>
						<Dialog.Footer>
							<Button variant="subtle" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="accent" onClick={() => setOpen(false)}>
								Confirm
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
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
					<Dialog.Body>
						<p className="text-sm">This is the composed modal body. It has proper standard padding.</p>
					</Dialog.Body>
					<Dialog.Footer>
						<Button variant="subtle" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="accent" onClick={() => setOpen(false)}>
							Save Changes
						</Button>
					</Dialog.Footer>
				</Dialog>
			</>
		);
	},
};

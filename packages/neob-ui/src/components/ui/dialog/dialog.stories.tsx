import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { Dialog } from './dialog';

import type { Meta, StoryObj } from '@storybook/react-vite';

type DialogStoryProperties = {
	triggerLabel: string;
	title: string;
	description: string;
	body: string;
};

/**
 * Dialog is a standard modal dialog component with backdrop animation.
 *
 * ### Usage
 * ```tsx
 * import { Dialog } from '@timowilhelm/neob';
 *
 * <Dialog>
 *   <Dialog.Trigger>Open Modal</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Modal Heading</Dialog.Title>
 *     </Dialog.Header>
 *     <Dialog.Body>Modal Body Content</Dialog.Body>
 *     <Dialog.Footer>
 *       <Dialog.Close>Close</Dialog.Close>
 *     </Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog>
 * ```
 */
const meta = {
	title: 'Surfaces/Dialog',
	component: Dialog,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<DialogStoryProperties>;

export const Default: Story = {
	args: {
		triggerLabel: 'Open Dialog',
		title: 'Dialog Title',
		description: 'This is a description of what this dialog is for.',
		body: 'Dialog content goes here.',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button
					onClick={() => {
						action('dialog-open-change')(true);
						setOpen(true);
					}}
				>
					{args.triggerLabel}
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
							<Dialog.Title>{args.title}</Dialog.Title>
							<Dialog.Description>{args.description}</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body>
							<p className="text-sm">{args.body}</p>
						</Dialog.Body>
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
		await userEvent.click(canvas.getByRole('button', { name: 'Open Dialog' }));
		await expect(body.getByText('Dialog Title')).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Confirm' }));
	}),
};

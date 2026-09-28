import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { Dialog } from './dialog';
import { GlobalDialogBackdrop } from './global-dialog-backdrop';

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
 * import { Dialog } from '@joyful-tools/neob';
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
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<GlobalDialogBackdrop />
				<Button
					action={() => {
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
								action={() => {
									action('dialog-cancel')();
									action('dialog-open-change')(false);
									setOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button
								color="gold"
								action={() => {
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
		const title = body.getByText('Dialog Title');
		const backdrop = body.getByTestId('modal-backdrop');
		await expect(title).toBeInTheDocument();
		await waitFor(() => expect(backdrop).toHaveStyle({ opacity: '1' }));
		await userEvent.click(body.getByRole('button', { name: 'Confirm' }));
		await waitFor(() => expect(backdrop).toHaveStyle({ pointerEvents: 'none' }));
	}),
};

export const Layered: Story = {
	args: {
		triggerLabel: 'Open Dialog',
		title: 'First Dialog',
		description: 'The first layer remains available after dismissing the second.',
		body: 'Open a second dialog above this one.',
	},
	render: (args) => {
		const [firstOpen, setFirstOpen] = useState(false);
		const [secondOpen, setSecondOpen] = useState(false);

		return (
			<>
				<GlobalDialogBackdrop />
				<Button action={() => setFirstOpen(true)}>{args.triggerLabel}</Button>
				<Dialog open={firstOpen} onOpenChange={setFirstOpen}>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{args.title}</Dialog.Title>
							<Dialog.Description>{args.description}</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body>
							<p className="text-sm">{args.body}</p>
						</Dialog.Body>
						<Dialog.Footer>
							<Button action={() => setSecondOpen(true)}>Open Second Dialog</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog>
				<Dialog open={secondOpen} onOpenChange={setSecondOpen}>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Second Dialog</Dialog.Title>
							<Dialog.Description>Dismiss this dialog to return to the first.</Dialog.Description>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog>
			</>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await userEvent.click(canvas.getByRole('button', { name: 'Open Dialog' }));
		await userEvent.click(body.getByRole('button', { name: 'Open Second Dialog' }));
		await expect(body.getByText('Second Dialog')).toBeVisible();
		expect(body.queryByText('First Dialog')).not.toBeInTheDocument();
		expect(body.getAllByTestId('modal-backdrop')).toHaveLength(1);

		await userEvent.click(body.getByTestId('modal-backdrop'));
		await waitFor(() => expect(body.queryByText('Second Dialog')).not.toBeInTheDocument());
		await waitFor(() => expect(body.getByText('First Dialog')).toBeVisible());
	}),
};

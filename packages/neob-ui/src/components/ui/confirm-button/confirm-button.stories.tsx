import { ComponentProps } from 'react';
import { action } from 'storybook/actions';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

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
 * <ConfirmButton action={handleDelete} variant="danger">
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

const colors = ['cyan', 'gold', 'zinc', 'coral', 'blue', 'purple', 'pink', 'yellow', 'red', 'green'] satisfies NonNullable<
	ComponentProps<typeof ConfirmButton>['color']
>[];

export const Default: Story = {
	render: (args) => (
		<ConfirmButton {...args} action={() => action('confirm-button-default-confirm')()}>
			{args.children}
		</ConfirmButton>
	),
	args: {
		children: 'Delete Item',
		confirmLabel: 'Confirm Delete',
		action: () => {},
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);

		// Keyboard interaction test (opens and cancels via Escape)
		const trigger1 = canvas.getByRole('button', { name: 'Delete Item' });
		trigger1.focus();
		await userEvent.keyboard('{Enter}');
		await expect(await body.findByText('Are you sure?')).toBeInTheDocument();
		await expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus();
		const keyboardDialog = body.getByRole('dialog', { name: 'Are you sure?' });
		await waitFor(() => {
			expect(keyboardDialog).not.toHaveAttribute('data-opening');
		});

		await userEvent.keyboard('{ArrowRight}');
		await expect(body.getByRole('button', { name: 'Confirm Delete' })).toHaveFocus();

		await userEvent.keyboard('{Tab}');
		await expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus();

		fireEvent.keyDown(keyboardDialog, { key: 'Escape' });
		expect(keyboardDialog).toHaveAttribute('data-closing', '');
		expect(getComputedStyle(keyboardDialog).overflowX).toBe('hidden');
		expect(getComputedStyle(keyboardDialog).overflowY).toBe('hidden');
		expect(getComputedStyle(trigger1).visibility).toBe('hidden');
		await waitFor(() => {
			expect(body.queryByText('Are you sure?')).not.toBeInTheDocument();
		});

		// Mouse click interaction test (opens and confirms)
		const trigger2 = await canvas.findByRole('button', { name: 'Delete Item' });
		fireEvent.click(trigger2);
		const animatedDialog = body.getByRole('dialog', { name: 'Are you sure?' });
		await waitFor(() => {
			expect(animatedDialog.style.transform).not.toBe('');
		});
		await expect(animatedDialog).toBeInTheDocument();
		await expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus();
		await waitFor(() => {
			expect(animatedDialog).not.toHaveAttribute('data-opening');
		});
		fireEvent.click(canvasElement);
		expect(animatedDialog).toHaveAttribute('data-closing', '');
		expect(getComputedStyle(trigger2).visibility).toBe('hidden');
		await waitFor(() => {
			expect(body.queryByText('Are you sure?')).not.toBeInTheDocument();
		});
		const restoredTrigger = await canvas.findByRole('button', { name: 'Delete Item' });
		await waitFor(() => {
			expect(restoredTrigger).toHaveFocus();
		});

		await userEvent.click(restoredTrigger);
		await expect(await body.findByText('Are you sure?')).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Confirm Delete' }));
	}),
};

export const Colors: Story = {
	args: {
		children: 'Confirm',
		action: () => {},
	},
	render: () => (
		<div className="flex max-w-2xl flex-wrap gap-3">
			{colors.map((color) => (
				<ConfirmButton
					key={color}
					color={color}
					confirmColor={color}
					title={`Confirm ${color}?`}
					confirmLabel="Confirm"
					action={() => action(`confirm-${color}`)()}
				>
					{color}
				</ConfirmButton>
			))}
		</div>
	),
};

export const AsyncDelete: Story = {
	args: {
		children: 'Delete Item Asynchronously',
		action: () => {},
	},
	render: (args) => (
		<ConfirmButton
			{...args}
			title="Are you sure you want to delete this resource?"
			description="This is an asynchronous operation and will display a loading state for 2 seconds."
			confirmLabel="Delete Item"
			action={() => {
				action('confirm-button-async-delete-confirm')();
				return new Promise<void>((resolve) => setTimeout(resolve, 2000));
			}}
		>
			Delete Item Asynchronously
		</ConfirmButton>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Delete Item Asynchronously' }));
		await expect(body.getByText('Are you sure you want to delete this resource?')).toBeInTheDocument();
		await userEvent.click(body.getByRole('button', { name: 'Delete Item' }));
		await userEvent.keyboard('{Escape}');
		await expect(body.getByRole('dialog', { name: 'Are you sure you want to delete this resource?' })).toBeInTheDocument();
		await waitFor(
			() => {
				expect(body.queryByRole('dialog', { name: 'Are you sure you want to delete this resource?' })).not.toBeInTheDocument();
			},
			{ timeout: 2500 },
		);
	}),
};

export const LongContent: Story = {
	args: {
		children: 'Review long confirmation',
		title: 'Confirm applying these changes to every selected production environment?',
		description:
			'This confirmation contains intentionally long copy and an uninterrupted identifier-that-must-wrap-within-the-overlay-without-making-it-wider.',
		cancelLabel: 'Go back without applying changes',
		confirmLabel: 'Apply changes to every environment',
		action: () => {},
	},
	render: (args) => (
		<ConfirmButton {...args} action={() => action('confirm-button-long-content-confirm')()}>
			{args.children}
		</ConfirmButton>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Review long confirmation' }));
		const dialog = await body.findByRole('dialog', {
			name: 'Confirm applying these changes to every selected production environment?',
		});
		const confirmButton = body.getByRole('button', { name: 'Apply changes to every environment' });

		await waitFor(() => {
			expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(384);
			expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
			expect(getComputedStyle(confirmButton).whiteSpace).toBe('normal');
		});
	}),
};

interface ViewportEdgeCase {
	readonly label: string;
	readonly className: string;
}

const viewportEdgeCases: readonly ViewportEdgeCase[] = [
	{ label: 'Top left', className: 'flex items-start justify-start' },
	{ label: 'Top right', className: 'flex items-start justify-end' },
	{ label: 'Bottom left', className: 'flex items-end justify-start' },
	{ label: 'Bottom right', className: 'flex items-end justify-end' },
];

export const ViewportEdges: Story = {
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		children: 'Confirm',
		action: () => {},
	},
	render: () => (
		<div className="grid h-screen grid-cols-2 grid-rows-2">
			{viewportEdgeCases.map(({ label, className }) => (
				<div key={label} className={className}>
					<ConfirmButton
						title={`Confirm ${label}?`}
						description="This overlay stays inside the viewport."
						confirmLabel="Confirm"
						action={() => action(`confirm-button-${label.toLowerCase().replaceAll(' ', '-')}`)()}
					>
						{label}
					</ConfirmButton>
				</div>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		const viewport = canvasElement.ownerDocument.documentElement;
		const minimumViewportGap = 7.5;

		for (const { label } of viewportEdgeCases) {
			const trigger = canvas.getByRole('button', { name: label });
			await userEvent.click(trigger);
			const dialog = await body.findByRole('dialog', { name: `Confirm ${label}?` });
			await waitFor(
				() => {
					expect(trigger).toHaveAttribute('data-morph-source', 'hidden');
					expect(getComputedStyle(trigger).visibility).toBe('hidden');
				},
				{ timeout: 2500 },
			);

			await waitFor(() => {
				const bounds = dialog.getBoundingClientRect();
				expect(bounds.left).toBeGreaterThanOrEqual(minimumViewportGap);
				expect(bounds.top).toBeGreaterThanOrEqual(minimumViewportGap);
				expect(bounds.right).toBeLessThanOrEqual(viewport.clientWidth - minimumViewportGap);
				expect(bounds.bottom).toBeLessThanOrEqual(viewport.clientHeight - minimumViewportGap);
			});

			fireEvent.keyDown(dialog, { key: 'Escape' });
			expect(dialog).toHaveAttribute('data-closing', '');
			expect(getComputedStyle(trigger).visibility).toBe('hidden');
			await waitFor(() => {
				expect(body.queryByRole('dialog', { name: `Confirm ${label}?` })).not.toBeInTheDocument();
			});
			const restoredTrigger = canvas.getByRole('button', { name: label });
			await waitFor(() => {
				expect(restoredTrigger).toHaveFocus();
				expect(getComputedStyle(restoredTrigger).visibility).toBe('visible');
			});
		}
	}),
};

export const ClippingContainers: Story = {
	args: {
		children: 'Delete clipped item',
		action: () => {},
	},
	render: (args) => (
		<div data-testid="clipping-container" className="h-24 w-32 overflow-hidden rounded-xl border-2 border-edge bg-white dark:bg-zinc">
			<div className="h-full overflow-auto">
				<div className="flex min-h-48 items-start justify-center pt-2">
					<ConfirmButton {...args} title="Delete the clipped item?" confirmLabel="Delete" action={() => action('confirm-clipped-item')()}>
						Delete clipped item
					</ConfirmButton>
				</div>
			</div>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		const clippingContainer = canvas.getByTestId('clipping-container');

		await userEvent.click(canvas.getByRole('button', { name: 'Delete clipped item' }));
		const dialog = await body.findByRole('dialog', { name: 'Delete the clipped item?' });

		await waitFor(() => {
			expect(clippingContainer.contains(dialog)).toBe(false);
			expect(dialog.getBoundingClientRect().width).toBeGreaterThan(clippingContainer.getBoundingClientRect().width);
			expect(dialog).toBeVisible();
		});
	}),
};

export const ScrollTracking: Story = {
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		children: 'Confirm while scrolling',
		action: () => {},
	},
	render: () => (
		<div className="relative h-[200vh]">
			<div className="absolute top-[50vh] left-1/2 -translate-x-1/2">
				<ConfirmButton
					title="Keep scrolling?"
					description="The portaled overlay tracks its trigger while the page scrolls."
					confirmLabel="Confirm"
					action={() => action('confirm-button-scroll-tracking')()}
				>
					Confirm while scrolling
				</ConfirmButton>
			</div>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		const storyWindow = canvasElement.ownerDocument.defaultView;
		if (!storyWindow) throw new Error('Story window is unavailable.');

		storyWindow.scrollTo(0, 0);
		const trigger = canvas.getByRole('button', { name: 'Confirm while scrolling' });
		const anchor = trigger.parentElement;
		if (!anchor) throw new Error('ConfirmButton anchor is unavailable.');
		const closedAnchorBounds = anchor.getBoundingClientRect();
		const closedTriggerBounds = trigger.getBoundingClientRect();
		await userEvent.click(trigger);
		const dialog = await body.findByRole('dialog', { name: 'Keep scrolling?' });
		await waitFor(() => {
			expect(dialog).not.toHaveAttribute('data-opening');
		});
		const openAnchorBounds = anchor.getBoundingClientRect();
		const openTriggerBounds = trigger.getBoundingClientRect();
		expect(openAnchorBounds.width).toBe(closedAnchorBounds.width);
		expect(openAnchorBounds.height).toBe(closedAnchorBounds.height);
		expect(openTriggerBounds.width).toBe(closedTriggerBounds.width);
		expect(openTriggerBounds.height).toBe(closedTriggerBounds.height);
		expect(trigger.style.transform).toBe('');
		const initialOffset = dialog.getBoundingClientRect().top - openAnchorBounds.top;

		storyWindow.scrollBy(0, 40);
		await waitFor(() => {
			const currentOffset = dialog.getBoundingClientRect().top - anchor.getBoundingClientRect().top;
			expect(Math.abs(currentOffset - initialOffset)).toBeLessThan(1);
		});

		await userEvent.keyboard('{Escape}');
		storyWindow.scrollTo(0, 0);
	}),
};

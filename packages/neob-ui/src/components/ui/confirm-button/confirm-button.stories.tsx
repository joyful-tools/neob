import { ComponentProps } from 'react';
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
		await userEvent.click(canvas.getByRole('button', { name: 'Delete Item Asynchronously' }));
		await expect(canvas.getByText('Are you sure you want to delete this resource?')).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Delete Item' }));
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
		const viewport = canvasElement.ownerDocument.documentElement;
		const minimumViewportGap = 7.5;

		for (const { label } of viewportEdgeCases) {
			const trigger = canvas.getByRole('button', { name: label });
			await userEvent.click(trigger);
			const dialog = await canvas.findByRole('dialog', { name: `Confirm ${label}?` });

			await waitFor(() => {
				const bounds = dialog.getBoundingClientRect();
				expect(bounds.left).toBeGreaterThanOrEqual(minimumViewportGap);
				expect(bounds.top).toBeGreaterThanOrEqual(minimumViewportGap);
				expect(bounds.right).toBeLessThanOrEqual(viewport.clientWidth - minimumViewportGap);
				expect(bounds.bottom).toBeLessThanOrEqual(viewport.clientHeight - minimumViewportGap);
			});

			await userEvent.keyboard('{Escape}');
			await waitFor(() => {
				expect(canvas.queryByRole('dialog', { name: `Confirm ${label}?` })).not.toBeInTheDocument();
			});
			await expect(canvas.getByRole('button', { name: label })).toHaveFocus();
		}
	}),
};

export const ScrollRelease: Story = {
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
					description="The overlay leaves with its trigger once the trigger is outside the viewport."
					confirmLabel="Confirm"
					action={() => action('confirm-button-scroll-release')()}
				>
					Confirm while scrolling
				</ConfirmButton>
			</div>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const storyWindow = canvasElement.ownerDocument.defaultView;
		if (!storyWindow) throw new Error('Story window is unavailable.');

		storyWindow.scrollTo(0, 0);
		await userEvent.click(canvas.getByRole('button', { name: 'Confirm while scrolling' }));
		const dialog = await canvas.findByRole('dialog', { name: 'Keep scrolling?' });
		const anchor = dialog.parentElement;
		if (!anchor) throw new Error('ConfirmButton anchor is unavailable.');

		storyWindow.scrollBy(0, anchor.getBoundingClientRect().bottom + 1);
		await waitFor(() => {
			expect(anchor.getBoundingClientRect().bottom).toBeLessThanOrEqual(0);
			expect(dialog.getBoundingClientRect().top).toBeLessThan(8);
			expect(dialog.getBoundingClientRect().bottom).toBeGreaterThan(0);
		});

		const releasedTop = dialog.getBoundingClientRect().top;
		storyWindow.scrollBy(0, 40);
		await waitFor(() => {
			expect(dialog.getBoundingClientRect().top).toBeLessThanOrEqual(releasedTop - 39.5);
		});

		storyWindow.scrollBy(0, dialog.getBoundingClientRect().bottom + 1);
		await waitFor(() => {
			expect(dialog.getBoundingClientRect().bottom).toBeLessThanOrEqual(0);
		});

		await userEvent.keyboard('{Escape}');
		storyWindow.scrollTo(0, 0);
	}),
};

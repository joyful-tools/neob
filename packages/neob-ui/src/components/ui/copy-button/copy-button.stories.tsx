import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { CopyButton } from './copy-button';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * CopyButton writes text to the clipboard and briefly confirms success.
 *
 * ### Usage
 * ```tsx
 * import { CopyButton } from '@joyful.tools/neob';
 *
 * <CopyButton text="bun add @joyful.tools/neob" />
 * ```
 */
const meta = {
	title: 'Inputs/CopyButton',
	component: CopyButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		text: 'bun add @joyful.tools/neob',
	},
	render: (args) => (
		<div className="flex items-center gap-2 rounded-lg border border-edge bg-card p-3">
			<code className="text-sm">bun add @joyful.tools/neob</code>
			<CopyButton {...args} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Copy to clipboard' });
		await expect(button).not.toHaveAttribute('data-copied');
		await userEvent.click(button);
		await waitFor(() => expect(canvas.getByRole('button', { name: 'Copied to clipboard' })).toHaveAttribute('data-copied'));
	}),
};

export const Disabled: Story = {
	args: {
		text: 'Unavailable value',
		disabled: true,
	},
	play: guardPlay(async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Copy to clipboard' });
		await expect(button).toBeDisabled();
		await expect(button).not.toHaveAttribute('data-copied');
	}),
};

export const PreventedCopy: Story = {
	args: {
		text: 'Keep this out of the clipboard',
	},
	render: (args) => <CopyButton {...args} onClick={(event) => event.preventDefault()} />,
	play: guardPlay(async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Copy to clipboard' });
		await userEvent.click(button);
		await new Promise((resolve) => globalThis.setTimeout(resolve, 25));
		await expect(button).not.toHaveAttribute('data-copied');
	}),
};

import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { Tooltip } from './tooltip';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Feedback/Tooltip',
	component: Tooltip,
	parameters: {
		layout: 'centered',
	},
	decorators: [
		(Story) => (
			<Tooltip.Provider>
				<Story />
			</Tooltip.Provider>
		),
	],
	tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		content: 'This is a premium neo-brutalist tooltip!',
		side: 'top',
		children: <Button variant="subtle">Hover Me</Button>,
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.hover(canvas.getByRole('button', { name: 'Hover Me' }));
		await expect(await within(document.body).findByRole('tooltip')).toHaveTextContent('This is a premium neo-brutalist tooltip!');
	}),
};

export const GatedTouch: Story = {
	args: {
		content: 'Success! Long press worked.',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="flex flex-col items-center gap-4 p-8">
			<p className="max-w-sm text-center text-sm">
				This tooltip is touch-gated for mobile devices. It opens immediately on mouse hover, but on touch devices it requires a deliberate
				long-press (700ms) to avoid misfires during scrolling.
			</p>
			<Tooltip {...args}>
				<Button variant="accent">Touch / Hover Test</Button>
			</Tooltip>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.hover(canvas.getByRole('button', { name: 'Touch / Hover Test' }));
		await expect(await within(document.body).findByRole('tooltip')).toHaveTextContent('Success! Long press worked.');
	}),
};

export const TouchLongPressBehavior: Story = {
	args: {
		content: 'Long press confirmed.',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="flex flex-col items-center gap-4 p-8">
			<Tooltip {...args}>
				<Button variant="accent">Hold To Open</Button>
			</Tooltip>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Hold To Open' });

		trigger.dispatchEvent(new Event('touchstart', { bubbles: true, cancelable: true }));
		await new Promise((resolve) => globalThis.setTimeout(resolve, 150));
		trigger.dispatchEvent(new Event('touchend', { bubbles: true, cancelable: true }));

		await waitFor(() => {
			expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument();
		});

		trigger.dispatchEvent(new Event('touchstart', { bubbles: true, cancelable: true }));

		await waitFor(
			async () => {
				expect(await within(document.body).findByRole('tooltip')).toHaveTextContent('Long press confirmed.');
			},
			{ timeout: 1200 },
		);

		trigger.dispatchEvent(new Event('touchend', { bubbles: true, cancelable: true }));
	}),
};

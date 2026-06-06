import { expect, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { ExternalLink } from './external-link';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ExternalLink is an anchor tag wrapper that opens links in a new tab by default
 * and reveals a sliding ArrowSquareOut icon on hover/focus.
 */
const meta = {
	title: 'Component/ExternalLink',
	component: ExternalLink,
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof ExternalLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div className="font-sans text-xl text-black dark:text-white">
			Please <ExternalLink {...args} data-testid="link" /> to read more.
		</div>
	),
	args: {
		href: 'https://github.com',
		openInNewTab: true,
		children: 'View on Github',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const link = canvas.getByTestId('link');

		// Focus the link to trigger the sliding icon animation
		link.focus();

		await waitFor(async () => {
			await expect(canvas.getByTestId('icon')).toBeVisible();
		});
	}),
};

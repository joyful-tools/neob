import { LoadingBars } from './loading-bars';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * LoadingBars is an animated loader showing jumping/pulsing bars.
 *
 * ### General Usage
 * ```tsx
 * import { LoadingBars } from 'neob';
 *
 * <LoadingBars />
 * ```
 */
const meta = {
	title: 'Feedback/LoadingBars',
	component: LoadingBars,
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof LoadingBars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GoldLoader: Story = {
	args: {
		colorClassName: 'bg-gold',
	},
};

export const BlueLoader: Story = {
	args: {
		colorClassName: 'bg-blue',
	},
};

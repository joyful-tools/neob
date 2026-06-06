import { TextError } from './text-error';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * TextError applies a wavy red underline to inline text elements.
 */
const meta = {
	title: 'Experiments/TextError',
	component: TextError,
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof TextError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div className="font-sans text-xl text-black dark:text-white">
			The quick brown <TextError {...args} /> the lazy dog
		</div>
	),
	args: {
		children: 'fox jumps over',
	},
};

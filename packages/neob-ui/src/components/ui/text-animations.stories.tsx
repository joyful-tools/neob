import { TextScramble, TextShake, TextSkew } from './text-animations';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * TextAnimations showcases three fun, interactive typography animation styles: Scramble, Shake, and Skew.
 */
const meta = {
	title: 'Experiments/TextAnimations',
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scramble: Story = {
	render: () => (
		<div>
			<TextScramble text="HELLO World" className="font-display text-4xl font-black text-black dark:text-white" />
		</div>
	),
};

export const Shake: Story = {
	render: () => (
		<div>
			<TextShake text="SHAKING VIBRATIONS" className="font-display text-4xl font-black text-black" />
		</div>
	),
};

export const Skew: Story = {
	render: () => (
		<div>
			<TextSkew text="SKEWING PROPULSION" className="font-display text-4xl font-black text-black" />
		</div>
	),
};

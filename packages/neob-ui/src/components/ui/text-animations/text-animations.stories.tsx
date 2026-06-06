import { TextScramble, TextShake, TextSkew, TextWave } from './text-animations';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * TextAnimations showcases four fun, interactive typography animation styles: Scramble, Shake, Skew, and Wave.
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
			<TextShake text="SHAKING VIBRATIONS" className="font-display text-4xl font-black text-black dark:text-white" />
		</div>
	),
};

export const Skew: Story = {
	render: () => (
		<div>
			<TextSkew text="SKEWING PROPULSION" className="font-display text-4xl font-black text-black dark:text-white" />
		</div>
	),
};

export const Wave: Story = {
	render: () => (
		<div>
			<TextWave text="WAVING RIPPLES" className="font-display text-4xl font-black text-black dark:text-white" />
		</div>
	),
};

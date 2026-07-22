import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Experiments/ShimmerText',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <div className="shimmer-text">Thinking</div>,
};

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Utility/ShimmerText',
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

export const TextLengths: Story = {
	render: () => (
		<div className="flex max-w-2xl flex-col items-start gap-6 p-6">
			<span className="shimmer-text text-xs">JS</span>
			<span className="shimmer-text">JS</span>
			<span className="shimmer-text text-4xl font-bold">JS</span>
			<p className="shimmer-text">A little shimmer should travel all the way across a longer sentence.</p>
			<p className="shimmer-text max-w-64">Longer sentences can wrap onto multiple lines with the shimmer clipped to the letters.</p>
		</div>
	),
};

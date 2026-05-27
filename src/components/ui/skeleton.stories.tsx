import * as React from 'react';

import { Skeleton } from './skeleton';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Feedback/Skeleton',
	component: Skeleton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		className: 'h-6 w-32',
	},
};

export const ListPlaceholder: Story = {
	render: () => (
		<div className="w-96">
			<Skeleton.List itemCount={3} />
		</div>
	),
};

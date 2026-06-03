import { Skeleton } from './skeleton';

import type { Meta, StoryObj } from '@storybook/react-vite';

type SkeletonListStoryProperties = {
	itemCount: number;
};

/**
 * Skeleton displays pulsing placeholders shown while data is loading.
 *
 * ### General Usage
 * ```tsx
 * import { Skeleton } from 'neob';
 *
 * <Skeleton className="h-10 w-full" />
 * ```
 */
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

export const ListPlaceholder: StoryObj<SkeletonListStoryProperties> = {
	args: {
		itemCount: 3,
	},
	render: (args) => (
		<div className="w-96">
			<Skeleton.List {...args} />
		</div>
	),
};

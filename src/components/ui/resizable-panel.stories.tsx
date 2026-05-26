import * as React from 'react';

import { ResizablePanel } from './resizable-panel';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Utils/ResizablePanel',
	component: ResizablePanel,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ResizablePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
	render: () => {
		return (
			<div className="flex h-64 w-[500px] overflow-hidden rounded-xl border-2 border-black bg-white text-black shadow-brutal dark:bg-zinc dark:text-white">
				<ResizablePanel direction="horizontal" defaultSize={200} minSize={100} maxSize={350}>
					<div className="flex h-full items-center justify-center bg-orange-light p-4 text-center font-bold">Sidebar (Drag Right Edge)</div>
				</ResizablePanel>
				<div className="flex flex-1 items-center justify-center p-4 text-center font-medium">
					Main content area (takes up remaining space)
				</div>
			</div>
		);
	},
};

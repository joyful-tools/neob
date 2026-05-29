import * as React from 'react';
import { expect, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Pill } from './pill';

import type { Meta, StoryObj } from '@storybook/react-vite';

type PillCollectionStoryProperties = {
	items: Array<{
		label: string;
		color?: 'orange' | 'gold' | 'red' | 'green' | 'blue' | 'purple' | 'pink' | 'yellow' | 'zinc' | 'white';
		size?: 'xs' | 'sm' | 'md' | 'lg';
	}>;
};

const meta = {
	title: 'Data Display/Pill',
	component: Pill,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		color: {
			control: 'select',
			options: ['orange', 'gold', 'red', 'green', 'blue', 'purple', 'pink', 'yellow', 'zinc', 'white'],
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
		},
		rounded: {
			control: 'select',
			options: ['full', 'md', 'sm'],
		},
	},
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Beta',
		color: 'orange',
		size: 'sm',
		rounded: 'md',
	},
};

export const AllColors: StoryObj<PillCollectionStoryProperties> = {
	args: {
		items: [
			{ label: 'Orange', color: 'orange' },
			{ label: 'Gold', color: 'gold' },
			{ label: 'Red', color: 'red' },
			{ label: 'Green', color: 'green' },
			{ label: 'Blue', color: 'blue' },
			{ label: 'Purple', color: 'purple' },
			{ label: 'Pink', color: 'pink' },
			{ label: 'Yellow', color: 'yellow' },
			{ label: 'Zinc', color: 'zinc' },
			{ label: 'White', color: 'white' },
		],
	},
	render: (args) => (
		<div className="flex flex-wrap gap-2">
			{args.items.map((item) => (
				<Pill key={item.label} color={item.color}>
					{item.label}
				</Pill>
			))}
		</div>
	),
};

export const WithRefAndCustomAttributes: Story = {
	args: {
		children: 'Interactive Tag',
		color: 'white',
		size: 'lg',
		rounded: 'full',
	},
	render: (args) => {
		const pillReference = React.useRef<HTMLSpanElement>(null);
		const [refStatus, setRefStatus] = React.useState('missing');

		React.useEffect(() => {
			setRefStatus(pillReference.current ? pillReference.current.tagName.toLowerCase() : 'missing');
		}, []);

		return (
			<div className="flex flex-col gap-3">
				<Pill
					{...args}
					ref={pillReference}
					className="uppercase shadow-cel-sm"
					data-testid="pill-ref-target"
					title="Interactive tag pill"
				/>
				<p className="font-mono text-sm font-bold">Ref Target: {refStatus}</p>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const pill = canvas.getByTestId('pill-ref-target');

		await expect(canvas.getByText('Ref Target: span')).toBeInTheDocument();
		await expect(pill).toHaveAttribute('title', 'Interactive tag pill');
		await expect(pill).toHaveClass('uppercase');
		await expect(pill).toHaveClass('shadow-cel-sm');
		await expect(pill).toHaveTextContent('Interactive Tag');
	}),
};

export const Sizes: StoryObj<PillCollectionStoryProperties> = {
	args: {
		items: [
			{ label: 'Extra Small', size: 'xs' },
			{ label: 'Small', size: 'sm' },
			{ label: 'Medium', size: 'md' },
			{ label: 'Large', size: 'lg' },
		],
	},
	render: (args) => (
		<div className="flex items-center gap-2">
			{args.items.map((item) => (
				<Pill key={item.label} size={item.size}>
					{item.label}
				</Pill>
			))}
		</div>
	),
};

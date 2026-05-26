import * as React from 'react';

import { Pill } from './pill';

import type { Meta, StoryObj } from '@storybook/react-vite';

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

export const AllColors: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Pill color="orange">Orange</Pill>
			<Pill color="gold">Gold</Pill>
			<Pill color="red">Red</Pill>
			<Pill color="green">Green</Pill>
			<Pill color="blue">Blue</Pill>
			<Pill color="purple">Purple</Pill>
			<Pill color="pink">Pink</Pill>
			<Pill color="yellow">Yellow</Pill>
			<Pill color="zinc">Zinc</Pill>
			<Pill color="white">White</Pill>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Pill size="xs">Extra Small</Pill>
			<Pill size="sm">Small</Pill>
			<Pill size="md">Medium</Pill>
			<Pill size="lg">Large</Pill>
		</div>
	),
};

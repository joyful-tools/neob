import * as React from 'react';

import { SensitiveInput } from './sensitive-input';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/SensitiveInput',
	component: SensitiveInput,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: {
			control: 'boolean',
		},
		placeholder: {
			control: 'text',
		},
	},
} satisfies Meta<typeof SensitiveInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		'aria-label': 'Password input',
		placeholder: 'Enter password...',
	},
};

export const WithValue: Story = {
	args: {
		'aria-label': 'Password input with value',
		defaultValue: 'my-super-secret-password',
	},
};

export const Disabled: Story = {
	args: {
		'aria-label': 'Disabled password input',
		defaultValue: 'secure-token',
		disabled: true,
	},
};

export const WithLabel: Story = {
	render: () => (
		<div className="flex w-64 flex-col gap-2">
			<label htmlFor="token" className="text-sm font-bold text-black dark:text-white">
				API Token
			</label>
			<SensitiveInput id="token" placeholder="Enter API token" />
		</div>
	),
};

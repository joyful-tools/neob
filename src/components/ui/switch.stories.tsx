import * as React from 'react';

import { Switch } from './switch';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Switch',
	component: Switch,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'accent', 'success'],
		},
		disabled: {
			control: 'boolean',
		},
		label: {
			control: 'text',
		},
	},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Enable Push Notifications',
		description: 'We will send you updates on your account activity.',
	},
};

export const AccentColor: Story = {
	args: {
		label: 'Enable Gold Accent Mode',
		description: 'Use the custom brand accent colors.',
		variant: 'accent',
		defaultChecked: true,
	},
};

export const SuccessColor: Story = {
	args: {
		label: 'Online Status',
		description: 'Display active indicator in dashboard.',
		variant: 'success',
		defaultChecked: true,
	},
};

export const DisabledState: Story = {
	args: {
		label: 'Automatic Backups (Locked)',
		description: 'Contact your administrator to change backups preferences.',
		disabled: true,
		defaultChecked: true,
	},
};

export const ValidationError: Story = {
	render: (arguments_) => {
		const [checked, setChecked] = React.useState(false);
		const error = checked ? undefined : 'You must agree to the privacy policy.';

		return <Switch {...arguments_} checked={checked} onCheckedChange={setChecked} error={error} />;
	},
	args: {
		label: 'Agree to privacy policy',
		description: 'Required choice to register.',
	},
};

export const ControlLast: Story = {
	args: {
		label: 'Show Advanced Options',
		description: 'Display developer tools in editor.',
		controlFirst: false,
	},
};

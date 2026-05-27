import { expect, userEvent, within } from '@storybook/test';
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
	args: {
		'aria-label': 'Standalone switch',
	},
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

		return (
			<div className="min-h-[76px] w-80">
				<Switch {...arguments_} checked={checked} onCheckedChange={setChecked} error={error} />
			</div>
		);
	},
	args: {
		label: 'Agree to privacy policy',
		description: 'Required choice to register.',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggle = canvas.getByRole('switch');

		// Error should be visible initially because checked is false
		await expect(canvas.getByText('You must agree to the privacy policy.')).toBeInTheDocument();

		// Click the switch to check it
		await userEvent.click(toggle);

		// Error should disappear
		await expect(canvas.queryByText('You must agree to the privacy policy.')).not.toBeInTheDocument();

		// Click the switch again to uncheck it
		await userEvent.click(toggle);

		// Error should reappear
		await expect(canvas.getByText('You must agree to the privacy policy.')).toBeInTheDocument();
	},
};

export const ControlLast: Story = {
	args: {
		label: 'Show Advanced Options',
		description: 'Display developer tools in editor.',
		controlFirst: false,
	},
};

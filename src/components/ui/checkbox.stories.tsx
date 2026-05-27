import * as React from 'react';

import { Checkbox } from './checkbox';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Checkbox',
	component: Checkbox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		checked: {
			control: 'select',
			options: [true, false, 'indeterminate'],
		},
		disabled: {
			control: 'boolean',
		},
		label: {
			control: 'text',
		},
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Accept Terms and Conditions',
		description: 'You must agree to the Terms of Service to proceed.',
	},
};

export const Indeterminate: Story = {
	args: {
		indeterminate: true,
		label: 'Parent Category Selection',
		description: 'Some sub-categories are checked.',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Notifications (Disabled)',
		description: 'This preference cannot be edited currently.',
		disabled: true,
		checked: true,
	},
};

export const ValidationError: Story = {
	render: () => {
		const [checked, setChecked] = React.useState(false);

		return (
			<Checkbox
				checked={checked}
				onCheckedChange={setChecked}
				label="Subscribe to newsletter"
				description="Required option."
				error={checked ? undefined : 'Please accept the newsletter subscription.'}
			/>
		);
	},
};

export const LabelOnLeft: Story = {
	args: {
		label: 'Enable Dark Mode Toggle',
		description: 'Show standard dark mode switch in header.',
		controlFirst: false,
	},
};

export const Group: StoryObj<typeof Checkbox.Group> = {
	render: () => {
		const [values, setValues] = React.useState<string[]>(['email']);

		return (
			<Checkbox.Group
				legend="Communication Preferences"
				description="Choose how you want to receive updates."
				value={values}
				onValueChange={setValues}
				className="w-80"
			>
				<Checkbox.Item value="email" label="Email Updates" />
				<Checkbox.Item value="sms" label="SMS Messages" />
				<Checkbox.Item value="push" label="Push Notifications" />
			</Checkbox.Group>
		);
	},
};

import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Checkbox } from './checkbox';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Checkbox is a stateful toggle control for boolean values, supporting group contexts.
 *
 * ### Usage
 * ```tsx
 * import { Checkbox } from '@timowilhelm/neob';
 *
 * <Checkbox checked={checked} onChange={setChecked}>
 *   Accept Terms
 * </Checkbox>
 * ```
 */
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
	args: {
		'aria-label': 'Standalone checkbox',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole('checkbox');
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();
	}),
};

export const WithLabel: Story = {
	args: {
		label: 'Accept Terms and Conditions',
		description: 'You must agree to the Terms of Service to proceed.',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole('checkbox', { name: /accept terms and conditions/i });
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();
	}),
};

export const Indeterminate: Story = {
	args: {
		indeterminate: true,
		label: 'Parent Category Selection',
		description: 'Some sub-categories are checked.',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('checkbox', { name: /parent category selection/i })).toBePartiallyChecked();
	}),
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
	args: {
		label: 'Subscribe to newsletter',
		description: 'Required option.',
		checked: false,
	},
	render: (args) => {
		const [checked, setChecked] = useState(args.checked === true);

		return (
			<div className="min-h-[72px] w-80">
				<Checkbox
					label={args.label}
					description={args.description}
					checked={checked}
					onCheckedChange={(nextChecked) => {
						setChecked(nextChecked);
						action('checkbox-validation-change')(nextChecked);
					}}
					error={checked ? undefined : 'Please accept the newsletter subscription.'}
				/>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole('checkbox');

		// Error should be visible initially because checked is false
		await expect(canvas.getByText('Please accept the newsletter subscription.')).toBeInTheDocument();

		// Click checkbox to check it
		await userEvent.click(checkbox);

		// Checked should be true, error should disappear
		await expect(canvas.queryByText('Please accept the newsletter subscription.')).not.toBeInTheDocument();

		// Click checkbox again to uncheck it
		await userEvent.click(checkbox);

		// Checked should be false, error should reappear
		await expect(canvas.getByText('Please accept the newsletter subscription.')).toBeInTheDocument();
	}),
};

export const LabelOnLeft: Story = {
	args: {
		label: 'Enable Dark Mode Toggle',
		description: 'Show standard dark mode switch in header.',
		controlFirst: false,
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole('checkbox', { name: /enable dark mode toggle/i });
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();
	}),
};

export const Group: StoryObj<{ initialValues: string[] }> = {
	args: {
		initialValues: ['email'],
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>(args.initialValues);

		return (
			<Checkbox.Group
				legend="Communication Preferences"
				description="Choose how you want to receive updates."
				value={values}
				onValueChange={(nextValues) => {
					setValues(nextValues);
					action('checkbox-group-change')(nextValues);
				}}
				className="w-80"
			>
				<Checkbox.Item value="email" label="Email Updates" />
				<Checkbox.Item value="sms" label="SMS Messages" />
				<Checkbox.Item value="push" label="Push Notifications" />
			</Checkbox.Group>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const sms = canvas.getByRole('checkbox', { name: /sms messages/i });
		await userEvent.click(sms);
		await expect(sms).toBeChecked();
	}),
};

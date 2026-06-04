import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Switch } from './switch';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Switch is a brutalist styled togglable switch control.
 *
 * ### Usage
 * ```tsx
 * import { Switch } from '@timowilhelm/neob';
 *
 * <Switch checked={checked} onChange={setChecked}>
 *   Enable Settings
 * </Switch>
 * ```
 */
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
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggle = canvas.getByRole('switch');
		await userEvent.click(toggle);
		await expect(toggle).toBeChecked();
	}),
};

export const WithLabel: Story = {
	args: {
		label: 'Enable Push Notifications',
		description: 'We will send you updates on your account activity.',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggle = canvas.getByRole('switch');
		await userEvent.click(toggle);
		await expect(toggle).toBeChecked();
	}),
};

export const AccentColor: Story = {
	args: {
		label: 'Enable Gold Accent Mode',
		description: 'Use the custom brand accent colors.',
		variant: 'accent',
		defaultChecked: true,
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggle = canvas.getByRole('switch');
		await expect(toggle).toBeChecked();
	}),
};

export const SuccessColor: Story = {
	args: {
		label: 'Online Status',
		description: 'Display active indicator in dashboard.',
		variant: 'success',
		defaultChecked: true,
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('switch')).toBeChecked();
	}),
};

export const DisabledState: Story = {
	args: {
		label: 'Automatic Backups (Locked)',
		description: 'Contact your administrator to change backups preferences.',
		disabled: true,
		defaultChecked: true,
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggle = canvas.getByRole('switch');
		await expect(toggle).toHaveAttribute('aria-disabled', 'true');
		await expect(toggle).toBeChecked();
	}),
};

export const ValidationError: Story = {
	render: (arguments_) => {
		const [checked, setChecked] = useState(false);
		const error = checked ? undefined : 'You must agree to the privacy policy.';

		return (
			<div className="min-h-[76px] w-80">
				<Switch
					{...arguments_}
					checked={checked}
					onCheckedChange={(nextChecked) => {
						setChecked(nextChecked);
						action('switch-validation-change')(nextChecked);
					}}
					error={error}
				/>
			</div>
		);
	},
	args: {
		label: 'Agree to privacy policy',
		description: 'Required choice to register.',
	},
	play: guardPlay(async ({ canvasElement }) => {
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
	}),
};

export const ControlLast: Story = {
	args: {
		label: 'Show Advanced Options',
		description: 'Display developer tools in editor.',
		controlFirst: false,
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggle = canvas.getByRole('switch');
		await userEvent.click(toggle);
		await expect(toggle).toBeChecked();
	}),
};

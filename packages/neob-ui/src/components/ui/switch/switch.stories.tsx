import { useId, useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Switch } from './switch';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Switch is a styled toggle control.
 *
 * ### Usage
 * ```tsx
 * import { Switch } from '@joyful-tools/neob';
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
		const [emailChecked, setEmailChecked] = useState(true);
		const [smsChecked, setSmsChecked] = useState(true);
		const errorId = useId();
		const isInvalid = emailChecked === smsChecked;

		return (
			<fieldset className="flex min-h-36 w-80 flex-col gap-4 border-0 p-0">
				<legend className="mb-3 text-base/tight font-bold text-black dark:text-white">Notification channel</legend>
				<Switch
					{...arguments_}
					label="Email notifications"
					checked={emailChecked}
					onCheckedChange={(checked) => {
						setEmailChecked(checked);
						action('email-notifications-change')(checked);
					}}
					aria-invalid={isInvalid ? true : undefined}
					aria-describedby={isInvalid ? errorId : undefined}
				/>
				<Switch
					{...arguments_}
					label="SMS notifications"
					checked={smsChecked}
					onCheckedChange={(checked) => {
						setSmsChecked(checked);
						action('sms-notifications-change')(checked);
					}}
					aria-invalid={isInvalid ? true : undefined}
					aria-describedby={isInvalid ? errorId : undefined}
				/>
				{isInvalid && (
					<span id={errorId} className="text-xs/normal font-bold text-red-dark dark:text-red-light">
						Select exactly one notification channel.
					</span>
				)}
			</fieldset>
		);
	},
	args: {
		variant: 'accent',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const emailToggle = canvas.getByRole('switch', { name: 'Email notifications' });
		const smsToggle = canvas.getByRole('switch', { name: 'SMS notifications' });

		await expect(emailToggle).toBeChecked();
		await expect(smsToggle).toBeChecked();
		await expect(emailToggle).toHaveAttribute('aria-invalid', 'true');
		await expect(smsToggle).toHaveAttribute('aria-invalid', 'true');
		await expect(canvas.getByText('Select exactly one notification channel.')).toBeInTheDocument();
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

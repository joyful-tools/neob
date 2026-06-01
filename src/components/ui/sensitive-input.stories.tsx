import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

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
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText('Password input');
		await userEvent.type(input, 'secret');
		await userEvent.click(canvas.getByRole('button', { name: 'Show value' }));
		await expect(input).toHaveAttribute('type', 'text');
		await expect(input).toHaveValue('secret');
	}),
};

export const WithValue: Story = {
	args: {
		'aria-label': 'Password input with value',
		defaultValue: 'my-super-secret-password',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText('Password input with value');
		await userEvent.click(canvas.getByRole('button', { name: 'Show value' }));
		await expect(input).toHaveAttribute('type', 'text');
		await expect(input).toHaveValue('my-super-secret-password');
	}),
};

export const Disabled: Story = {
	args: {
		'aria-label': 'Disabled password input',
		defaultValue: 'secure-token',
		disabled: true,
	},
};

export const WithLabel: Story = {
	args: {
		id: 'token',
		placeholder: 'Enter API token',
	},
	render: (args) => (
		<div className="flex w-64 flex-col gap-2">
			<label htmlFor="token" className="text-sm font-bold text-black dark:text-white">
				API Token
			</label>
			<SensitiveInput {...args} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText('API Token');
		await userEvent.type(input, 'token-123');
		await userEvent.click(canvas.getByRole('button', { name: 'Show value' }));
		await expect(input).toHaveAttribute('type', 'text');
		await expect(input).toHaveValue('token-123');
	}),
};

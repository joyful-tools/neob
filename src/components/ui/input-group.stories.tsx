import { Envelope, MagnifyingGlass, Eye, EyeSlash, Copy, X, Check } from '@phosphor-icons/react';
import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { InputGroup } from './input-group';
import { NumericSlider } from './numeric-slider';
import { Toaster } from './toaster';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/InputGroup',
	component: InputGroup,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'default', 'lg'],
		},
		disabled: {
			control: 'boolean',
		},
		error: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div className="w-80">
			<InputGroup {...args}>
				<InputGroup.Input placeholder="Enter username..." />
			</InputGroup>
		</div>
	),
};

export const WithLeftIcon: Story = {
	render: (args) => (
		<div className="w-80">
			<InputGroup {...args}>
				<InputGroup.Addon align="start">
					<MagnifyingGlass className="size-4" />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="Search logs..." />
			</InputGroup>
		</div>
	),
};

export const WithSuffix: Story = {
	render: (args) => (
		<div className="w-80">
			<InputGroup {...args}>
				<InputGroup.Input placeholder="my-service" />
				<InputGroup.Suffix>.workers.dev</InputGroup.Suffix>
			</InputGroup>
		</div>
	),
};

export const Clearable: Story = {
	render: (args) => {
		const [value, setValue] = React.useState('');
		return (
			<div className="w-80">
				<InputGroup {...args}>
					<InputGroup.Input
						placeholder="Type to show clear button..."
						value={value}
						onChange={(event) => {
							setValue(event.target.value);
							action('input-group-clearable-change')(event.target.value);
						}}
					/>
					{value && (
						<InputGroup.Button
							onClick={() => {
								setValue('');
								action('input-group-clearable-clear')();
							}}
							aria-label="Clear field"
						>
							<X className="size-3.5" />
						</InputGroup.Button>
					)}
				</InputGroup>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByRole('textbox'), 'hello');
		await expect(canvas.getByRole('button', { name: 'Clear field' })).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Clear field' }));
	}),
};

export const Numeric: Story = {
	render: (args) => {
		const [value, setValue] = React.useState(50);
		return (
			<div className="w-80">
				<InputGroup {...args}>
					<InputGroup.Input
						type="number"
						placeholder="Volume"
						value={value}
						onChange={(event) => {
							const nextValue = Number(event.target.value);
							setValue(nextValue);
							action('input-group-numeric-input-change')(nextValue);
						}}
					/>
					<InputGroup.Addon align="end">
						<NumericSlider
							onChange={(delta) => {
								action('input-group-numeric-slider-change')(delta);
								setValue((previous) => Math.round((previous + delta) * 100) / 100);
							}}
						/>
					</InputGroup.Addon>
				</InputGroup>
			</div>
		);
	},
};

export const ComplexComposition: Story = {
	render: (args) => {
		const [showPassword, setShowPassword] = React.useState(false);
		const password = 'super-secret-key';

		const [copied, setCopied] = React.useState(false);

		return (
			<div className="flex w-96 flex-col gap-4">
				<Toaster />
				<InputGroup {...args}>
					<InputGroup.Addon align="start">
						<Envelope className="size-4" />
					</InputGroup.Addon>
					<InputGroup.Input type="email" placeholder="username" />
					<InputGroup.Suffix>@gmail.com</InputGroup.Suffix>
				</InputGroup>

				<InputGroup {...args}>
					<InputGroup.Input type={showPassword ? 'text' : 'password'} defaultValue={password} readOnly placeholder="Password" />
					<InputGroup.Button
						onClick={() => {
							const nextShowPassword = !showPassword;
							setShowPassword(nextShowPassword);
							action('input-group-toggle-password')(nextShowPassword);
						}}
						tooltip={showPassword ? 'Hide password' : 'Show password'}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
					</InputGroup.Button>
					<InputGroup.Button
						onClick={() => {
							if (!password) return;
							void navigator.clipboard.writeText(password).then(() => {
								setCopied(true);
								setTimeout(() => setCopied(false), 2000);
							});
						}}
						tooltip="Copy value"
						aria-label="Copy value"
					>
						{copied ? <Check className="size-4" /> : <Copy className="size-4" />}
					</InputGroup.Button>
				</InputGroup>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
		await expect(canvas.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
	}),
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	render: (args) => (
		<div className="w-80">
			<InputGroup {...args}>
				<InputGroup.Addon align="start">
					<Envelope className="size-4" />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="disabled@neob.dev" />
			</InputGroup>
		</div>
	),
};

export const Error: Story = {
	args: {
		error: true,
		'aria-describedby': 'input-group-error-message',
	},
	render: (args) => (
		<div className="w-80">
			<div className="flex flex-col gap-2">
				<label htmlFor="input-group-error" className="text-sm font-bold text-black dark:text-white">
					Email Address
				</label>
				<InputGroup {...args}>
					<InputGroup.Addon align="start">
						<Envelope className="size-4" />
					</InputGroup.Addon>
					<InputGroup.Input id="input-group-error" placeholder="invalid-email" defaultValue="invalid-email" aria-label="Email address" />
				</InputGroup>
				<p id="input-group-error-message" className="text-xs font-bold text-red-dark dark:text-red-light">
					Enter a valid email address.
				</p>
			</div>
		</div>
	),
};

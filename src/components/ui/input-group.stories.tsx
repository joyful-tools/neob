import { Envelope, MagnifyingGlass, Eye, EyeSlash, Copy, X } from '@phosphor-icons/react';
import * as React from 'react';

import { InputGroup } from './input-group';
import { NumericSlider } from './numeric-slider';
import { toast } from './toast';
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
					<InputGroup.Input placeholder="Type to show clear button..." value={value} onChange={(event) => setValue(event.target.value)} />
					{value && (
						<InputGroup.Button onClick={() => setValue('')} aria-label="Clear field">
							<X className="size-3.5" />
						</InputGroup.Button>
					)}
				</InputGroup>
			</div>
		);
	},
};

export const NumericSliderStory: Story = {
	render: (args) => {
		const [value, setValue] = React.useState(50);
		return (
			<div className="w-80">
				<InputGroup {...args}>
					<InputGroup.Input type="number" placeholder="Age" value={value} onChange={(event) => setValue(Number(event.target.value))} />
					<InputGroup.Addon align="end">
						<NumericSlider onChange={(delta) => setValue((previous) => Math.round((previous + delta) * 100) / 100)} />
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

		const handleCopy = () => {
			navigator.clipboard.writeText(password);
			toast.success('Password copied to clipboard!');
		};

		return (
			<div className="flex w-96 flex-col gap-4">
				<Toaster />
				<InputGroup {...args}>
					<InputGroup.Addon align="start">
						<Envelope className="size-4" />
					</InputGroup.Addon>
					<InputGroup.Input type="email" placeholder="email@domain.com" />
					<InputGroup.Suffix>@gmail.com</InputGroup.Suffix>
				</InputGroup>

				<InputGroup {...args}>
					<InputGroup.Input type={showPassword ? 'text' : 'password'} defaultValue={password} readOnly placeholder="Password" />
					<InputGroup.Button onClick={() => setShowPassword(!showPassword)} tooltip={showPassword ? 'Hide password' : 'Show password'}>
						{showPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
					</InputGroup.Button>
					<InputGroup.Button onClick={handleCopy} tooltip="Copy value">
						<Copy className="size-4" />
					</InputGroup.Button>
				</InputGroup>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup disabled>
				<InputGroup.Addon align="start">
					<Envelope className="size-4" />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="disabled@neob.dev" />
			</InputGroup>
		</div>
	),
};

export const Error: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup error>
				<InputGroup.Addon align="start">
					<Envelope className="size-4" />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="invalid-email" defaultValue="invalid-email" />
			</InputGroup>
		</div>
	),
};

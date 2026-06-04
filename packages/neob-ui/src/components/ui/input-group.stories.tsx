import { EnvelopeIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { InputGroup } from './input-group';
import { NumericSlider } from './numeric-slider';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * InputGroup is a layout pattern combining inputs, labels, and prepended/appended text/button addons.
 *
 * ### Usage
 * ```tsx
 * import { InputGroup } from '@timowilhelm/neob';
 *
 * <InputGroup>
 *   <InputGroup.Addon>$</InputGroup.Addon>
 *   <InputGroup.Input type="number" placeholder="0.00" />
 *   <InputGroup.Button>Submit</InputGroup.Button>
 * </InputGroup>
 * ```
 */
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
					<MagnifyingGlassIcon className="size-4" />
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
		const [value, setValue] = useState('');
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
							<XIcon className="size-3.5" />
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
		const [value, setValue] = useState(50);
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
		return (
			<div className="flex w-96 flex-col gap-4">
				<InputGroup {...args}>
					<InputGroup.Addon align="start">
						<EnvelopeIcon className="size-4" />
					</InputGroup.Addon>
					<InputGroup.Input type="email" placeholder="username" />
					<InputGroup.Suffix>@gmail.com</InputGroup.Suffix>
				</InputGroup>
			</div>
		);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	render: (args) => (
		<div className="w-80">
			<InputGroup {...args}>
				<InputGroup.Addon align="start">
					<EnvelopeIcon className="size-4" />
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
						<EnvelopeIcon className="size-4" />
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

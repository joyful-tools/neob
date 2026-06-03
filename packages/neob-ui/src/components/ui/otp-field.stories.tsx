import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { OTPField } from './otp-field';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/OTPField',
	component: OTPField,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof OTPField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		length: 6,
	},
	render: (args) => {
		const [value, setValue] = useState('');
		return (
			<div className="flex flex-col items-center gap-4">
				<h3 className="font-display text-lg font-bold">Enter Verification Code</h3>
				<OTPField
					{...args}
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('otp-field-change')(nextValue);
					}}
				>
					<OTPField.Input index={0} />
					<OTPField.Input index={1} />
					<OTPField.Input index={2} />
					<div className="mx-1 text-xl font-bold">-</div>
					<OTPField.Input index={3} />
					<OTPField.Input index={4} />
					<OTPField.Input index={5} />
				</OTPField>
				<p className="text-xs text-muted-foreground">Current Value: {value || '(empty)'}</p>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const inputs = canvas.getAllByRole('textbox');
		await userEvent.type(inputs[0], '123456');
		await expect(canvas.getByText('Current Value: 123456')).toBeInTheDocument();
	}),
};

export const NumericPaste: Story = {
	args: {
		length: 4,
	},
	render: (args) => {
		const [value, setValue] = useState('');
		return (
			<div className="flex flex-col items-center gap-4">
				<h3 className="font-display text-lg font-bold">Enter Numeric Code</h3>
				<OTPField
					{...args}
					value={value}
					validationMode="numeric"
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('otp-field-numeric-change')(nextValue);
					}}
				>
					<OTPField.Input index={0} />
					<OTPField.Input index={1} />
					<OTPField.Input index={2} />
					<OTPField.Input index={3} />
				</OTPField>
				<p className="text-xs text-muted-foreground">Current Value: {value || '(empty)'}</p>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const inputs = canvas.getAllByRole('textbox');
		await userEvent.click(inputs[0]);
		await userEvent.paste('12ab34');
		await expect(canvas.getByText('Current Value: 1234')).toBeInTheDocument();
		await expect(inputs[0]).toHaveValue('1');
		await expect(inputs[1]).toHaveValue('2');
		await expect(inputs[2]).toHaveValue('3');
		await expect(inputs[3]).toHaveValue('4');
	}),
};

export const KeyboardNavigation: Story = {
	args: {
		length: 4,
	},
	render: (args) => {
		const [value, setValue] = useState('');
		return (
			<div className="flex flex-col items-center gap-4">
				<h3 className="font-display text-lg font-bold">Keyboard Navigation</h3>
				<OTPField
					{...args}
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('otp-field-keyboard-change')(nextValue);
					}}
				>
					<OTPField.Input index={0} />
					<OTPField.Input index={1} />
					<OTPField.Input index={2} />
					<OTPField.Input index={3} />
				</OTPField>
				<p className="text-xs text-muted-foreground">Current Value: {value || '(empty)'}</p>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const inputs = canvas.getAllByRole('textbox');
		await userEvent.type(inputs[0], '12');
		await userEvent.keyboard('{ArrowLeft}');
		await expect(inputs[1]).toHaveFocus();
		await userEvent.keyboard('{Delete}');
		await expect(canvas.getByText('Current Value: 1')).toBeInTheDocument();
		await userEvent.keyboard('{End}');
		await expect(inputs[1]).toHaveFocus();
		await userEvent.keyboard('{Backspace}');
		await expect(canvas.getByText('Current Value: 1')).toBeInTheDocument();
		await expect(inputs[0]).toHaveFocus();
		await userEvent.keyboard('{Home}');
		await expect(inputs[0]).toHaveFocus();
	}),
};

export const FormSubmission: Story = {
	args: {
		length: 4,
	},
	render: (args) => {
		const [value, setValue] = useState('');
		const [submittedValue, setSubmittedValue] = useState('');
		return (
			<form
				className="flex flex-col items-center gap-4"
				onSubmit={(event) => {
					event.preventDefault();
					const formData = new FormData(event.currentTarget);
					const nextSubmittedValue = formData.get('verificationCode');
					setSubmittedValue(typeof nextSubmittedValue === 'string' ? nextSubmittedValue : '');
					action('otp-field-form-submit')();
				}}
			>
				<h3 className="font-display text-lg font-bold">Form Submission</h3>
				<OTPField
					{...args}
					name="verificationCode"
					autoSubmit
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('otp-field-form-change')(nextValue);
					}}
				>
					<OTPField.Input index={0} />
					<OTPField.Input index={1} />
					<OTPField.Input index={2} />
					<OTPField.Input index={3} />
				</OTPField>
				<p className="text-xs text-muted-foreground">Current Value: {value || '(empty)'}</p>
				<p className="text-xs text-muted-foreground">Submitted Value: {submittedValue || '(empty)'}</p>
			</form>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const inputs = canvas.getAllByRole('textbox');
		await userEvent.type(inputs[0], 'AB12');
		await expect(canvas.getByText('Current Value: AB12')).toBeInTheDocument();
		await expect(canvas.getByText('Submitted Value: AB12')).toBeInTheDocument();
	}),
};

import * as React from 'react';
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

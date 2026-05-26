import * as React from 'react';
import { useState } from 'react';

import { OTPFieldRoot, OTPFieldInput } from './otp-field';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/OTPField',
	component: OTPFieldRoot,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof OTPFieldRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<div className="flex flex-col items-center gap-4">
				<h3 className="font-display text-lg font-bold">Enter Verification Code</h3>
				<OTPFieldRoot length={6} value={value} onValueChange={setValue}>
					<OTPFieldInput index={0} />
					<OTPFieldInput index={1} />
					<OTPFieldInput index={2} />
					<div className="mx-1 text-xl font-bold">-</div>
					<OTPFieldInput index={3} />
					<OTPFieldInput index={4} />
					<OTPFieldInput index={5} />
				</OTPFieldRoot>
				<p className="text-xs text-muted-foreground">Current Value: {value || '(empty)'}</p>
			</div>
		);
	},
};

import * as React from 'react';

import { Field, Fieldset } from './field';
import { Input } from './input';
import { InputArea } from './input-area';
import { RadioGroup, RadioGroupItem } from './radio-group';

import type { FieldProperties, FieldsetProperties } from './field';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Field',
	component: Field,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;
type StoryProps = Omit<FieldProperties, 'children'> & { children?: React.ReactNode };
type Story = StoryObj<StoryProps>;

export const DefaultInput: Story = {
	render: () => (
		<div className="w-80">
			<Input label="Username" description="Choose a unique public handle." placeholder="e.g. johndoe" />
		</div>
	),
};

export const RequiredField: Story = {
	render: () => (
		<div className="w-80">
			<Input label="Email Address" required={true} type="email" placeholder="you@example.com" />
		</div>
	),
};

export const OptionalField: Story = {
	render: () => (
		<div className="w-80">
			<Input label="Phone Number" required={false} type="tel" placeholder="+1 (555) 000-0000" />
		</div>
	),
};

export const ValidationError: Story = {
	render: () => (
		<div className="w-80">
			<Input
				label="Password"
				error="Password must contain at least 8 characters and one number."
				type="password"
				defaultValue="12345"
				className="border-red dark:border-red"
			/>
		</div>
	),
};

export const WithLabelTooltip: Story = {
	render: () => (
		<div className="w-80">
			<Input
				label="Personal Identification Number"
				labelTooltip="This is your unique government-issued identity identifier, used for tax purposes."
				placeholder="000-00-0000"
			/>
		</div>
	),
};

export const DisabledField: Story = {
	render: () => (
		<div className="w-80">
			<Input
				label="API Token (Disabled)"
				description="Your unique read-only API access token."
				defaultValue="neob_tok_1234567890"
				disabled
			/>
		</div>
	),
};

export const WithInputArea: Story = {
	render: () => (
		<div className="w-96">
			<InputArea
				label="Feedback Details"
				description="Please describe the issue you encountered in detail."
				placeholder="Type details here..."
				rows={4}
			/>
		</div>
	),
};

export const GroupFieldset: StoryObj<Omit<FieldsetProperties, 'children'> & { children?: React.ReactNode }> = {
	render: () => (
		<div className="w-80">
			<Fieldset
				legend="Choose Notification Delivery"
				description="Select where you want your notifications to show up."
				error="Please select at least one option."
			>
				<RadioGroup defaultValue="email">
					<div className="flex items-center gap-3">
						<RadioGroupItem value="email" id="delivery-email" />
						<label htmlFor="delivery-email" className="cursor-pointer text-sm font-bold text-black dark:text-white">
							Send to email
						</label>
					</div>
					<div className="flex items-center gap-3">
						<RadioGroupItem value="push" id="delivery-push" />
						<label htmlFor="delivery-push" className="cursor-pointer text-sm font-bold text-black dark:text-white">
							Show push notifications
						</label>
					</div>
				</RadioGroup>
			</Fieldset>
		</div>
	),
};

export const CustomComposition: Story = {
	render: () => (
		<div className="w-80">
			<Field label="Custom Selection Wrapper" description="Use Field directly to wrap custom controls.">
				<div className="rounded-lg border-2 border-dashed border-black/20 p-4 text-center text-sm font-bold text-muted-foreground dark:border-white/20">
					[Custom Component Here]
				</div>
			</Field>
		</div>
	),
};

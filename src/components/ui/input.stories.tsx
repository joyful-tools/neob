import * as React from 'react';

import { Input } from './input';
import { InputArea } from './input-area';
import { RadioGroup } from './radio-group';

import type { InputProperties, FieldsetProperties } from './input';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Input',
	component: Input,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type StoryProps = Omit<InputProperties, 'children'> & { children?: React.ReactNode };
type Story = StoryObj<StoryProps>;

export const DefaultInput: Story = {
	render: () => (
		<div className="w-80">
			<div className="flex flex-col gap-2">
				<label htmlFor="username-input" className="text-sm font-bold text-black dark:text-white">
					Username
				</label>
				<Input id="username-input" aria-describedby="username-input-description" placeholder="e.g. johndoe" />
				<p id="username-input-description" className="text-xs/normal text-muted-foreground">
					Choose a unique public handle.
				</p>
			</div>
		</div>
	),
};

export const RequiredInput: Story = {
	render: () => (
		<div className="w-80">
			<Input label="Email Address" required={true} type="email" placeholder="you@example.com" />
		</div>
	),
};

export const OptionalInput: Story = {
	render: () => (
		<div className="w-80">
			<Input label="Phone Number" required={false} type="tel" placeholder="+1 (555) 000-0000" />
		</div>
	),
};

export const ValidationError: Story = {
	render: () => (
		<div className="w-80">
			<div className="flex flex-col gap-2">
				<label htmlFor="password-validation" className="text-sm font-bold text-black dark:text-white">
					Password
				</label>
				<Input
					id="password-validation"
					aria-describedby="password-validation-error"
					aria-invalid={true}
					error="Password must contain at least 8 characters and one number."
					type="password"
					defaultValue="12345"
					className="border-red dark:border-red"
				/>
				<p id="password-validation-error" className="text-xs font-bold text-red-dark dark:text-red-light">
					Password must contain at least 8 characters and one number.
				</p>
			</div>
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

export const DisabledInput: Story = {
	render: () => (
		<div className="w-80">
			<div className="flex flex-col gap-2">
				<label htmlFor="api-token-disabled" className="text-sm font-bold text-black dark:text-white">
					API Token
				</label>
				<Input id="api-token-disabled" aria-describedby="api-token-disabled-description" defaultValue="neob_tok_1234567890" disabled />
				<p id="api-token-disabled-description" className="text-xs/normal text-muted-foreground">
					Your unique read-only API access token.
				</p>
			</div>
		</div>
	),
};

export const WithInputArea: Story = {
	render: () => (
		<div className="w-96">
			<div className="flex flex-col gap-2">
				<label htmlFor="issue-details" className="text-sm font-bold text-black dark:text-white">
					Issue Details
				</label>
				<InputArea id="issue-details" aria-describedby="issue-details-description" placeholder="Type details here..." rows={4} />
				<p id="issue-details-description" className="text-xs/normal text-muted-foreground">
					Please describe the issue you encountered in detail.
				</p>
			</div>
		</div>
	),
};

export const GroupedControls: StoryObj<Omit<FieldsetProperties, 'children'> & { children?: React.ReactNode }> = {
	render: () => (
		<div className="w-80">
			<Input.Fieldset
				legend="Choose Notification Delivery"
				description="Select where you want your notifications to show up."
				error="Please select at least one option."
			>
				<RadioGroup defaultValue="email">
					<div className="flex items-center gap-3">
						<RadioGroup.Item value="email" id="delivery-email" />
						<label htmlFor="delivery-email" className="cursor-pointer text-sm font-bold text-black dark:text-white">
							Send to email
						</label>
					</div>
					<div className="flex items-center gap-3">
						<RadioGroup.Item value="push" id="delivery-push" />
						<label htmlFor="delivery-push" className="cursor-pointer text-sm font-bold text-black dark:text-white">
							Show push notifications
						</label>
					</div>
				</RadioGroup>
			</Input.Fieldset>
		</div>
	),
};

export const CustomComposition: Story = {
	render: () => (
		<div className="w-80">
			<Input.Wrapper label="Custom Selection Wrapper" description="Use Input directly to wrap custom controls.">
				<div className="rounded-lg border-2 border-dashed border-black/20 p-4 text-center text-sm font-bold text-muted-foreground dark:border-white/20">
					[Custom Component Here]
				</div>
			</Input.Wrapper>
		</div>
	),
};

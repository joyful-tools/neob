import { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { InputArea } from '@/components/ui/input-area';
import { RadioGroup } from '@/components/ui/radio-group';
import { guardPlay } from '@/lib/storybook-interactions';

import { Input } from './input';

import type { InputProperties, FieldsetProperties } from './input';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Input provides standard brutalist form input elements and wrapper styling.
 *
 * ### Usage
 * ```tsx
 * import { Input } from '@timowilhelm/neob';
 *
 * <Input placeholder="Enter username..." />
 * ```
 */
const meta = {
	title: 'Inputs/Input',
	component: Input,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type StoryProps = Omit<InputProperties, 'children'> & { children?: ReactNode };
type Story = StoryObj<StoryProps>;

export const DefaultInput: Story = {
	args: {
		id: 'username-input',
		'aria-describedby': 'username-input-description',
		placeholder: 'e.g. johndoe',
	},
	render: (args) => (
		<div className="w-80">
			<div className="flex flex-col gap-2">
				<label htmlFor="username-input" className="text-sm font-bold text-black dark:text-white">
					Username
				</label>
				<Input {...args} />
				<p id="username-input-description" className="text-xs/normal text-muted-foreground">
					Choose a unique public handle.
				</p>
			</div>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Username' });
		await userEvent.type(input, 'johndoe');
		await expect(input).toHaveValue('johndoe');
	}),
};

export const RequiredInput: Story = {
	args: {
		label: 'Email Address',
		required: true,
		type: 'email',
		placeholder: 'you@example.com',
	},
	render: (args) => (
		<div className="w-80">
			<Input {...args} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('you@example.com');
		await userEvent.type(input, 'user@example.com');
		await expect(input).toHaveValue('user@example.com');
	}),
};

export const OptionalInput: Story = {
	args: {
		label: 'Phone Number',
		required: false,
		type: 'tel',
		placeholder: '+1 (555) 000-0000',
	},
	render: (args) => (
		<div className="w-80">
			<Input {...args} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('+1 (555) 000-0000');
		await userEvent.type(input, '123456');
		await expect(input).toHaveValue('123456');
	}),
};

export const ValidationError: Story = {
	args: {
		id: 'password-validation',
		'aria-describedby': 'password-validation-error',
		'aria-invalid': true,
		error: 'Password must contain at least 8 characters and one number.',
		type: 'password',
		defaultValue: '12345',
		className: 'border-red dark:border-red',
	},
	render: (args) => (
		<div className="w-80">
			<div className="flex flex-col gap-2">
				<label htmlFor="password-validation" className="text-sm font-bold text-black dark:text-white">
					Password
				</label>
				<Input {...args} />
				<p id="password-validation-error" className="text-xs font-bold text-red-dark dark:text-red-light">
					Password must contain at least 8 characters and one number.
				</p>
			</div>
		</div>
	),
};

export const WithLabelTooltip: Story = {
	args: {
		label: 'Personal Identification Number',
		labelTooltip: 'This is your unique government-issued identity identifier, used for tax purposes.',
		placeholder: '000-00-0000',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="w-80">
			<Input {...args} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.hover(canvas.getByRole('button', { name: 'Information' }));
		await expect(await within(document.body).findByRole('tooltip')).toHaveTextContent(
			'This is your unique government-issued identity identifier, used for tax purposes.',
		);
	}),
};

export const DisabledInput: Story = {
	args: {
		id: 'api-token-disabled',
		'aria-describedby': 'api-token-disabled-description',
		defaultValue: 'neob_tok_1234567890',
		disabled: true,
	},
	render: (args) => (
		<div className="w-80">
			<div className="flex flex-col gap-2">
				<label htmlFor="api-token-disabled" className="text-sm font-bold text-black dark:text-white">
					API Token
				</label>
				<Input {...args} />
				<p id="api-token-disabled-description" className="text-xs/normal text-muted-foreground">
					Your unique read-only API access token.
				</p>
			</div>
		</div>
	),
};

export const WithInputArea: StoryObj<{ id: string; 'aria-describedby': string; placeholder: string; rows: number }> = {
	args: {
		id: 'issue-details',
		'aria-describedby': 'issue-details-description',
		placeholder: 'Type details here...',
		rows: 4,
	},
	render: (args) => (
		<div className="w-96">
			<div className="flex flex-col gap-2">
				<label htmlFor="issue-details" className="text-sm font-bold text-black dark:text-white">
					Issue Details
				</label>
				<InputArea {...args} />
				<p id="issue-details-description" className="text-xs/normal text-muted-foreground">
					Please describe the issue you encountered in detail.
				</p>
			</div>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textarea = canvas.getByRole('textbox', { name: 'Issue Details' });
		await userEvent.type(textarea, 'Example issue details');
		await expect(textarea).toHaveValue('Example issue details');
	}),
};

export const GroupedControls: StoryObj<Omit<FieldsetProperties, 'children'> & { initialValue: string }> = {
	args: {
		legend: 'Choose Notification Delivery',
		description: 'Select where you want your notifications to show up.',
		error: 'Please select at least one option.',
		initialValue: 'email',
	},
	render: (args) => (
		<div className="w-80">
			<Input.Fieldset legend={args.legend} description={args.description} error={args.error}>
				<RadioGroup defaultValue={args.initialValue}>
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
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const push = canvas.getByRole('radio', { name: 'Show push notifications' });
		await userEvent.click(push);
		await expect(push).toBeChecked();
	}),
};

export const CustomComposition: Story = {
	args: {
		label: 'Custom Selection Wrapper',
		description: 'Use Input directly to wrap custom controls.',
	},
	render: (args) => (
		<div className="w-80">
			<Input.Wrapper label={args.label} description={args.description}>
				<div className="rounded-lg border-2 border-dashed border-black/20 p-4 text-center text-sm font-bold text-muted-foreground dark:border-white/20">
					[Custom Component Here]
				</div>
			</Input.Wrapper>
		</div>
	),
};

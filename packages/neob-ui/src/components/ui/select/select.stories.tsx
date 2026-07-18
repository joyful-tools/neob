import { ComponentProps, ReactNode, useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Select } from './select';

import type { Meta, StoryObj } from '@storybook/react-vite';

type SelectStoryProperties = {
	initialValue?: string;
	placeholder?: string;
	'aria-label'?: string;
	label?: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
	items?: ComponentProps<typeof Select>['items'];
};

/**
 * Select is a customizable trigger and list overlay select component.
 *
 * ### Usage
 * ```tsx
 * import { Select } from '@joyful-tools/neob';
 *
 * <Select value={value} onValueChange={setValue}>
 *   <Select.Option value="first">First Option</Select.Option>
 *   <Select.Option value="second">Second Option</Select.Option>
 * </Select>
 * ```
 */
const meta = {
	title: 'Inputs/Select',
	component: Select,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<SelectStoryProperties>;

export const Default: Story = {
	args: {
		initialValue: 'apple',
		placeholder: 'Select a fruit',
		'aria-label': 'Fruit selection',
	},
	render: (args) => {
		const [val, setVal] = useState(args.initialValue ?? '');
		return (
			<div className="w-64">
				<Select
					placeholder={args.placeholder}
					aria-label={args['aria-label']}
					value={val}
					onValueChange={(value) => {
						setVal(typeof value === 'string' ? value : '');
						action('select-default-change')(value);
					}}
				>
					<Select.Option value="apple">Apple</Select.Option>
					<Select.Option value="banana">Banana</Select.Option>
					<Select.Option value="blueberry">Blueberry</Select.Option>
					<Select.Option value="strawberry">Strawberry</Select.Option>
				</Select>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox', { name: /fruit selection/i });
		await userEvent.click(select);
		const body = within(document.body);
		await userEvent.click(await body.findByRole('option', { name: 'Banana' }));
		await expect(select).toHaveTextContent(/banana/i);
	}),
};

export const Disabled: Story = {
	args: {
		initialValue: 'banana',
		disabled: true,
		placeholder: 'Select a fruit',
		'aria-label': 'Disabled fruit selection',
	},
	render: (args) => {
		return (
			<div className="w-64">
				<Select defaultValue={args.initialValue} disabled={args.disabled} placeholder={args.placeholder} aria-label={args['aria-label']}>
					<Select.Option value="apple">Apple</Select.Option>
					<Select.Option value="banana">Banana</Select.Option>
				</Select>
			</div>
		);
	},
};

export const ItemsProp: Story = {
	args: {
		initialValue: 'apple',
		placeholder: 'Select a fruit',
		'aria-label': 'Fruit selection items',
		items: {
			apple: 'Apple',
			banana: 'Banana',
			blueberry: { label: 'Blueberry', disabled: true },
			strawberry: 'Strawberry',
		},
	},
	render: (args) => {
		const [val, setVal] = useState(args.initialValue ?? '');
		return (
			<div className="w-64">
				<Select
					placeholder={args.placeholder}
					aria-label={args['aria-label']}
					items={args.items}
					value={val}
					onValueChange={(value) => {
						setVal(typeof value === 'string' ? value : '');
						action('select-items-prop-change')(value);
					}}
				/>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox', { name: /fruit selection items/i });
		await userEvent.click(select);
		const body = within(document.body);
		await userEvent.click(await body.findByRole('option', { name: 'Strawberry' }));
		await expect(select).toHaveTextContent(/strawberry/i);
	}),
};

export const Labeled: Story = {
	args: {
		initialValue: 'apple',
		label: 'Fruit Selection',
		description: 'Choose your favorite fruit from the list.',
		placeholder: 'Select a fruit',
	},
	render: (args) => {
		const [val, setVal] = useState(args.initialValue ?? '');
		return (
			<div className="w-64">
				<Select
					label={args.label}
					description={args.description}
					placeholder={args.placeholder}
					value={val}
					onValueChange={(value) => {
						setVal(typeof value === 'string' ? value : '');
						action('select-labeled-change')(value);
					}}
				>
					<Select.Option value="apple">Apple</Select.Option>
					<Select.Option value="banana">Banana</Select.Option>
					<Select.Option value="blueberry">Blueberry</Select.Option>
					<Select.Option value="strawberry">Strawberry</Select.Option>
				</Select>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox', { name: /fruit selection/i });
		await userEvent.click(select);
		const body = within(document.body);
		await userEvent.click(await body.findByRole('option', { name: 'Strawberry' }));
		await expect(select).toHaveTextContent(/strawberry/i);
	}),
};

export const Groups: Story = {
	args: {
		initialValue: 'light',
		placeholder: 'Select a theme',
		'aria-label': 'Theme selection',
	},
	render: (args) => {
		return (
			<div className="w-64">
				<Select defaultValue={args.initialValue} placeholder={args.placeholder} aria-label={args['aria-label']}>
					<Select.Group>
						<Select.GroupLabel>System Theme</Select.GroupLabel>
						<Select.Option value="system">Follow System</Select.Option>
					</Select.Group>
					<Select.Separator />
					<Select.Group>
						<Select.GroupLabel>Custom Themes</Select.GroupLabel>
						<Select.Option value="light">Light Theme</Select.Option>
						<Select.Option value="dark">Dark Theme</Select.Option>
						<Select.Option value="brutal">Brutal Gold Theme</Select.Option>
					</Select.Group>
				</Select>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox', { name: /theme selection/i });
		await userEvent.click(select);
		const body = within(document.body);
		await userEvent.click(await body.findByRole('option', { name: 'Dark Theme' }));
		await expect(select).toHaveTextContent(/dark/i);
	}),
};

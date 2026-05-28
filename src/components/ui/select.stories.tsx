import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Select } from './select';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Select',
	component: Select,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [val, setVal] = React.useState('apple');
		return (
			<div className="w-64">
				<Select
					value={val}
					onValueChange={(value) => {
						setVal(value ?? '');
						action('select-default-change')(value);
					}}
					placeholder="Select a fruit"
					aria-label="Fruit selection"
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
	render: () => {
		return (
			<div className="w-64">
				<Select defaultValue="banana" disabled placeholder="Select a fruit" aria-label="Disabled fruit selection">
					<Select.Option value="apple">Apple</Select.Option>
					<Select.Option value="banana">Banana</Select.Option>
				</Select>
			</div>
		);
	},
};

export const ItemsProp: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [val, setVal] = React.useState('apple');
		return (
			<div className="w-64">
				<Select
					value={val}
					onValueChange={(value) => {
						setVal(value ?? '');
						action('select-items-prop-change')(value);
					}}
					placeholder="Select a fruit"
					aria-label="Fruit selection items"
					items={{
						apple: 'Apple',
						banana: 'Banana',
						blueberry: { label: 'Blueberry', disabled: true },
						strawberry: 'Strawberry',
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
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [val, setVal] = React.useState('apple');
		return (
			<div className="w-64">
				<Select
					value={val}
					onValueChange={(value) => {
						setVal(value ?? '');
						action('select-labeled-change')(value);
					}}
					label="Fruit Selection"
					description="Choose your favorite fruit from the list."
					placeholder="Select a fruit"
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
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		return (
			<div className="w-64">
				<Select defaultValue="light" placeholder="Select a theme" aria-label="Theme selection">
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

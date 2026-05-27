import * as React from 'react';

import { Select } from './select';

import type { Meta } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Select',
	component: Select,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;

export const Default = {
	render: () => {
		const [val, setVal] = React.useState('apple');
		return (
			<div className="w-64">
				<Select value={val} onValueChange={(value) => setVal(value ?? '')} placeholder="Select a fruit" aria-label="Fruit selection">
					<Select.Option value="apple">Apple</Select.Option>
					<Select.Option value="banana">Banana</Select.Option>
					<Select.Option value="blueberry">Blueberry</Select.Option>
					<Select.Option value="strawberry">Strawberry</Select.Option>
				</Select>
			</div>
		);
	},
};

export const Disabled = {
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

export const ItemsProp = {
	render: () => {
		const [val, setVal] = React.useState('apple');
		return (
			<div className="w-64">
				<Select
					value={val}
					onValueChange={(value) => setVal(value ?? '')}
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
};

export const Labeled = {
	render: () => {
		const [val, setVal] = React.useState('apple');
		return (
			<div className="w-64">
				<Select
					value={val}
					onValueChange={(value) => setVal(value ?? '')}
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
};

export const Groups = {
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
};

import * as React from 'react';

import { Select, SelectContent, SelectGroup, SelectGroupLabel, SelectItem, SelectTrigger, SelectValue } from './select';

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
				<Select value={val} onValueChange={setVal}>
					<SelectTrigger>
						<SelectValue placeholder="Select a fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="blueberry">Blueberry</SelectItem>
						<SelectItem value="strawberry">Strawberry</SelectItem>
					</SelectContent>
				</Select>
			</div>
		);
	},
};

export const Disabled = {
	render: () => {
		return (
			<div className="w-64">
				<Select defaultValue="banana" disabled>
					<SelectTrigger>
						<SelectValue placeholder="Select a fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
					</SelectContent>
				</Select>
			</div>
		);
	},
};

export const Groups = {
	render: () => {
		return (
			<div className="w-64">
				<Select defaultValue="light">
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectGroupLabel>System Theme</SelectGroupLabel>
							<SelectItem value="system">Follow System</SelectItem>
						</SelectGroup>
						<hr className="my-1 border-black/10 dark:border-white/10" />
						<SelectGroup>
							<SelectGroupLabel>Custom Themes</SelectGroupLabel>
							<SelectItem value="light">Light Theme</SelectItem>
							<SelectItem value="dark">Dark Theme</SelectItem>
							<SelectItem value="brutal">Brutal Gold Theme</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		);
	},
};

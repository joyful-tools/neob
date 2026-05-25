import { X } from 'lucide-react';
import * as React from 'react';

import { Input } from './input';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Components/Input',
	component: Input,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'number', 'tel', 'url'],
		},
		disabled: {
			control: 'boolean',
		},
		placeholder: {
			control: 'text',
		},
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: 'Enter text...',
	},
};

export const WithValue: Story = {
	args: {
		defaultValue: 'Hello World',
	},
};

export const WithPlaceholder: Story = {
	args: {
		placeholder: 'Enter your nickname',
	},
};

export const Disabled: Story = {
	args: {
		defaultValue: 'Cannot edit this',
		disabled: true,
	},
};

export const Email: Story = {
	args: {
		type: 'email',
		placeholder: 'Enter your email',
	},
};

export const Password: Story = {
	args: {
		type: 'password',
		placeholder: 'Enter your password',
	},
};

export const Number: Story = {
	args: {
		type: 'number',
		placeholder: 'Enter a number',
	},
};

export const WithLabel: Story = {
	render: () => (
		<div className="flex w-64 flex-col gap-2">
			<label htmlFor="quiz-name" className="text-sm font-bold text-black dark:text-white">
				Quiz Name
			</label>
			<Input id="quiz-name" placeholder="Enter quiz name" />
		</div>
	),
};

export const FullWidth: Story = {
	render: () => (
		<div className="w-96">
			<Input placeholder="Full width input" className="w-full" />
		</div>
	),
};

export const Clearable: Story = {
	render: () => {
		const [value, setValue] = React.useState('');
		return (
			<div className="relative w-80">
				<Input
					type="text"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					placeholder="Type something to show clear button..."
					className="pr-10"
				/>
				{value && (
					<button
						type="button"
						onClick={() => setValue('')}
						className="
							absolute top-1/2 right-3 flex size-5 -translate-y-1/2 cursor-pointer
							items-center justify-center rounded-sm text-black/60
							transition-colors hover:bg-zinc/10 hover:text-black
							dark:text-white/60 dark:hover:bg-zinc/80 dark:hover:text-white
						"
						aria-label="Clear field"
					>
						<X className="size-3.5" />
					</button>
				)}
			</div>
		);
	},
};

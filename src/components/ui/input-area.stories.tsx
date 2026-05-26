import * as React from 'react';

import { InputArea } from './input-area';

import type { InputAreaProperties } from './input-area';
import type { Meta, StoryObj } from '@storybook/react-vite';

type StoryProps = InputAreaProperties & {
	autoResizeEnabled?: boolean;
	maxRows?: number;
	animate?: boolean;
};

const meta: Meta<StoryProps> = {
	title: 'Inputs/InputArea',
	component: InputArea,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: {
			control: 'boolean',
		},
		placeholder: {
			control: 'text',
		},
	},
};

export default meta;
type Story = StoryObj<StoryProps>;

export const Default: Story = {
	args: {
		placeholder: 'Write your thoughts here...',
	},
};

export const AutoResize: Story = {
	args: {
		placeholder: 'Say something...',
		rows: 1,
	},
	argTypes: {
		autoResizeEnabled: {
			name: 'autoResize',
			control: 'boolean',
			description: 'Enable auto-resizing',
			table: {
				category: 'AutoResize Options',
			},
		},
		maxRows: {
			control: 'number',
			description: 'Maximum visible rows when auto-resizing is active',
			table: {
				category: 'AutoResize Options',
			},
		},
		animate: {
			control: 'boolean',
			description: 'Animate resizing adjustments',
			table: {
				category: 'AutoResize Options',
			},
		},
	},
	render: (args: StoryProps) => {
		// Extract custom control args so they don't pollute DOM properties on the textarea
		const { autoResizeEnabled = true, maxRows = 5, animate = true, ...textareaProps } = args;

		const autoResize = autoResizeEnabled ? { maxRows, animate } : false;

		return (
			<div className="w-96">
				<InputArea {...textareaProps} label="Biography" description="Tell us a bit about yourself." autoResize={autoResize} />
			</div>
		);
	},
};

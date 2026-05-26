import * as React from 'react';

import { DropdownMenuItem } from './dropdown-menu';
import { SplitButton } from './split-button';
import { toast } from './toast';
import { Toaster } from './toaster';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/SplitButton',
	component: SplitButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		menuContent: <div />,
	},
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlePrimaryClick = () => {
	toast.success('Primary Action Triggered!');
};

const handleSecondaryClick = (action: string) => {
	toast.info(`Secondary Action: ${action}`);
};

const PublishButton = (props: Partial<React.ComponentProps<typeof SplitButton>>) => {
	const menuContent = (
		<>
			<DropdownMenuItem onSelect={() => handleSecondaryClick('Draft')}>Save as Draft</DropdownMenuItem>
			<DropdownMenuItem onSelect={() => handleSecondaryClick('Schedule')}>Schedule Publish</DropdownMenuItem>
			<DropdownMenuItem onSelect={() => handleSecondaryClick('Archive')}>Archive Post</DropdownMenuItem>
		</>
	);

	return (
		<div className="p-8">
			<Toaster />
			<SplitButton onClick={handlePrimaryClick} menuContent={menuContent} {...props}>
				Publish Post
			</SplitButton>
		</div>
	);
};

export const Default: Story = {
	render: () => <PublishButton />,
};

export const Accent: Story = {
	render: () => <PublishButton variant="accent" />,
};

export const Danger: Story = {
	render: () => <PublishButton variant="danger" />,
};

export const Subtle: Story = {
	render: () => <PublishButton variant="subtle" />,
};

export const Small: Story = {
	render: () => <PublishButton size="sm" variant="accent" />,
};

export const Large: Story = {
	render: () => <PublishButton size="lg" />,
};

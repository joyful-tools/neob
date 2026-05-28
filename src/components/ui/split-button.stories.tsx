import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { DropdownMenu } from './dropdown-menu';
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

const PublishButton = (props: Partial<React.ComponentProps<typeof SplitButton>>) => {
	const menuContent = (
		<>
			<DropdownMenu.Item
				onSelect={() => {
					action('split-button-save-draft')();
					toast.info('Secondary Action: Draft');
				}}
			>
				Save as Draft
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					action('split-button-schedule-publish')();
					toast.info('Secondary Action: Schedule');
				}}
			>
				Schedule Publish
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					action('split-button-archive-post')();
					toast.info('Secondary Action: Archive');
				}}
			>
				Archive Post
			</DropdownMenu.Item>
		</>
	);

	return (
		<div className="p-8">
			<Toaster />
			<SplitButton
				onClick={() => {
					action('split-button-primary-click')();
					toast.success('Primary Action Triggered!');
				}}
				menuContent={menuContent}
				{...props}
			>
				Publish Post
			</SplitButton>
		</div>
	);
};

export const Default: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => <PublishButton />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = body.getByText('Save as Draft');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Accent: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => <PublishButton variant="accent" />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = body.getByText('Schedule Publish');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Danger: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => <PublishButton variant="danger" />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = body.getByText('Archive Post');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Subtle: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => <PublishButton variant="subtle" />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = body.getByText('Save as Draft');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Small: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => <PublishButton size="sm" variant="accent" />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = body.getByText('Save as Draft');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Large: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => <PublishButton size="lg" />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = body.getByText('Schedule Publish');
		await expect(menuItem).toBeInTheDocument();
	}),
};

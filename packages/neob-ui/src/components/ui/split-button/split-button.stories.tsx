import { ComponentProps } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { guardPlay } from '@/lib/storybook-interactions';

import { SplitButton } from './split-button';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * SplitButton is a compound button splitting primary actions and menu dropdown selections.
 *
 * ### Usage
 * ```tsx
 * import { SplitButton, DropdownMenu } from '@joyful-tools/neob';
 *
 * <SplitButton label="Save" onClick={handleSave}>
 *   <DropdownMenu.Item onClick={handleSaveAs}>Save As</DropdownMenu.Item>
 * </SplitButton>
 * ```
 */
const meta = {
	title: 'Inputs/SplitButton',
	component: SplitButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		children: 'Publish Post',
		disabled: false,
		menuContent: <div />,
	},
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const PublishButton = ({ children, menuContent: _menuContent, ...props }: ComponentProps<typeof SplitButton>) => {
	const menuContent = (
		<>
			<DropdownMenu.Item
				onSelect={() => {
					action('split-button-save-draft')();
				}}
			>
				Save as Draft
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					action('split-button-schedule-publish')();
				}}
			>
				Schedule Publish
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					action('split-button-archive-post')();
				}}
			>
				Archive Post
			</DropdownMenu.Item>
		</>
	);

	return (
		<div className="p-8">
			<SplitButton
				onClick={() => {
					action('split-button-primary-click')();
				}}
				menuContent={menuContent}
				{...props}
			>
				{children}
			</SplitButton>
		</div>
	);
};

export const Default: Story = {
	render: (args) => <PublishButton {...args} />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = await body.findByText('Save as Draft');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Accent: Story = {
	args: {
		variant: 'accent',
	},
	render: (args) => <PublishButton {...args} />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = await body.findByText('Schedule Publish');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Danger: Story = {
	args: {
		variant: 'danger',
	},
	render: (args) => <PublishButton {...args} />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = await body.findByText('Archive Post');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Subtle: Story = {
	args: {
		variant: 'subtle',
	},
	render: (args) => <PublishButton {...args} />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = await body.findByText('Save as Draft');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Small: Story = {
	args: {
		size: 'sm',
		variant: 'accent',
	},
	render: (args) => <PublishButton {...args} />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = await body.findByText('Save as Draft');
		await expect(menuItem).toBeInTheDocument();
	}),
};

export const Large: Story = {
	args: {
		size: 'lg',
	},
	render: (args) => <PublishButton {...args} />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = await body.findByText('Schedule Publish');
		await expect(menuItem).toBeInTheDocument();
	}),
};

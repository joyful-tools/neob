import { ComponentProps } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { DropdownMenu } from './dropdown-menu';
import { SplitButton } from './split-button';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * SplitButton is a compound button splitting primary actions and menu dropdown selections.
 *
 * ### General Usage
 * ```tsx
 * import { SplitButton, DropdownMenu } from 'neob';
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
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => <PublishButton {...args} />,
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
	args: {
		variant: 'accent',
	},
	render: (args) => <PublishButton {...args} />,
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
	args: {
		variant: 'danger',
	},
	render: (args) => <PublishButton {...args} />,
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
	args: {
		variant: 'subtle',
	},
	render: (args) => <PublishButton {...args} />,
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
	args: {
		size: 'sm',
		variant: 'accent',
	},
	render: (args) => <PublishButton {...args} />,
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
	args: {
		size: 'lg',
	},
	render: (args) => <PublishButton {...args} />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'more options' }));
		const menuItem = body.getByText('Schedule Publish');
		await expect(menuItem).toBeInTheDocument();
	}),
};

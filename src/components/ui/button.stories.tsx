import { Envelope, ArrowRight, Plus } from '@phosphor-icons/react';
import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { Spinner } from './spinner';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'accent', 'danger', 'subtle', 'ghost', 'link', 'dark-default', 'dark-accent', 'dark-subtle', 'dark-ghost'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'xl', 'icon'],
		},
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Button',
		variant: 'default',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button' }));
		await expect(canvas.getByRole('button', { name: 'Button' })).toBeInTheDocument();
	}),
};

export const Accent: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('accent-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Accent Button',
		variant: 'accent',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Accent Button' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const Danger: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('danger-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Delete',
		variant: 'danger',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Delete' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const Subtle: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('subtle-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Subtle Button',
		variant: 'subtle',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Subtle Button' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const Ghost: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('ghost-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Ghost Button',
		variant: 'ghost',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Ghost Button' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const Link: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('link-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Link Button',
		variant: 'link',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Link Button' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const Small: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('small-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Small',
		size: 'sm',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Small' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const Large: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('large-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Large Button',
		size: 'lg',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Large Button' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const ExtraLarge: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('extra-large-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: 'Start Game',
		size: 'xl',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Start Game' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const Icon: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('icon-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: '✕',
		size: 'icon',
		variant: 'subtle',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const Disabled: Story = {
	args: {
		children: (
			<>
				<Spinner size="sm" />
				Disabled
			</>
		),
		disabled: true,
	},
};

export const WithPrefixIcon: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('prefix-icon-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: (
			<>
				<Envelope className="size-4" />
				Email Login
			</>
		),
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Email Login' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const WithSuffixIcon: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('suffix-icon-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: (
			<>
				Next Step
				<ArrowRight className="size-4" />
			</>
		),
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Next Step' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const WithBothIcons: Story = {
	render: (args) => (
		<Button {...args} onClick={() => action('both-icons-button-click')()}>
			{args.children}
		</Button>
	),
	args: {
		children: (
			<>
				<Plus className="size-4" />
				Add Item
				<ArrowRight className="size-4" />
			</>
		),
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Add Item' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
	}),
};

export const AllVariants: Story = {
	render: () => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap gap-2">
					<Button variant="default" onClick={() => action('all-variants-default-click')()}>
						Default
					</Button>
					<Button variant="accent" onClick={() => action('all-variants-accent-click')()}>
						Accent
					</Button>
					<Button variant="danger" onClick={() => action('all-variants-danger-click')()}>
						Danger
					</Button>
					<Button variant="subtle" onClick={() => action('all-variants-subtle-click')()}>
						Subtle
					</Button>
					<Button variant="ghost" onClick={() => action('all-variants-ghost-click')()}>
						Ghost
					</Button>
					<Button variant="link" onClick={() => action('all-variants-link-click')()}>
						Link
					</Button>
				</div>
				<div className="flex flex-wrap gap-2 rounded-lg bg-black p-4">
					<Button variant="dark-default" onClick={() => action('all-variants-dark-default-click')()}>
						Dark Default
					</Button>
					<Button variant="dark-accent" onClick={() => action('all-variants-dark-accent-click')()}>
						Dark Accent
					</Button>
					<Button variant="dark-subtle" onClick={() => action('all-variants-dark-subtle-click')()}>
						Dark Subtle
					</Button>
					<Button variant="dark-ghost" onClick={() => action('all-variants-dark-ghost-click')()}>
						Dark Ghost
					</Button>
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Default' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Accent' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Danger' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Subtle' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Ghost' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Link' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Dark Default' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Dark Accent' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Dark Subtle' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Dark Ghost' }));
		await expect(canvas.getByRole('button', { name: 'Dark Ghost' })).toBeInTheDocument();
	}),
};

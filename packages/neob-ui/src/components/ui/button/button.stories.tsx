import { EnvelopeIcon, ArrowRightIcon, PlusIcon } from '@phosphor-icons/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { Spinner } from '@/components/ui/spinner';
import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';

import type { ButtonProperties } from './button';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Button supports multiple variants, sizes, and states.
 *
 * ### Usage
 * ```tsx
 * import { Button } from '@joyful-tools/neob';
 *
 * <Button color="gold" size="lg" isLoading={false} onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 */
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
			options: ['default', 'danger', 'subtle', 'ghost', 'link', 'dark-default', 'dark-subtle', 'dark-ghost'],
		},
		color: {
			control: 'select',
			options: ['cyan', 'gold', 'zinc', 'coral', 'blue', 'purple', 'pink', 'yellow', 'red', 'green'],
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

const colors = ['cyan', 'gold', 'zinc', 'coral', 'blue', 'purple', 'pink', 'yellow', 'red', 'green'] satisfies NonNullable<
	ButtonProperties['color']
>[];

const getButtonDepth = (button: HTMLElement) => getComputedStyle(button).getPropertyValue('--button-depth').trim();
const getButtonShadowColor = (button: HTMLElement) => getComputedStyle(button).getPropertyValue('--button-shadow-color').trim();
const getCelDepth = (button: HTMLElement, size: 'sm' | 'md' | 'lg') =>
	getComputedStyle(button).getPropertyValue(`--shadow-cel-depth-${size}`).trim();

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
		const button = canvas.getByRole('button', { name: 'Button' });
		await userEvent.click(button);
		await expect(button).toBeInTheDocument();
		await expect(getButtonDepth(button)).toBe(getCelDepth(button, 'sm'));
		await expect(getButtonShadowColor(button)).not.toBe('rgba(0, 0, 0, 0)');
	}),
};

export const Colors: Story = {
	render: () => (
		<div className="flex max-w-2xl flex-wrap gap-3">
			{colors.map((color) => (
				<Button key={color} color={color} onClick={() => action(`${color}-button-click`)()}>
					{color}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'gold' });
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
		await expect(getButtonDepth(button)).toBe(getCelDepth(button, 'sm'));
		await expect(getButtonShadowColor(button)).toBe('rgba(0, 0, 0, 0)');
		await expect(getComputedStyle(button).getPropertyValue('--button-shadow-depth-limit').trim()).toBe(getCelDepth(button, 'sm'));
	}),
};

export const SubtleColor: Story = {
	render: () => (
		<div className="flex max-w-2xl flex-wrap gap-3">
			{colors.map((color) => (
				<Button key={color} variant="subtle" color={color} onClick={() => action(`subtle-${color}-button-click`)()}>
					{color}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'gold' });
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
		await expect(getComputedStyle(button).getPropertyValue('--button-hover-depth').trim()).toBe(getCelDepth(button, 'sm'));
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
		children: 'Extra Large',
		size: 'xl',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Extra Large' });
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
	play: guardPlay(async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Disabled' });
		await expect(getButtonDepth(button)).toBe(getCelDepth(button, 'sm'));
		await expect(getButtonShadowColor(button)).toBe('rgba(0, 0, 0, 0)');
	}),
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
				<EnvelopeIcon className="size-4" />
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
				<ArrowRightIcon className="size-4" />
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
				<PlusIcon className="size-4" />
				Add Item
				<ArrowRightIcon className="size-4" />
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

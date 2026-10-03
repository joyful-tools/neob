import { EnvelopeIcon, ArrowRightIcon, PlusIcon } from '@phosphor-icons/react';
import { MotionGlobalConfig } from 'motion/react';
import { Component, ReactNode, useRef, useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

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
 * <Button color="gold" size="lg" action={handleClick}>
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
	beforeEach: () => {
		const skipAnimations = MotionGlobalConfig.skipAnimations;
		MotionGlobalConfig.skipAnimations = false;
		return () => {
			MotionGlobalConfig.skipAnimations = skipAnimations;
		};
	},
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
const getButtonContentOpacity = (button: HTMLElement) => {
	const content = button.firstElementChild;
	if (!(content instanceof HTMLElement)) throw new Error('Button content is missing');
	return Number(getComputedStyle(content).opacity);
};
const getButtonSpinnerOpacity = (button: HTMLElement) => {
	const spinner = button.querySelector('[data-slot="button-spinner"]');
	return spinner instanceof HTMLElement ? Number(getComputedStyle(spinner).opacity) : 0;
};

async function expectDelayedSpinner(button: HTMLElement) {
	const initialWidth = button.getBoundingClientRect().width;
	await userEvent.click(button);
	await expect(button).toBeDisabled();
	await expect(button).toHaveAttribute('aria-busy', 'true');
	await expect(button).toHaveAttribute('data-pending');
	await expect(getButtonSpinnerOpacity(button)).toBe(0);
	await expect(getButtonContentOpacity(button)).toBe(1);
	await waitFor(() => expect(getButtonSpinnerOpacity(button)).toBe(1));
	await expect(button).toBeDisabled();
	await expect(button).toHaveAttribute('aria-busy', 'true');
	await waitFor(() => expect(getButtonContentOpacity(button)).toBe(0));
	await expect(button.getBoundingClientRect().width).toBe(initialWidth);
	await waitFor(() => expect(button).toBeEnabled());
	await expect(button).not.toHaveAttribute('aria-busy');
	await expect(button).not.toHaveAttribute('data-pending');
	await waitFor(() => expect(getButtonContentOpacity(button)).toBe(1));
	await waitFor(() => expect(button.querySelector('[data-slot="button-spinner"]')).not.toBeInTheDocument());
}

async function expectNoSpinnerDuringQuickAction(button: HTMLElement) {
	let spinnerVisible = false;
	let contentHidden = false;
	let animationFrame = 0;
	const observeLoadingVisuals = () => {
		spinnerVisible ||= getButtonSpinnerOpacity(button) > 0;
		contentHidden ||= getButtonContentOpacity(button) < 1;
		animationFrame = requestAnimationFrame(observeLoadingVisuals);
	};
	animationFrame = requestAnimationFrame(observeLoadingVisuals);

	try {
		await userEvent.click(button);
		await expect(button).toBeDisabled();
		await expect(button).toHaveAttribute('aria-busy', 'true');
		await expect(button).toHaveAttribute('data-pending');
		await expect(getButtonContentOpacity(button)).toBe(1);
		await waitFor(() => expect(button).toBeEnabled());
		await new Promise<void>((resolve) => setTimeout(resolve, 250));
		await expect(spinnerVisible).toBe(false);
		await expect(contentHidden).toBe(false);
		await expect(button.querySelector('[data-slot="button-spinner"]')).not.toBeInTheDocument();
		await expect(getButtonContentOpacity(button)).toBe(1);
	} finally {
		cancelAnimationFrame(animationFrame);
	}
}

export const Default: Story = {
	render: (args) => (
		<Button {...args} action={() => action('button-click')()}>
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
				<Button key={color} color={color} action={() => action(`${color}-button-click`)()}>
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
		<Button {...args} action={() => action('danger-button-click')()}>
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
		<Button {...args} action={() => action('subtle-button-click')()}>
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
				<Button key={color} variant="subtle" color={color} action={() => action(`subtle-${color}-button-click`)()}>
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
		<Button {...args} action={() => action('ghost-button-click')()}>
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
		<Button {...args} action={() => action('link-button-click')()}>
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
		<Button {...args} action={() => action('small-button-click')()}>
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
		<Button {...args} action={() => action('large-button-click')()}>
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
		<Button {...args} action={() => action('extra-large-button-click')()}>
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
		<Button {...args} action={() => action('icon-button-click')()}>
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

export const AsyncAction: Story = {
	render: () => (
		<Button
			action={() => {
				return new Promise<void>((resolve) => setTimeout(resolve, 600));
			}}
		>
			Save changes
		</Button>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Save changes' });
		await expectDelayedSpinner(button);
	}),
};

export const QuickActionDoesNotFlicker: Story = {
	render: () => <Button action={() => new Promise<void>((resolve) => setTimeout(resolve, 50))}>Quick save</Button>,
	play: guardPlay(async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Quick save' });
		await expectNoSpinnerDuringQuickAction(button);
		await expectNoSpinnerDuringQuickAction(button);
	}),
};

export const QuickActionWithMotionDoesNotFlicker: Story = {
	...QuickActionDoesNotFlicker,
	beforeEach: () => {
		const matchMedia = globalThis.window.matchMedia;
		globalThis.window.matchMedia = (query: string) => {
			if (query !== '(prefers-reduced-motion: reduce)') return matchMedia.call(globalThis.window, query);
			return {
				matches: false,
				media: query,
				onchange: null,
				addEventListener: () => {},
				removeEventListener: () => {},
				addListener: () => {},
				removeListener: () => {},
				dispatchEvent: () => false,
			};
		};
		return () => {
			globalThis.window.matchMedia = matchMedia;
		};
	},
};

export const RepeatedActionsResetSpinnerDelay: Story = {
	render: () => {
		const actionCount = useRef(0);
		return (
			<Button
				action={() => {
					actionCount.current += 1;
					return new Promise<void>((resolve) => setTimeout(resolve, actionCount.current === 1 ? 600 : 50));
				}}
			>
				Run action
			</Button>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Run action' });
		await expectDelayedSpinner(button);
		await expectNoSpinnerDuringQuickAction(button);
	}),
};

export const SynchronousActionDoesNotFlicker: Story = {
	render: () => {
		const [count, setCount] = useState(0);
		return <Button action={() => setCount((currentCount) => currentCount + 1)}>Count {count}</Button>;
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Count 0' });

		await userEvent.click(button);

		await waitFor(() => expect(button).toBeEnabled());
		await expect(canvas.getByRole('button', { name: 'Count 1' })).not.toHaveAttribute('aria-busy');
		await expect(button).not.toHaveAttribute('data-pending');
		await waitFor(() => expect(button.querySelector('[data-slot="button-spinner"]')).not.toBeInTheDocument());
	}),
};

export const FormActionPending: Story = {
	render: () => (
		<form action={() => new Promise<void>((resolve) => setTimeout(resolve, 600))}>
			<Button type="submit">Submit form</Button>
		</form>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Submit form' });
		await expectDelayedSpinner(button);
	}),
};

export const QuickFormActionDoesNotFlicker: Story = {
	render: () => (
		<form action={() => new Promise<void>((resolve) => setTimeout(resolve, 50))}>
			<Button type="submit">Quick submit</Button>
		</form>
	),
	play: guardPlay(async ({ canvasElement }) => {
		await expectNoSpinnerDuringQuickAction(within(canvasElement).getByRole('button', { name: 'Quick submit' }));
	}),
};

class ActionErrorBoundary extends Component<{ readonly children: ReactNode }, { readonly error: Error | null }> {
	state: { readonly error: Error | null } = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return <p role="alert">{this.state.error.message}</p>;
		}
		return this.props.children;
	}
}

export const RejectedAction: Story = {
	render: () => (
		<ActionErrorBoundary>
			<Button
				action={async () => {
					await new Promise<void>((resolve) => setTimeout(resolve, 25));
					throw new Error('The Action failed');
				}}
			>
				Run failing Action
			</Button>
		</ActionErrorBoundary>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Run failing Action' }));
		await expect(await canvas.findByRole('alert')).toHaveTextContent('The Action failed');
	}),
};

export const WithPrefixIcon: Story = {
	render: (args) => (
		<Button {...args} action={() => action('prefix-icon-button-click')()}>
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
		<Button {...args} action={() => action('suffix-icon-button-click')()}>
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
		<Button {...args} action={() => action('both-icons-button-click')()}>
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

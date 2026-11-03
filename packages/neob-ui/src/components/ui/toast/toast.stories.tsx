import { toast as sonnerToast } from 'sonner';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { guardPlay } from '@/lib/storybook-interactions';

import { toast } from './toast';
import { Toaster } from './toaster';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

type ToastButtonConfiguration = {
	label: string;
	variant: ComponentProps<typeof Button>['variant'];
	color?: ComponentProps<typeof Button>['color'];
	kind: 'custom' | 'success' | 'error' | 'info' | 'warning';
	title: string;
	description?: string;
	actionLabel?: string;
	actionEvent?: string;
};

type ToastStoryProperties = {
	buttons: ToastButtonConfiguration[];
	toaster?: ComponentProps<typeof Toaster>;
};

/**
 * toast provides imperative toaster alerts functions.
 *
 * ### Usage
 * ```tsx
 * import { toast } from '@joyful.tools/neob';
 *
 * toast.success('Operation completed!');
 * toast.error('Something went wrong.');
 * ```
 */
const meta = {
	title: 'Feedback/Toast',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	beforeEach: () => dismissAllToasts,
	decorators: [
		(Story, { args }) => (
			<>
				<Toaster {...args.toaster} />
				<Story />
			</>
		),
	],
} satisfies Meta<ToastStoryProperties>;

export default meta;
type Story = StoryObj<ToastStoryProperties>;

function dismissAllToasts() {
	sonnerToast.dismiss();
}

const showToast = (button: ToastButtonConfiguration) => {
	const options = {
		description: button.description,
		action: button.actionLabel
			? {
					label: button.actionLabel,
					action: () => action(button.actionEvent ?? 'toast-action')(),
				}
			: undefined,
	};

	switch (button.kind) {
		case 'success': {
			toast.success(button.title, options);
			return;
		}
		case 'error': {
			toast.error(button.title, options);
			return;
		}
		case 'info': {
			toast.info(button.title, options);
			return;
		}
		case 'warning': {
			toast.warning(button.title, options);
			return;
		}
		default: {
			toast.custom(button.title, options);
		}
	}
};

async function expectToastLayout(toastElement: HTMLElement) {
	const heading = within(toastElement).getByRole('heading');
	const closeButton = within(toastElement).getByRole('button', { name: 'Close notification' });
	const actionButton = within(toastElement)
		.queryAllByRole('button')
		.find((button) => button !== closeButton);
	const description = toastElement.querySelector('p');
	const content = heading.parentElement;
	if (!content) throw new Error('Expected toast content.');
	await waitFor(() => expect(closeButton).toBeVisible());
	const headingBounds = heading.getBoundingClientRect();
	const closeBounds = closeButton.getBoundingClientRect();
	const contentBounds = content.getBoundingClientRect();
	const rtl = getComputedStyle(content).direction === 'rtl';

	await expect(closeButton.offsetWidth).toBe(40);
	await expect(closeButton.offsetHeight).toBe(40);
	await expect(closeBounds.right).toBeLessThanOrEqual(contentBounds.right - 7.99);
	await expect(closeBounds.top).toBeGreaterThanOrEqual(contentBounds.top + 7.99);
	await expect(closeBounds.bottom).toBeLessThanOrEqual(contentBounds.bottom - 7.99);
	await expect(toastElement.scrollWidth).toBeLessThanOrEqual(toastElement.clientWidth);

	const firstLineCenter = headingBounds.top + Number.parseFloat(getComputedStyle(heading).lineHeight) / 2;
	await (rtl
		? expect(closeBounds.right).toBeLessThanOrEqual(headingBounds.left)
		: expect(closeBounds.left).toBeGreaterThanOrEqual(headingBounds.right));
	await expect(Math.abs(closeBounds.top + closeBounds.height / 2 - firstLineCenter)).toBeLessThanOrEqual(1);
	if (!actionButton) return;

	const actionBounds = actionButton.getBoundingClientRect();
	await expect(actionBounds.width).toBeLessThan(contentBounds.width);
	await expect(actionButton.offsetHeight).toBeGreaterThanOrEqual(32);
	await expect(getComputedStyle(actionButton).fontSize).toBe('12px');
	await expect(contentBounds.bottom - actionBounds.bottom).toBeGreaterThanOrEqual(15.99);
	await expect(contentBounds.right - actionBounds.right).toBeGreaterThanOrEqual(16);

	if (description) {
		await expect(actionBounds.top - description.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(12);
		return;
	}

	if (actionBounds.top >= headingBounds.bottom) {
		await expect(actionBounds.top - headingBounds.bottom).toBeGreaterThanOrEqual(12);
		return;
	}
	await (rtl
		? expect(actionBounds.left).toBeGreaterThanOrEqual(closeBounds.right)
		: expect(actionBounds.right).toBeLessThanOrEqual(closeBounds.left));
	await expect(Math.abs(actionBounds.top + actionBounds.height / 2 - closeBounds.top - closeBounds.height / 2)).toBeLessThanOrEqual(1);
	await expect(Math.abs(actionBounds.top + actionBounds.height / 2 - headingBounds.top - headingBounds.height / 2)).toBeLessThanOrEqual(1);
}

export const AllVariants: Story = {
	args: {
		buttons: [
			{ label: 'Default', variant: 'default', kind: 'custom', title: 'Default Toast', description: 'This is a standard notification.' },
			{
				label: 'Success',
				variant: 'default',
				color: 'green',
				kind: 'success',
				title: 'Success!',
				description: 'Your changes have been saved.',
			},
			{ label: 'Error', variant: 'danger', kind: 'error', title: 'Something went wrong', description: 'Please try again later.' },
			{ label: 'Info', variant: 'subtle', kind: 'info', title: 'Did you know?', description: 'You can drag toasts to dismiss them.' },
			{ label: 'Warning', variant: 'default', kind: 'warning', title: 'Careful!', description: 'This action may have side effects.' },
		],
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} color={button.color} action={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Default' }));
		await expect(document.body.querySelector('[data-sonner-toast]')).not.toBeNull();
	}),
};

export const WithActions: Story = {
	args: {
		buttons: [
			{
				label: 'Default + Action',
				variant: 'default',
				kind: 'custom',
				title: 'File uploaded',
				description: 'document.pdf has been uploaded successfully.',
				actionLabel: 'Open File',
				actionEvent: 'toast-open-file',
			},
			{
				label: 'Success + Action',
				variant: 'default',
				color: 'green',
				kind: 'success',
				title: 'Team created',
				description: 'Your new team is ready to go.',
				actionLabel: 'Invite Team Members',
				actionEvent: 'toast-invite-team-members',
			},
			{
				label: 'Error + Action',
				variant: 'danger',
				kind: 'error',
				title: 'Connection failed',
				description: 'Could not reach the server.',
				actionLabel: 'Retry',
				actionEvent: 'toast-retry-connection',
			},
		],
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} color={button.color} action={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		for (const button of args.buttons) {
			if (!button.actionLabel) throw new Error('Expected a toast action label.');
			await userEvent.click(canvas.getByRole('button', { name: button.label }));
			const toastElement = body.getByRole('heading', { name: button.title }).closest('[data-sonner-toast]');
			if (!(toastElement instanceof HTMLElement)) throw new Error('Expected a toast notification.');
			await expectToastLayout(toastElement);
			await userEvent.click(within(toastElement).getByRole('button', { name: button.actionLabel }));
			await userEvent.click(within(toastElement).getByRole('button', { name: 'Close notification' }));
			await waitFor(() => expect(toastElement.isConnected).toBe(false));
		}
	}),
};

export const InlineWithActions: Story = {
	...WithActions,
	parameters: {
		docs: {
			description: { story: 'Title-only notifications with compact inline actions, without a description.' },
		},
	},
	args: {
		buttons: [
			{ label: 'Default + Action', variant: 'default', kind: 'custom', title: 'Archived', actionLabel: 'Undo' },
			{ label: 'Success + Action', variant: 'default', color: 'green', kind: 'success', title: 'Saved', actionLabel: 'View' },
			{ label: 'Error + Action', variant: 'danger', kind: 'error', title: 'Connection lost', actionLabel: 'Retry' },
			{ label: 'Info + Action', variant: 'subtle', kind: 'info', title: 'Update ready', actionLabel: 'Install' },
			{ label: 'Warning + Action', variant: 'default', kind: 'warning', title: 'Unsaved changes', actionLabel: 'Save' },
		],
	},
	play: guardPlay(async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		for (const button of args.buttons) {
			if (!button.actionLabel) throw new Error('Expected a toast action label.');
			await userEvent.click(canvas.getByRole('button', { name: button.label }));
			const toastElement = body.getByRole('heading', { name: button.title }).closest('[data-sonner-toast]');
			if (!(toastElement instanceof HTMLElement)) throw new Error('Expected a toast notification.');

			const actionButton = within(toastElement).getByRole('button', { name: button.actionLabel });
			await expect(toastElement.querySelector('p')).toBeNull();
			await waitFor(() => expect(actionButton).toBeVisible());
			await expect(actionButton.offsetWidth).toBeLessThan(toastElement.clientWidth);
			await expect(toastElement.scrollWidth).toBeLessThanOrEqual(toastElement.clientWidth);
			await expectToastLayout(toastElement);
			await userEvent.click(actionButton);
			await userEvent.click(within(toastElement).getByRole('button', { name: 'Close notification' }));
			await waitFor(() => expect(toastElement.isConnected).toBe(false));
		}
	}),
};

export const LongTitleWithActions: Story = {
	...InlineWithActions,
	parameters: {
		docs: {
			description: {
				story:
					'Multiline titles and localized actions. Actions wrap below the message while the dismiss button stays in the top-right corner.',
			},
		},
	},
	args: {
		buttons: [
			{
				label: 'Multiline + Action',
				variant: 'danger',
				kind: 'error',
				title: 'Connection timed out. Showing limited messages.',
				actionLabel: 'Retry',
			},
			{
				label: 'Localized + Action',
				variant: 'danger',
				kind: 'error',
				title: 'Anslutningen har avbrutits. Visar begränsade meddelanden.',
				actionLabel: 'Försök igen',
			},
			{
				label: 'Long Action Label',
				variant: 'subtle',
				kind: 'info',
				title: 'Connection restored',
				actionLabel: 'Reconnect to the messaging service',
			},
		],
	},
};

export const Minimal: Story = {
	args: {
		buttons: [
			{ label: 'Title Only', variant: 'default', kind: 'custom', title: 'Copied to clipboard' },
			{ label: 'Success Title Only', variant: 'default', color: 'green', kind: 'success', title: 'Saved' },
			{ label: 'Error Title Only', variant: 'danger', kind: 'error', title: 'Failed' },
			{ label: 'Info Title Only', variant: 'subtle', kind: 'info', title: 'Updated' },
			{ label: 'Warning Title Only', variant: 'default', kind: 'warning', title: 'Unsaved changes' },
		],
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} color={button.color} action={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		for (const button of args.buttons) {
			await userEvent.click(canvas.getByRole('button', { name: button.label }));
			const toastElement = body.getByText(button.title).closest('[data-sonner-toast]');
			if (!(toastElement instanceof HTMLElement)) throw new Error('Expected a toast notification.');

			const closeButton = within(toastElement).getByRole('button', { name: 'Close notification' });
			await expect(toastElement.offsetHeight).toBeGreaterThan(0);
			const heading = within(toastElement).getByRole('heading');
			if (heading.offsetHeight <= Number.parseFloat(getComputedStyle(heading).lineHeight)) {
				await expect(toastElement.offsetHeight).toBeLessThanOrEqual(60);
			}
			await expect(closeButton.offsetWidth).toBe(40);
			await expect(closeButton.offsetHeight).toBe(40);
			await expect(toastElement.querySelector('p')).toBeNull();
			await expectToastLayout(toastElement);

			await userEvent.click(closeButton);
			await waitFor(() => expect(toastElement.isConnected).toBe(false));
		}
	}),
};

export const LongContent: Story = {
	args: {
		buttons: [
			{
				label: 'Long notification',
				variant: 'default',
				kind: 'custom',
				title: 'Your workspace changes have been saved and are ready to share with your team',
				description: 'Uploaded workspace-backup-with-a-very-long-unbroken-filename-2026-10-01-final.json successfully.',
				actionLabel: 'View workspace',
			},
		],
	},
	render: (args) => <Button action={() => showToast(args.buttons[0])}>{args.buttons[0].label}</Button>,
	play: guardPlay(async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		const button = args.buttons[0];
		await userEvent.click(canvas.getByRole('button', { name: button.label }));

		const heading = body.getByRole('heading', { name: button.title });
		const toastElement = heading.closest('[data-sonner-toast]');
		if (!(toastElement instanceof HTMLElement)) throw new Error('Expected a toast notification.');

		const closeButton = within(toastElement).getByRole('button', { name: 'Close notification' });
		await expect(toastElement.offsetHeight).toBeGreaterThan(52);
		await expect(toastElement.scrollWidth).toBeLessThanOrEqual(toastElement.clientWidth);
		await expect(heading.getBoundingClientRect().right).toBeLessThanOrEqual(closeButton.getBoundingClientRect().left);
		await expect(within(toastElement).getByRole('button', { name: 'View workspace' })).toBeInTheDocument();
		await expectToastLayout(toastElement);

		await userEvent.click(closeButton);
		await waitFor(() => expect(toastElement.isConnected).toBe(false));
	}),
};

export const VariantDismissal: Story = {
	args: {
		buttons: [
			{
				label: 'Success Variant',
				variant: 'default',
				color: 'green',
				kind: 'success',
				title: 'Deployment complete',
				description: 'All services are healthy.',
			},
			{
				label: 'Warning Variant',
				variant: 'default',
				kind: 'warning',
				title: 'High memory usage',
				description: 'One worker exceeded the soft limit.',
			},
			{
				label: 'Info Variant',
				variant: 'subtle',
				kind: 'info',
				title: 'Maintenance window',
				description: 'Planned maintenance starts in 15 minutes.',
			},
		],
	},
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{args.buttons.map((button) => (
				<Button key={button.label} variant={button.variant} color={button.color} action={() => showToast(button)}>
					{button.label}
				</Button>
			))}
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await userEvent.click(canvas.getByRole('button', { name: 'Success Variant' }));
		await expect(body.getByText('Deployment complete')).toBeInTheDocument();
		await expect(body.getByText('All services are healthy.')).toBeInTheDocument();

		await userEvent.click(canvas.getByRole('button', { name: 'Warning Variant' }));
		await expect(body.getByText('High memory usage')).toBeInTheDocument();

		await userEvent.click(canvas.getByRole('button', { name: 'Info Variant' }));
		await expect(body.getByText('Maintenance window')).toBeInTheDocument();

		const lastToast = document.body
			.querySelectorAll('[data-sonner-toast]')
			.item(document.body.querySelectorAll('[data-sonner-toast]').length - 1);
		const closeButton = lastToast?.querySelector('button');

		await expect(closeButton).not.toBeNull();
		await userEvent.click(closeButton!);
		await waitFor(() => {
			expect(lastToast?.isConnected).toBe(false);
		});
	}),
};

async function resizeTestViewport(width: number, height: number) {
	if (!('__vitest_browser__' in globalThis)) return;
	const { page } = await import('vitest/browser');
	await page.viewport(width, height);
}

async function getToast(title: string): Promise<HTMLElement> {
	const heading = await within(document.body).findByRole('heading', { name: title });
	const element = heading.closest('[data-sonner-toast]');
	if (!(element instanceof HTMLElement)) throw new Error('Expected a toast notification.');
	return element;
}

async function dismissToast(element: HTMLElement) {
	await userEvent.click(within(element).getByRole('button', { name: 'Close notification' }));
	await waitFor(() => expect(element.isConnected).toBe(false));
}

async function expectPlacement(
	element: HTMLElement,
	{ left, right, bottom, top }: { left?: number; right?: number; bottom?: number; top?: number } = {},
) {
	await waitFor(() => {
		const bounds = element.getBoundingClientRect();
		expect(bounds.left).toBeGreaterThanOrEqual(0);
		expect(bounds.right).toBeLessThanOrEqual(window.innerWidth);
		expect(bounds.top).toBeGreaterThanOrEqual(0);
		expect(bounds.bottom).toBeLessThanOrEqual(window.innerHeight);
		if (left !== undefined) expect(bounds.left).toBeCloseTo(left, 0);
		if (right !== undefined) expect(window.innerWidth - bounds.right).toBeCloseTo(right, 0);
		if (bottom !== undefined) expect(window.innerHeight - bounds.bottom).toBeCloseTo(bottom, 0);
		if (top !== undefined) expect(bounds.top).toBeCloseTo(top, 0);
	});
}

const mobileButtons: ToastButtonConfiguration[] = [
	{ label: 'Compact action', variant: 'default', kind: 'success', title: 'Saved', actionLabel: 'View' },
	{ label: 'Title only', variant: 'default', kind: 'custom', title: 'Copied to clipboard' },
	{
		label: 'Localized action',
		variant: 'danger',
		kind: 'error',
		title: 'Anslutningen har avbrutits. Visar begränsade meddelanden.',
		actionLabel: 'Anslut till meddelandetjänsten igen',
	},
	{
		label: 'Description only',
		variant: 'default',
		kind: 'warning',
		title: 'Unsaved changes',
		description: 'Save your work before leaving this page.',
	},
	{
		label: 'Long content',
		variant: 'subtle',
		kind: 'info',
		title: 'Your workspace changes have been saved and are ready to share with your team',
		description: 'Uploaded workspace-backup-with-a-very-long-unbroken-filename-2026-10-01-final.json successfully.',
		actionLabel: 'View workspace',
	},
];

function mobileLayoutPlay(width: number, height = 812) {
	return guardPlay<Parameters<NonNullable<Story['play']>>[0]>(async ({ canvasElement, args }) => {
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		try {
			await resizeTestViewport(width, height);
			for (const button of args.buttons) {
				const trigger = within(canvasElement).getByRole('button', { name: button.label });
				await userEvent.click(trigger);
				const element = await getToast(button.title);
				await expectToastLayout(element);
				await expectPlacement(element, width <= 600 ? { left: 16, right: 16, bottom: 16 } : { right: 24, bottom: 24 });
				await expect(element.contains(document.activeElement)).toBe(false);
				await expect(element.closest('section')).toHaveAttribute('aria-live', 'polite');
				if (button.label === 'Compact action') {
					await expect(element.querySelector('[data-slot="toast-action-row"]')).toHaveAttribute('data-inline', 'true');
				}
				const description = element.querySelector('p');
				if (description) await expect(getComputedStyle(description).fontWeight).toBe('400');
				await dismissToast(element);
			}
		} finally {
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	});
}

export const MobileNarrow: Story = {
	...AllVariants,
	args: { buttons: mobileButtons },
	parameters: { docs: { description: { story: '320px layout with compact controls, inline actions, and localized wrapping.' } } },
	play: mobileLayoutPlay(320),
};

export const Mobile: Story = { ...MobileNarrow, play: mobileLayoutPlay(375) };
export const MobileWide: Story = { ...MobileNarrow, play: mobileLayoutPlay(430) };
export const MobileBreakpoint: Story = { ...MobileNarrow, play: mobileLayoutPlay(600) };
export const DesktopBreakpoint: Story = { ...MobileNarrow, play: mobileLayoutPlay(601) };
export const Landscape: Story = { ...MobileNarrow, play: mobileLayoutPlay(844, 390) };
export const MobileDark: Story = { ...Mobile, globals: { theme: 'dark' } };

export const MobileNavigation: Story = {
	...Mobile,
	args: {
		buttons: mobileButtons.slice(0, 1),
		toaster: { className: 'consumer-toaster', position: 'bottom-center', mobileOffset: { bottom: 80, left: 24, right: 40 } },
	},
	play: guardPlay(async ({ canvasElement, args }) => {
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		try {
			await resizeTestViewport(375, 812);
			await userEvent.click(within(canvasElement).getByRole('button', { name: 'Compact action' }));
			const element = await getToast(args.buttons[0].title);
			await expectToastLayout(element);
			await expectPlacement(element, { left: 24, right: 40, bottom: 80 });
			await expect(element.parentElement).toHaveClass('consumer-toaster', 'neob-toaster');
			await dismissToast(element);
		} finally {
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	}),
};

export const MobileTop: Story = {
	...MobileNavigation,
	args: { buttons: mobileButtons.slice(0, 1), toaster: { position: 'top-left', mobileOffset: { top: 64 }, dir: 'rtl' } },
	play: guardPlay(async ({ canvasElement, args }) => {
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		try {
			await resizeTestViewport(375, 812);
			await userEvent.click(within(canvasElement).getByRole('button', { name: 'Compact action' }));
			const element = await getToast(args.buttons[0].title);
			await expectToastLayout(element);
			await expectPlacement(element, { left: 16, right: 16, top: 64 });
			await expect(element.parentElement?.style.getPropertyValue('--mobile-offset-bottom')).toContain('safe-area-inset-bottom');
			await dismissToast(element);
		} finally {
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	}),
};

export const MobileZeroOffset: Story = {
	...MobileNavigation,
	args: { buttons: mobileButtons.slice(0, 1), toaster: { mobileOffset: 0 } },
	play: guardPlay(async ({ canvasElement, args }) => {
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		try {
			await resizeTestViewport(375, 812);
			await userEvent.click(within(canvasElement).getByRole('button', { name: 'Compact action' }));
			const element = await getToast(args.buttons[0].title);
			await expectPlacement(element, { left: 0, right: 0, bottom: 0 });
			await dismissToast(element);
		} finally {
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	}),
};

class ToastViewportMock extends EventTarget {
	height = window.innerHeight;
	offsetTop = 0;
	scale = 1;

	update(values: Partial<Pick<VisualViewport, 'height' | 'offsetTop' | 'scale'>>, event: 'resize' | 'scroll' = 'resize') {
		Object.assign(this, values);
		this.dispatchEvent(new Event(event));
	}
}

function mockVisualViewport(viewport: ToastViewportMock | null) {
	const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'visualViewport');
	Object.defineProperty(globalThis, 'visualViewport', { configurable: true, value: viewport });
	return () => {
		if (descriptor) {
			Object.defineProperty(globalThis, 'visualViewport', descriptor);
		} else {
			Reflect.deleteProperty(globalThis, 'visualViewport');
		}
	};
}

export const KeyboardViewport: Story = {
	...Mobile,
	args: { buttons: mobileButtons.slice(0, 1), toaster: { duration: Infinity } },
	beforeEach: () => mockVisualViewport(new ToastViewportMock()),
	play: guardPlay(async ({ canvasElement, args }) => {
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		const viewport = window.visualViewport;
		if (!(viewport instanceof ToastViewportMock)) throw new Error('Expected the viewport test fixture.');
		try {
			await resizeTestViewport(375, 812);
			viewport.update({ height: window.innerHeight });
			await userEvent.click(within(canvasElement).getByRole('button', { name: 'Compact action' }));
			const element = await getToast(args.buttons[0].title);
			await expectPlacement(element, { bottom: 16 });

			viewport.update({ height: window.innerHeight - 300 });
			await expectPlacement(element, { bottom: 316 });
			viewport.update({ offsetTop: 50 }, 'scroll');
			await expectPlacement(element, { bottom: 266 });
			viewport.update({ scale: 2, height: 200 });
			await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
			await expectPlacement(element, { bottom: 266 });
			viewport.update({ scale: 1, height: window.innerHeight, offsetTop: 0 });
			await expectPlacement(element, { bottom: 16 });

			await resizeTestViewport(844, 390);
			viewport.update({ height: window.innerHeight - 160 });
			await expectPlacement(element, { right: 24, bottom: 176 });
			// Some browsers resize both viewports; subtracting the visible height avoids lifting twice.
			viewport.update({ height: window.innerHeight });
			globalThis.dispatchEvent(new Event('resize'));
			await expectPlacement(element, { bottom: 24 });
			await dismissToast(element);
		} finally {
			viewport.update({ height: originalSize.height, offsetTop: 0, scale: 1 });
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	}),
};

export const WithoutVisualViewport: Story = {
	...Mobile,
	beforeEach: () => mockVisualViewport(null),
};

export const KeyboardNavigation: Story = {
	...KeyboardViewport,
	args: { buttons: mobileButtons.slice(0, 1), toaster: { mobileOffset: { bottom: 80 }, duration: Infinity } },
	play: guardPlay(async ({ canvasElement, args }) => {
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		const viewport = window.visualViewport;
		if (!(viewport instanceof ToastViewportMock)) throw new Error('Expected the viewport test fixture.');
		try {
			await resizeTestViewport(375, 812);
			viewport.update({ height: window.innerHeight });
			await userEvent.click(within(canvasElement).getByRole('button', { name: 'Compact action' }));
			const element = await getToast(args.buttons[0].title);
			await expectPlacement(element, { bottom: 80 });
			viewport.update({ height: window.innerHeight - 40 });
			await expectPlacement(element, { bottom: 80 });
			viewport.update({ height: window.innerHeight - 300 });
			await expectPlacement(element, { bottom: 316 });
			viewport.update({ height: window.innerHeight });
			await expectPlacement(element, { bottom: 80 });
			await dismissToast(element);
		} finally {
			viewport.update({ height: originalSize.height });
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	}),
};

export const MobileStack: Story = {
	...Mobile,
	args: { buttons: mobileButtons.slice(0, 3), toaster: { duration: Infinity } },
	play: guardPlay(async ({ canvasElement, args }) => {
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		try {
			await resizeTestViewport(375, 812);
			for (const button of args.buttons) {
				await userEvent.click(within(canvasElement).getByRole('button', { name: button.label }));
			}
			await expect(document.querySelectorAll('[data-sonner-toast]')).toHaveLength(3);
			for (let index = args.buttons.length - 1; index >= 0; index--) {
				const button = args.buttons[index];
				const element = await getToast(button.title);
				await waitFor(() => expect(element).toHaveAttribute('data-front', 'true'));
				await expectPlacement(element, { left: 16, right: 16, bottom: 16 });
				await expectToastLayout(element);
				await dismissToast(element);
			}
		} finally {
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	}),
};

export const SafeAreasAndTouch: Story = {
	...Mobile,
	args: { buttons: mobileButtons.slice(0, 1), toaster: { duration: Infinity } },
	play: guardPlay(async ({ canvasElement, args }) => {
		if (!('__vitest_browser__' in globalThis)) return;
		const { cdp } = await import('vitest/browser');
		const session = cdp();
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		try {
			await session.send('Emulation.setTouchEmulationEnabled', { enabled: true });
			await session.send('Emulation.setSafeAreaInsetsOverride', { insets: { left: 21, right: 37, top: 47, bottom: 34 } });
			await resizeTestViewport(375, 812);
			await userEvent.click(within(canvasElement).getByRole('button', { name: 'Compact action' }));
			const element = await getToast(args.buttons[0].title);
			await expectPlacement(element, { left: 37, right: 53, bottom: 50 });
			await expectToastLayout(element);
			await resizeTestViewport(844, 390);
			await expect(globalThis.matchMedia('(pointer: coarse)').matches).toBe(true);
			await expectPlacement(element, { right: 61, bottom: 58 });
			await expectToastLayout(element);
			await dismissToast(element);
		} finally {
			await session.send('Emulation.setTouchEmulationEnabled', { enabled: false });
			await session.send('Emulation.setSafeAreaInsetsOverride', { insets: {} });
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	}),
};

export const MobileForm: Story = {
	args: { buttons: [], toaster: { duration: Infinity } },
	parameters: {
		docs: {
			description: { story: 'On a phone, focus the field to verify that feedback rises above the native keyboard without moving focus.' },
		},
	},
	render: () => (
		<div className="w-full max-w-sm p-4">
			<Input
				label="Message"
				placeholder="Write a message"
				onFocus={() => toast.info('Editing draft', { description: 'Your work is saved automatically.' })}
			/>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const originalSize = { width: window.innerWidth, height: window.innerHeight };
		try {
			await resizeTestViewport(375, 812);
			const input = within(canvasElement).getByRole('textbox', { name: 'Message' });
			await userEvent.click(input);
			const element = await getToast('Editing draft');
			await expectPlacement(element, { left: 16, right: 16, bottom: 16 });
			await expect(input).toHaveFocus();
			await dismissToast(element);
		} finally {
			await resizeTestViewport(originalSize.width, originalSize.height);
		}
	}),
};

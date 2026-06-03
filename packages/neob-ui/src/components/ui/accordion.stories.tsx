import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Accordion } from './accordion';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Accordion is a collapsible panel component built on Base UI with custom spring animations.
 *
 * ### General Usage
 * ```tsx
 * import { Accordion } from 'neob';
 *
 * <Accordion type="single" collapsible defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Is it brutalist?</Accordion.Trigger>
 *     <Accordion.Content>Yes, stark borders and spring motion.</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
const meta = {
	title: 'Data Display/Accordion',
	component: Accordion,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleMode: Story = {
	render: () => (
		<div className="w-[400px] rounded-2xl border border-black/10 bg-muted/20 p-4">
			<Accordion defaultValue={['item-1']}>
				<Accordion.Item value="item-1">
					<Accordion.Trigger>Item 1: Brutalist Philosophy</Accordion.Trigger>
					<Accordion.Content>
						Brutalism values honesty of materials, raw texture, and stark, structural forms over polished elegance.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-2">
					<Accordion.Trigger>Item 2: React 19 Core</Accordion.Trigger>
					<Accordion.Content>
						React 19 introduces automatic ref forwarding, Server Actions, and enhanced hooks to simplify UI coordination.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-3">
					<Accordion.Trigger>Item 3: Base UI Primitives</Accordion.Trigger>
					<Accordion.Content>
						Base UI offers unstyled, highly accessible foundations that give you complete design freedom.
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const trigger1 = canvas.getByRole('button', { name: /Brutalist Philosophy/i });
		const trigger2 = canvas.getByRole('button', { name: /React 19 Core/i });
		const trigger3 = canvas.getByRole('button', { name: /Base UI Primitives/i });

		await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
		await expect(trigger2).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger3).toHaveAttribute('aria-expanded', 'false');

		await userEvent.click(trigger2);
		// Wait for grid-rows CSS transition to trigger
		await new Promise((resolve) => setTimeout(resolve, 300));
		await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger2).toHaveAttribute('aria-expanded', 'true');

		await userEvent.click(trigger2);
		await new Promise((resolve) => setTimeout(resolve, 300));
		await expect(trigger2).toHaveAttribute('aria-expanded', 'false');
	}),
};

export const MultipleMode: Story = {
	render: () => (
		<div className="w-[400px] rounded-2xl border border-black/10 bg-muted/20 p-4">
			<Accordion multiple defaultValue={['item-1', 'item-3']}>
				<Accordion.Item value="item-1">
					<Accordion.Trigger>Panel 1</Accordion.Trigger>
					<Accordion.Content>This is panel 1 content.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-2">
					<Accordion.Trigger>Panel 2</Accordion.Trigger>
					<Accordion.Content>This is panel 2 content.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-3">
					<Accordion.Trigger>Panel 3</Accordion.Trigger>
					<Accordion.Content>This is panel 3 content.</Accordion.Content>
				</Accordion.Item>
			</Accordion>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const trigger1 = canvas.getByRole('button', { name: /Panel 1/i });
		const trigger2 = canvas.getByRole('button', { name: /Panel 2/i });
		const trigger3 = canvas.getByRole('button', { name: /Panel 3/i });

		await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
		await expect(trigger2).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger3).toHaveAttribute('aria-expanded', 'true');

		await userEvent.click(trigger2);
		await new Promise((resolve) => setTimeout(resolve, 300));
		await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
		await expect(trigger2).toHaveAttribute('aria-expanded', 'true');
		await expect(trigger3).toHaveAttribute('aria-expanded', 'true');

		await userEvent.click(trigger1);
		await new Promise((resolve) => setTimeout(resolve, 300));
		await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger2).toHaveAttribute('aria-expanded', 'true');
		await expect(trigger3).toHaveAttribute('aria-expanded', 'true');
	}),
};

import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { ButtonGroup } from './button-group';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ButtonGroup provides a cohesive layout for grouping related buttons with shared brutalist borders.
 *
 * ### General Usage
 * ```tsx
 * import { ButtonGroup } from 'neob';
 *
 * <ButtonGroup>
 *   <ButtonGroup.Button active>Left</ButtonGroup.Button>
 *   <ButtonGroup.Button>Middle</ButtonGroup.Button>
 *   <ButtonGroup.Button>Right</ButtonGroup.Button>
 * </ButtonGroup>
 * ```
 */
const meta = {
	title: 'Inputs/ButtonGroup',
	component: ButtonGroup,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ButtonGroup defaultValue="all">
			<ButtonGroup.Button value="all">All Items</ButtonGroup.Button>
			<ButtonGroup.Button value="pending">Pending</ButtonGroup.Button>
			<ButtonGroup.Button value="completed">Completed</ButtonGroup.Button>
		</ButtonGroup>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const group = canvas.getByRole('radiogroup');
		expect(group).toBeInTheDocument();

		const optAll = canvas.getByRole('radio', { name: /All Items/i });
		const optPending = canvas.getByRole('radio', { name: /Pending/i });
		const optCompleted = canvas.getByRole('radio', { name: /Completed/i });

		await expect(optAll).toHaveAttribute('aria-checked', 'true');
		await expect(optPending).toHaveAttribute('aria-checked', 'false');

		await userEvent.click(optPending);
		await expect(optAll).toHaveAttribute('aria-checked', 'false');
		await expect(optPending).toHaveAttribute('aria-checked', 'true');

		await userEvent.click(optCompleted);
		await expect(optPending).toHaveAttribute('aria-checked', 'false');
		await expect(optCompleted).toHaveAttribute('aria-checked', 'true');
	}),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<ButtonGroup defaultValue="first" size="sm">
				<ButtonGroup.Button value="first">First</ButtonGroup.Button>
				<ButtonGroup.Button value="second">Second</ButtonGroup.Button>
				<ButtonGroup.Button value="third">Third</ButtonGroup.Button>
				<ButtonGroup.Button value="fourth">Fourth</ButtonGroup.Button>
			</ButtonGroup>

			<ButtonGroup defaultValue="play" size="default">
				<ButtonGroup.Button value="play">Play</ButtonGroup.Button>
				<ButtonGroup.Button value="pause">Pause</ButtonGroup.Button>
				<ButtonGroup.Button value="stop">Stop</ButtonGroup.Button>
			</ButtonGroup>

			<ButtonGroup defaultValue="yes" size="lg">
				<ButtonGroup.Button value="yes">Yes</ButtonGroup.Button>
				<ButtonGroup.Button value="no">No</ButtonGroup.Button>
				<ButtonGroup.Button value="maybe">Maybe</ButtonGroup.Button>
			</ButtonGroup>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const optNo = canvas.getByRole('radio', { name: /^No$/i });
		const optYes = canvas.getByRole('radio', { name: /^Yes$/i });

		await expect(optYes).toHaveAttribute('aria-checked', 'true');
		await userEvent.click(optNo);
		await expect(optNo).toHaveAttribute('aria-checked', 'true');
		await expect(optYes).toHaveAttribute('aria-checked', 'false');
	}),
};

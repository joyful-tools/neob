import { useMemo } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { HumanizedTime } from './humanized-time';
import { Tooltip } from './tooltip';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Data Display/HumanizedTime',
	component: HumanizedTime,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof HumanizedTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiveMinutesAgo: Story = {
	render: () => {
		const dateVal = useMemo(() => new Date(Date.now() - 5 * 60 * 1000), []);
		return (
			<Tooltip.Provider>
				<div className="p-8">
					<HumanizedTime
						data-testid="time-el"
						date={dateVal}
						className="cursor-pointer rounded-lg border border-black bg-muted px-3 py-1.5 font-sans text-sm font-bold"
					/>
				</div>
			</Tooltip.Provider>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const timeEl = canvas.getByTestId('time-el');
		await expect(timeEl).toBeInTheDocument();
		await expect(timeEl).toHaveTextContent(/5 minutes ago/i);

		await userEvent.hover(timeEl);
		// Wait for tooltip trigger delay (300ms) and spring transition to settle
		await new Promise((resolve) => setTimeout(resolve, 800));

		const bodyCanvas = within(canvasElement.ownerDocument.body);
		const tooltip = bodyCanvas.getByRole('tooltip');
		await expect(tooltip).toBeInTheDocument();
	}),
};

export const JustNow: Story = {
	render: () => {
		const dateVal = useMemo(() => new Date(), []);
		return (
			<Tooltip.Provider>
				<div className="p-8">
					<HumanizedTime
						data-testid="time-el"
						date={dateVal}
						className="cursor-pointer rounded-lg border border-black bg-muted px-3 py-1.5 font-sans text-sm font-bold"
					/>
				</div>
			</Tooltip.Provider>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const timeEl = canvas.getByTestId('time-el');
		await expect(timeEl).toBeInTheDocument();
		await expect(timeEl).toHaveTextContent(/now/i);
	}),
};

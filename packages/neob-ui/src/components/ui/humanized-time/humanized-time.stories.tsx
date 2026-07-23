import { useMemo, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { guardPlay } from '@/lib/storybook-interactions';

import { HumanizedTime } from './humanized-time';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * HumanizedTime renders dynamic and readable relative/elapsed times.
 *
 * ### Usage
 * ```tsx
 * import { HumanizedTime } from '@joyful-tools/neob';
 *
 * <HumanizedTime date={new Date()} />
 * ```
 */
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
						className="cursor-pointer rounded-lg border border-edge bg-muted px-3 py-1.5 font-sans text-sm font-bold"
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

export const EpochAndLocaleChanges: Story = {
	render: () => {
		const [locale, setLocale] = useState('en');
		return (
			<Tooltip.Provider>
				<div className="flex flex-col items-center gap-4 p-8">
					<Button type="button" onClick={() => setLocale('de')}>
						Use German
					</Button>
					<HumanizedTime
						data-testid="epoch-time"
						date={0}
						locale={locale}
						className="cursor-pointer rounded-lg border border-edge bg-muted px-3 py-1.5 font-sans text-sm font-bold"
					/>
				</div>
			</Tooltip.Provider>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const timeElement = canvas.getByTestId('epoch-time');
		await expect(timeElement).toBeInTheDocument();
		await expect(timeElement).toHaveAttribute('datetime', new Date(0).toISOString());
		await expect(timeElement).toHaveTextContent(/ago/i);

		await userEvent.click(canvas.getByRole('button', { name: 'Use German' }));
		await expect(timeElement).toHaveTextContent(/vor/i);
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
						className="cursor-pointer rounded-lg border border-edge bg-muted px-3 py-1.5 font-sans text-sm font-bold"
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

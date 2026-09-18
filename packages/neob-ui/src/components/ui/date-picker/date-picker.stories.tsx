import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Temporal } from 'temporal-polyfill';

import { guardPlay } from '@/lib/storybook-interactions';

import { DatePicker, type DatePickerRange } from './date-picker';

import type { Meta } from '@storybook/react-vite';

type DatePickerSingleStoryProperties = {
	mode: 'single';
	initialSelected?: Temporal.PlainDate;
};

type DatePickerRangeStoryProperties = {
	mode: 'range';
	initialSelected?: DatePickerRange;
};

type DatePickerMultipleStoryProperties = {
	mode: 'multiple';
	initialSelected?: Temporal.PlainDate[];
	max?: number;
};

/**
 * DatePicker is a date selection calendar component built on Temporal.PlainDate.
 *
 * ### Usage
 * ```tsx
 * import { DatePicker } from '@joyful-tools/neob';
 *
 * <DatePicker mode="single" selected={date} action={setDate} />
 * ```
 */
const meta = {
	title: 'Inputs/DatePicker',
	component: DatePicker,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;

export const Single = {
	args: {
		mode: 'single',
		initialSelected: Temporal.PlainDate.from('2026-05-15'),
	},
	render: (args: DatePickerSingleStoryProperties) => {
		const [date, setDate] = useState<Temporal.PlainDate | undefined>(args.initialSelected);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker
					mode={args.mode}
					selected={date}
					action={(selected, triggerDate, modifiers, event_) => {
						setDate(selected);
						action('date-picker-single-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-single-month-change')(month);
					}}
				/>
				<div className="rounded-lg border-2 border-edge bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:bg-zinc">
					Selected Date: {date ? date.toLocaleString() : 'None'}
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('gridcell', { name: /16/i }));
		await expect(canvas.getByText(/Selected Date:/i)).toBeInTheDocument();
	}),
};

export const Range = {
	args: {
		mode: 'range',
		initialSelected: {
			from: Temporal.PlainDate.from('2026-05-10'),
			to: Temporal.PlainDate.from('2026-05-18'),
		},
	},
	render: (args: DatePickerRangeStoryProperties) => {
		const [range, setRange] = useState<DatePickerRange | undefined>(args.initialSelected);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker
					mode={args.mode}
					selected={range}
					action={(selected, triggerDate, modifiers, event_) => {
						setRange(selected);
						action('date-picker-range-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-range-month-change')(month);
					}}
				/>
				<div className="rounded-lg border-2 border-edge bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:bg-zinc">
					Selected Range: {range?.from ? range.from.toLocaleString() : 'None'} – {range?.to ? range.to.toLocaleString() : 'None'}
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const preservedStartDate = Temporal.PlainDate.from('2026-05-10').toLocaleString();
		const endDate = Temporal.PlainDate.from('2026-05-24').toLocaleString();
		await userEvent.click(canvas.getByText('20'));
		await userEvent.click(canvas.getByText('24'));
		await waitFor(() => {
			expect(canvas.getByText(/Selected Range:/i)).toHaveTextContent(preservedStartDate);
			expect(canvas.getByText(/Selected Range:/i)).toHaveTextContent(endDate);
		});
	}),
};

export const Multiple = {
	args: {
		mode: 'multiple',
		initialSelected: ['2026-05-12', '2026-05-15', '2026-05-19'].map((value) => Temporal.PlainDate.from(value)),
		max: 5,
	},
	render: (args: DatePickerMultipleStoryProperties) => {
		const [dates, setDates] = useState<readonly Temporal.PlainDate[] | undefined>(args.initialSelected);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker
					mode={args.mode}
					selected={dates}
					max={args.max}
					action={(selected, triggerDate, modifiers, event_) => {
						setDates(selected);
						action('date-picker-multiple-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-multiple-month-change')(month);
					}}
				/>
				<div className="max-w-xs rounded-lg border-2 border-edge bg-muted px-3 py-1.5 text-center font-mono text-sm font-bold dark:bg-zinc">
					Selected Dates: {dates && dates.length > 0 ? dates.map((date) => date.toLocaleString()).join(', ') : 'None'}
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const nextDate = Temporal.PlainDate.from('2026-05-20').toLocaleString();
		await userEvent.click(canvas.getByText('20'));
		await waitFor(() => {
			expect(canvas.getByText(/Selected Dates:/i)).toHaveTextContent(nextDate);
		});
	}),
};

export const MonthYearNavigation = {
	args: {
		mode: 'single',
		initialSelected: Temporal.PlainDate.from('2026-05-15'),
	},
	render: (args: DatePickerSingleStoryProperties) => {
		const [date, setDate] = useState<Temporal.PlainDate | undefined>(args.initialSelected);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker
					mode={args.mode}
					selected={date}
					action={(selected, triggerDate, modifiers, event_) => {
						setDate(selected);
						action('date-picker-navigation-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-navigation-month-change')(month);
					}}
				/>
				<div className="rounded-lg border-2 border-edge bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:bg-zinc">
					Selected Date: {date ? date.toLocaleString() : 'None'}
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByRole('button', { name: 'May' })).toBeInTheDocument();
		await expect(canvas.getByRole('button', { name: '2026' })).toBeInTheDocument();

		await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'June' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'June' }));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'JUN' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Previous year' }));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: '2025' })).toBeInTheDocument();
		});

		await waitFor(() => {
			expect(canvas.getByText('OCT')).toBeInTheDocument();
		});
		await userEvent.click(canvas.getByText('OCT'));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'October' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: '2025' }));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'Next years' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Next years' }));
		await waitFor(() => {
			expect(canvas.getByText('2033')).toBeInTheDocument();
		});
		await userEvent.click(canvas.getByText('2033'));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: '2033' })).toBeInTheDocument();
			expect(canvas.getByRole('button', { name: 'October' })).toBeInTheDocument();
		});
	}),
};

/* eslint-disable better-tailwindcss/no-unknown-classes */
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { DatePicker } from './date-picker';

import type { Meta } from '@storybook/react-vite';

type DatePickerSingleStoryProperties = {
	mode: 'single';
	initialSelected?: Date;
};

type DatePickerRangeStoryProperties = {
	mode: 'range';
	initialSelected?: DateRange;
};

type DatePickerMultipleStoryProperties = {
	mode: 'multiple';
	initialSelected?: Date[];
	max?: number;
};

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
		initialSelected: new Date(2026, 4, 15),
	},
	render: (args: DatePickerSingleStoryProperties) => {
		const [date, setDate] = useState<Date | undefined>(args.initialSelected);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker
					mode={args.mode}
					selected={date}
					onChange={(selected, triggerDate, modifiers, event_) => {
						setDate(selected);
						action('date-picker-single-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-single-month-change')(month);
					}}
				/>
				<div className="rounded-lg border-2 border-black bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:border-white dark:bg-zinc">
					Selected Date: {date ? date.toLocaleDateString() : 'None'}
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
			from: new Date(2026, 4, 10),
			to: new Date(2026, 4, 18),
		},
	},
	render: (args: DatePickerRangeStoryProperties) => {
		const [range, setRange] = useState<DateRange | undefined>(args.initialSelected);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker
					mode={args.mode}
					selected={range}
					onChange={(selected, triggerDate, modifiers, event_) => {
						setRange(selected);
						action('date-picker-range-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-range-month-change')(month);
					}}
				/>
				<div className="rounded-lg border-2 border-black bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:border-white dark:bg-zinc">
					Selected Range: {range?.from ? range.from.toLocaleDateString() : 'None'} – {range?.to ? range.to.toLocaleDateString() : 'None'}
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const preservedStartDate = new Date(2026, 4, 10).toLocaleDateString();
		const endDate = new Date(2026, 4, 24).toLocaleDateString();
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
		initialSelected: [new Date(2026, 4, 12), new Date(2026, 4, 15), new Date(2026, 4, 19)],
		max: 5,
	},
	render: (args: DatePickerMultipleStoryProperties) => {
		const [dates, setDates] = useState<Date[] | undefined>(args.initialSelected);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker
					mode={args.mode}
					selected={dates}
					max={args.max}
					onChange={(selected, triggerDate, modifiers, event_) => {
						setDates(selected);
						action('date-picker-multiple-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-multiple-month-change')(month);
					}}
				/>
				<div className="max-w-xs rounded-lg border-2 border-black bg-muted px-3 py-1.5 text-center font-mono text-sm font-bold dark:border-white dark:bg-zinc">
					Selected Dates: {dates && dates.length > 0 ? dates.map((d) => d.toLocaleDateString()).join(', ') : 'None'}
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const nextDate = new Date(2026, 4, 20).toLocaleDateString();
		await userEvent.click(canvas.getByText('20'));
		await waitFor(() => {
			expect(canvas.getByText(/Selected Dates:/i)).toHaveTextContent(nextDate);
		});
	}),
};

export const DarkMode = {
	args: {
		mode: 'range',
		initialSelected: {
			from: new Date(2026, 4, 14),
			to: new Date(2026, 4, 22),
		},
	},
	render: (args: DatePickerRangeStoryProperties) => {
		const [range, setRange] = useState<DateRange | undefined>(args.initialSelected);
		return (
			<div className="dark flex flex-col items-center gap-4 rounded-2xl border-4 border-black bg-black p-8">
				<DatePicker
					mode={args.mode}
					selected={range}
					onChange={(selected, triggerDate, modifiers, event_) => {
						setRange(selected);
						action('date-picker-dark-mode-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-dark-mode-month-change')(month);
					}}
				/>
				<div className="rounded-lg border-2 border-white bg-zinc px-3 py-1.5 font-mono text-sm font-bold text-white">
					Selected Range: {range?.from ? range.from.toLocaleDateString() : 'None'} – {range?.to ? range.to.toLocaleDateString() : 'None'}
				</div>
			</div>
		);
	},
};

export const MonthYearNavigation = {
	args: {
		mode: 'single',
		initialSelected: new Date(2026, 4, 15),
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args: DatePickerSingleStoryProperties) => {
		const [date, setDate] = useState<Date | undefined>(args.initialSelected);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker
					mode={args.mode}
					selected={date}
					onChange={(selected, triggerDate, modifiers, event_) => {
						setDate(selected);
						action('date-picker-navigation-change')(selected, triggerDate, modifiers, event_);
					}}
					onMonthChange={(month) => {
						action('date-picker-navigation-month-change')(month);
					}}
				/>
				<div className="rounded-lg border-2 border-black bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:border-white dark:bg-zinc">
					Selected Date: {date ? date.toLocaleDateString() : 'None'}
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

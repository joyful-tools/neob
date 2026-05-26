/* eslint-disable better-tailwindcss/no-unknown-classes */
import * as React from 'react';
import { type DateRange } from 'react-day-picker';

import { DatePicker } from './date-picker';

import type { Meta } from '@storybook/react-vite';

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
	render: () => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 4, 15)); // May 15, 2026
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker mode="single" selected={date} onChange={setDate} />
				<div className="rounded-lg border-2 border-black bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:border-white dark:bg-zinc">
					Selected Date: {date ? date.toLocaleDateString() : 'None'}
				</div>
			</div>
		);
	},
};

export const Range = {
	render: () => {
		const [range, setRange] = React.useState<DateRange | undefined>({
			from: new Date(2026, 4, 10),
			to: new Date(2026, 4, 18),
		});
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker mode="range" selected={range} onChange={setRange} />
				<div className="rounded-lg border-2 border-black bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:border-white dark:bg-zinc">
					Selected Range: {range?.from ? range.from.toLocaleDateString() : 'None'} – {range?.to ? range.to.toLocaleDateString() : 'None'}
				</div>
			</div>
		);
	},
};

export const Multiple = {
	render: () => {
		const [dates, setDates] = React.useState<Date[] | undefined>([new Date(2026, 4, 12), new Date(2026, 4, 15), new Date(2026, 4, 19)]);
		return (
			<div className="flex flex-col items-center gap-4">
				<DatePicker mode="multiple" selected={dates} onChange={setDates} max={5} />
				<div className="max-w-xs rounded-lg border-2 border-black bg-muted px-3 py-1.5 text-center font-mono text-sm font-bold dark:border-white dark:bg-zinc">
					Selected Dates: {dates && dates.length > 0 ? dates.map((d) => d.toLocaleDateString()).join(', ') : 'None'}
				</div>
			</div>
		);
	},
};

export const DarkMode = {
	render: () => {
		const [range, setRange] = React.useState<DateRange | undefined>({
			from: new Date(2026, 4, 14),
			to: new Date(2026, 4, 22),
		});
		return (
			<div className="dark flex flex-col items-center gap-4 rounded-2xl border-4 border-black bg-black p-8">
				<DatePicker mode="range" selected={range} onChange={setRange} />
				<div className="rounded-lg border-2 border-white bg-zinc px-3 py-1.5 font-mono text-sm font-bold text-white">
					Selected Range: {range?.from ? range.from.toLocaleDateString() : 'None'} – {range?.to ? range.to.toLocaleDateString() : 'None'}
				</div>
			</div>
		);
	},
};

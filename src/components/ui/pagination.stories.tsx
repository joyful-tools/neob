import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Pagination } from './pagination';

import type { Meta } from '@storybook/react-vite';

const meta = {
	title: 'Navigation/Pagination',
	component: Pagination,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;

export const DefaultCompound = {
	name: 'Default',
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [page, setPage] = React.useState(1);
		const [perPage, setPerPage] = React.useState(25);
		const totalCount = 325;

		return (
			<div className="w-full max-w-3xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination
					page={page}
					setPage={(nextPage) => {
						setPage(nextPage);
						action('pagination-page-change')(nextPage);
					}}
					perPage={perPage}
					totalCount={totalCount}
				>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.PageSize
						value={perPage}
						onChange={(nextPerPage) => {
							setPerPage(nextPerPage);
							action('pagination-page-size-change')(nextPerPage);
						}}
					/>
					<Pagination.Controls />
				</Pagination>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /next page/i }));
		await expect(canvasElement).toHaveTextContent(/26-50/);
		await expect(canvasElement).toHaveTextContent(/325/);
	}),
};

export const SimpleControls = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [page, setPage] = React.useState(1);
		const perPage = 10;
		const totalCount = 50;

		return (
			<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination
					page={page}
					setPage={(nextPage) => {
						setPage(nextPage);
						action('pagination-simple-page-change')(nextPage);
					}}
					perPage={perPage}
					totalCount={totalCount}
				>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.Controls controls="simple" />
				</Pagination>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /next page/i }));
		await expect(canvasElement).toHaveTextContent(/11-20/);
		await expect(canvasElement).toHaveTextContent(/50/);
	}),
};

export const DropdownSelector = {
	name: 'Dropdown Page Selector',
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [page, setPage] = React.useState(1);
		const perPage = 10;
		const totalCount = 80;

		return (
			<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination
					page={page}
					setPage={(nextPage) => {
						setPage(nextPage);
						action('pagination-dropdown-page-change')(nextPage);
					}}
					perPage={perPage}
					totalCount={totalCount}
				>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.Controls pageSelector="dropdown" />
				</Pagination>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /next page/i }));
		await expect(canvasElement).toHaveTextContent(/11-20/);
		await expect(canvasElement).toHaveTextContent(/80/);
	}),
};

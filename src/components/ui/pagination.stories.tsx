import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Pagination } from './pagination';

import type { Meta } from '@storybook/react-vite';

type PaginationStoryProperties = {
	initialPage: number;
	initialPerPage: number;
	totalCount: number;
	controls?: 'full' | 'simple';
	pageSelector?: 'input' | 'dropdown';
};

const meta = {
	title: 'Navigation/Pagination',
	component: Pagination,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;

export const DefaultCompound: { [key: string]: unknown } & import('@storybook/react-vite').StoryObj<PaginationStoryProperties> = {
	name: 'Default',
	args: {
		initialPage: 1,
		initialPerPage: 25,
		totalCount: 325,
		controls: 'full',
		pageSelector: 'input',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => {
		const [page, setPage] = React.useState(args.initialPage);
		const [perPage, setPerPage] = React.useState(args.initialPerPage);

		return (
			<div className="w-full max-w-3xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination
					page={page}
					setPage={(nextPage) => {
						setPage(nextPage);
						action('pagination-page-change')(nextPage);
					}}
					perPage={perPage}
					totalCount={args.totalCount}
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
					<Pagination.Controls controls={args.controls} pageSelector={args.pageSelector} />
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

export const SimpleControls: { [key: string]: unknown } & import('@storybook/react-vite').StoryObj<PaginationStoryProperties> = {
	args: {
		initialPage: 1,
		initialPerPage: 10,
		totalCount: 50,
		controls: 'simple',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => {
		const [page, setPage] = React.useState(args.initialPage);

		return (
			<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination
					page={page}
					setPage={(nextPage) => {
						setPage(nextPage);
						action('pagination-simple-page-change')(nextPage);
					}}
					perPage={args.initialPerPage}
					totalCount={args.totalCount}
				>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.Controls controls={args.controls} />
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

export const DropdownSelector: { [key: string]: unknown } & import('@storybook/react-vite').StoryObj<PaginationStoryProperties> = {
	name: 'Dropdown Page Selector',
	args: {
		initialPage: 1,
		initialPerPage: 10,
		totalCount: 80,
		controls: 'full',
		pageSelector: 'dropdown',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => {
		const [page, setPage] = React.useState(args.initialPage);

		return (
			<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination
					page={page}
					setPage={(nextPage) => {
						setPage(nextPage);
						action('pagination-dropdown-page-change')(nextPage);
					}}
					perPage={args.initialPerPage}
					totalCount={args.totalCount}
				>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.Controls controls={args.controls} pageSelector={args.pageSelector} />
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

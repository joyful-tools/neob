import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

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

/**
 * Pagination is a paginator navigation strip.
 *
 * ### Usage
 * ```tsx
 * import { Pagination } from '@timowilhelm/neob';
 *
 * <Pagination
 *   currentPage={page}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={setPage}
 * />
 * ```
 */
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
		const [page, setPage] = useState(args.initialPage);
		const [perPage, setPerPage] = useState(args.initialPerPage);

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
		const [page, setPage] = useState(args.initialPage);

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
		const [page, setPage] = useState(args.initialPage);

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

export const InputClampingAndPageSize: { [key: string]: unknown } & import('@storybook/react-vite').StoryObj<PaginationStoryProperties> = {
	args: {
		initialPage: 2,
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
		const [page, setPage] = useState(args.initialPage);
		const [perPage, setPerPage] = useState(args.initialPerPage);

		return (
			<div className="w-full max-w-3xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination
					page={page}
					setPage={(nextPage) => {
						setPage(nextPage);
						action('pagination-input-clamp-page-change')(nextPage);
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
							action('pagination-input-clamp-page-size-change')(nextPerPage);
						}}
					/>
					<Pagination.Controls controls={args.controls} pageSelector={args.pageSelector} />
				</Pagination>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const pageInput = canvas.getByRole('spinbutton', { name: 'Page number' });

		await userEvent.clear(pageInput);
		await userEvent.type(pageInput, '99');
		await userEvent.keyboard('{Enter}');
		await waitFor(() => {
			expect(canvasElement).toHaveTextContent(/301-325/);
			expect(pageInput).toHaveValue(13);
		});

		await userEvent.clear(pageInput);
		await userEvent.tab();
		await waitFor(() => {
			expect(canvasElement).toHaveTextContent(/1-25/);
			expect(pageInput).toHaveValue(1);
		});

		await userEvent.click(canvas.getByRole('combobox', { name: 'Page size' }));
		const body = within(document.body);
		await userEvent.click(await body.findByRole('option', { name: '100' }));
		await waitFor(() => {
			expect(canvasElement).toHaveTextContent(/1-100/);
		});
	}),
};

export const DropdownSelectionAndLabels: { [key: string]: unknown } & import('@storybook/react-vite').StoryObj<PaginationStoryProperties> =
	{
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
			const [page, setPage] = useState(args.initialPage);

			return (
				<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
					<Pagination
						page={page}
						setPage={(nextPage) => {
							setPage(nextPage);
							action('pagination-dropdown-selection-page-change')(nextPage);
						}}
						perPage={args.initialPerPage}
						totalCount={args.totalCount}
						labels={{
							navigation: 'Results pages',
							firstPage: 'Jump to first page',
							previousPage: 'Go to previous page',
							nextPage: 'Go to next page',
							lastPage: 'Jump to last page',
							pageNumber: 'Choose page',
							pageSize: 'Results per page',
						}}
					>
						<Pagination.Info />
						<Pagination.Separator />
						<Pagination.Controls controls={args.controls} pageSelector={args.pageSelector} />
					</Pagination>
				</div>
			);
		},
		play: guardPlay(async ({ canvasElement }) => {
			const canvas = within(canvasElement);
			const body = within(document.body);
			await expect(canvas.getByRole('navigation', { name: 'Results pages' })).toBeInTheDocument();
			await expect(canvas.getByRole('button', { name: 'Jump to first page' })).toBeDisabled();

			await userEvent.click(canvas.getByRole('combobox', { name: 'Choose page' }));
			await userEvent.click(await body.findByRole('option', { name: '6' }));
			await waitFor(() => {
				expect(canvasElement).toHaveTextContent(/51-60/);
				const trigger = canvas.getByRole('combobox', { name: 'Choose page' });
				expect(trigger).toHaveTextContent('6');
			});

			await userEvent.click(canvas.getByRole('button', { name: 'Jump to last page' }));
			await waitFor(() => {
				expect(canvasElement).toHaveTextContent(/71-80/);
				expect(canvas.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
			});
		}),
	};

export const SinglePageDisabledState: { [key: string]: unknown } & import('@storybook/react-vite').StoryObj<PaginationStoryProperties> = {
	args: {
		initialPage: 1,
		initialPerPage: 25,
		totalCount: 10,
		controls: 'full',
		pageSelector: 'input',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => {
		const [page, setPage] = useState(args.initialPage);

		return (
			<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination page={page} setPage={setPage} perPage={args.initialPerPage} totalCount={args.totalCount}>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.Controls controls={args.controls} pageSelector={args.pageSelector} />
				</Pagination>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'First page' })).toBeDisabled();
		await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		await expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled();
		await expect(canvas.getByRole('button', { name: 'Last page' })).toBeDisabled();
		await expect(canvas.getByRole('spinbutton', { name: 'Page number' })).toBeDisabled();
		await expect(canvasElement).toHaveTextContent(/1-10/);
	}),
};

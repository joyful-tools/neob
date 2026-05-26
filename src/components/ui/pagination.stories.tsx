import * as React from 'react';

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
	render: () => {
		const [page, setPage] = React.useState(1);
		const [perPage, setPerPage] = React.useState(25);
		const totalCount = 325;

		return (
			<div className="w-full max-w-3xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination page={page} setPage={setPage} perPage={perPage} totalCount={totalCount}>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.PageSize value={perPage} onChange={setPerPage} />
					<Pagination.Controls />
				</Pagination>
			</div>
		);
	},
};

export const SimpleControls = {
	render: () => {
		const [page, setPage] = React.useState(1);
		const perPage = 10;
		const totalCount = 50;

		return (
			<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination page={page} setPage={setPage} perPage={perPage} totalCount={totalCount}>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.Controls controls="simple" />
				</Pagination>
			</div>
		);
	},
};

export const DropdownSelector = {
	name: 'Dropdown Page Selector',
	render: () => {
		const [page, setPage] = React.useState(1);
		const perPage = 10;
		const totalCount = 80;

		return (
			<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
				<Pagination page={page} setPage={setPage} perPage={perPage} totalCount={totalCount}>
					<Pagination.Info />
					<Pagination.Separator />
					<Pagination.Controls pageSelector="dropdown" />
				</Pagination>
			</div>
		);
	},
};

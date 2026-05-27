import { CaretDoubleLeft, CaretDoubleRight, CaretLeft, CaretRight } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Button } from './button';
import { Select } from './select';

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100, 250] as const;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// ============================================================================
// i18n Labels
// ============================================================================

export interface PaginationLabels {
	/** Aria label for the navigation landmark. @default "Pagination" */
	navigation?: string;
	/** Aria label for the first page button. @default "First page" */
	firstPage?: string;
	/** Aria label for the previous page button. @default "Previous page" */
	previousPage?: string;
	/** Aria label for the next page button. @default "Next page" */
	nextPage?: string;
	/** Aria label for the last page button. @default "Last page" */
	lastPage?: string;
	/** Aria label for the page number input/select. @default "Page number" */
	pageNumber?: string;
	/** Aria label for the page size select. @default "Page size" */
	pageSize?: string;
}

const DEFAULT_LABELS: Required<PaginationLabels> = {
	navigation: 'Pagination',
	firstPage: 'First page',
	previousPage: 'Previous page',
	nextPage: 'Next page',
	lastPage: 'Last page',
	pageNumber: 'Page number',
	pageSize: 'Page size',
};

// ============================================================================
// Pagination Context
// ============================================================================

interface PaginationContextValue {
	page: number;
	perPage?: number;
	totalCount?: number;
	maxPage: number;
	pageShowingRange: string;
	setPage: (page: number) => void;
	editingPage: number;
	setEditingPage: (page: number) => void;
	labels: Required<PaginationLabels>;
}

const PaginationContext = React.createContext<PaginationContextValue | null>(null);

function usePaginationContext() {
	const context = React.useContext(PaginationContext);
	if (!context) {
		throw new Error('Pagination compound components must be used within a Pagination component');
	}
	return context;
}

// ============================================================================
// Pagination.Info
// ============================================================================

export interface PaginationInfoProps {
	/** Custom render function for the info text */
	readonly children?: (props: { page: number; perPage?: number; totalCount?: number; pageShowingRange: string }) => React.ReactNode;
	/** Additional CSS classes */
	readonly className?: string;
}

function PaginationInfo({ children, className }: PaginationInfoProps) {
	const { page, perPage, totalCount, pageShowingRange } = usePaginationContext();

	const content = children ? (
		children({ page, perPage, totalCount, pageShowingRange })
	) : totalCount && totalCount > 0 ? (
		<>
			Showing <span className="font-bold text-black tabular-nums dark:text-white">{pageShowingRange}</span> of{' '}
			<span className="font-bold text-black tabular-nums dark:text-white">{totalCount}</span>
		</>
	) : null;

	return (
		<div data-slot="pagination-info" className={cn('text-sm font-semibold text-muted-foreground select-none', className)}>
			{content}
		</div>
	);
}

PaginationInfo.displayName = 'Pagination.Info';

// ============================================================================
// Pagination.PageSize
// ============================================================================

export interface PaginationPageSizeProps {
	/** Current page size value */
	readonly value: number;
	/** Callback when page size changes */
	readonly onChange: (size: number) => void;
	/** Available page size options */
	readonly options?: readonly number[];
	/**
	 * Label text shown before the selector.
	 * @default "Per page:"
	 */
	readonly label?: React.ReactNode;
	/** Additional CSS classes */
	readonly className?: string;
}

function PaginationPageSize({
	value,
	onChange,
	options = DEFAULT_PAGE_SIZE_OPTIONS,
	label = 'Per page:',
	className,
}: PaginationPageSizeProps) {
	const { labels } = usePaginationContext();

	return (
		<div data-slot="pagination-page-size" className={cn('flex items-center gap-2 select-none', className)}>
			{label && <span className="text-sm font-bold text-black dark:text-white">{label}</span>}
			<div className="p-1">
				<Select
					value={String(value)}
					onValueChange={(v) => onChange(Number(v))}
					aria-label={labels.pageSize}
					size="sm"
					className="h-8 border-2 border-black px-2.5 text-xs font-black shadow-brutal-sm hover:translate-y-0 hover:shadow-brutal-sm dark:border-black [&_svg]:size-3"
					containerClassName="p-1"
				>
					{options.map((size) => (
						<Select.Option key={size} value={String(size)} className="px-2 py-1 text-xs">
							{size}
						</Select.Option>
					))}
				</Select>
			</div>
		</div>
	);
}

PaginationPageSize.displayName = 'Pagination.PageSize';

// ============================================================================
// Pagination.Controls
// ============================================================================

export interface PaginationControlsProps {
	/** Controls variant: 'full' or 'simple'. @default "full" */
	readonly controls?: 'full' | 'simple';
	/**
	 * How the page number selector is rendered in "full" controls mode.
	 * - `"input"` (default): A text input where users type a page number.
	 * - `"dropdown"`: A dropdown select with all page numbers as options.
	 *
	 * **Note:** `"dropdown"` renders an option for every page, so it is best
	 * suited for small page counts. For large datasets (hundreds of pages or
	 * more) prefer `"input"` to avoid rendering performance overhead.
	 */
	readonly pageSelector?: 'input' | 'dropdown';
	/** Additional CSS classes */
	readonly className?: string;
}

function PaginationControls({ controls = 'full', pageSelector = 'input', className }: PaginationControlsProps) {
	const { page, maxPage, setPage, editingPage, setEditingPage, labels } = usePaginationContext();

	const isFirstPageDisabled = page <= 1;
	const isLastPageDisabled = page === maxPage;

	return (
		<div data-slot="pagination-controls" className={cn('flex items-center gap-2', className)}>
			<nav aria-label={labels.navigation} className="flex items-center select-none">
				{controls === 'full' && (
					<Button
						type="button"
						variant="subtle"
						size="sm"
						aria-label={labels.firstPage}
						disabled={isFirstPageDisabled}
						onClick={() => {
							setPage(1);
							setEditingPage(1);
						}}
						className="size-8 rounded-r-none p-0 shadow-brutal-sm focus:z-10 disabled:opacity-100 disabled:shadow-[0_2px_0_0_#000]"
					>
						<CaretDoubleLeft className={cn('size-4', isFirstPageDisabled && 'opacity-30')} />
					</Button>
				)}
				<Button
					type="button"
					variant="subtle"
					size="sm"
					aria-label={labels.previousPage}
					disabled={isFirstPageDisabled}
					onClick={() => {
						const previousPage = Math.max(page - 1, 1);
						setPage(previousPage);
						setEditingPage(previousPage);
					}}
					className={cn(
						'size-8 p-0 shadow-brutal-sm focus:z-10 disabled:opacity-100 disabled:shadow-[0_2px_0_0_#000]',
						controls === 'full' ? 'ml-[-2px] rounded-none' : 'rounded-r-none',
					)}
				>
					<CaretLeft className={cn('size-4', isFirstPageDisabled && 'opacity-30')} />
				</Button>
				{controls === 'full' &&
					(pageSelector === 'dropdown' ? (
						<div className="ml-[-2px] w-[72px] focus-within:z-10">
							<Select
								value={String(page)}
								onValueChange={(value) => {
									const num = Number(value);
									setPage(num);
									setEditingPage(num);
								}}
								disabled={maxPage <= 1}
								aria-label={labels.pageNumber}
								size="sm"
								className={cn(
									'h-8 justify-center gap-1 rounded-none border-2 border-black px-2 text-xs font-black shadow-brutal-sm hover:translate-y-0 hover:shadow-brutal-sm active:translate-y-0 active:shadow-brutal-sm disabled:opacity-100 disabled:shadow-[0_2px_0_0_#000] dark:border-black dark:bg-zinc dark:text-white [&_svg]:size-3',
									maxPage <= 1 && '[&_svg]:opacity-30 [&>span]:opacity-30',
								)}
								containerClassName="w-[72px] min-w-0 border-2 p-1 dark:border-black"
							>
								{Array.from({ length: maxPage }, (_, i) => i + 1).map((p) => (
									<Select.Option key={p} value={String(p)} className="px-2 py-1 text-xs">
										{p}
									</Select.Option>
								))}
							</Select>
						</div>
					) : (
						<div className="ml-[-2px] flex h-8 items-center justify-center rounded-none border-2 border-black bg-white shadow-brutal-sm select-none focus-within:z-10 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 dark:border-black dark:bg-zinc dark:focus-within:ring-white">
							<input
								type="number"
								disabled={maxPage <= 1}
								className={cn(
									'h-full w-12 border-0 bg-transparent p-0 text-center text-xs font-bold text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-hidden focus-visible:outline-hidden disabled:cursor-not-allowed',
									maxPage <= 1 && 'opacity-30',
								)}
								aria-label={labels.pageNumber}
								value={editingPage === 0 ? '' : editingPage}
								onChange={(e) => {
									const val = e.target.value;
									if (val === '') {
										setEditingPage(0);
									} else {
										const num = Number.parseInt(val, 10);
										if (!Number.isNaN(num)) {
											setEditingPage(num);
										}
									}
								}}
								onBlur={() => {
									const clamped = clamp(editingPage || 1, 1, maxPage);
									setPage(clamped);
									setEditingPage(clamped);
								}}
								onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
									if (e.key === 'Enter') {
										const clamped = clamp(editingPage || 1, 1, maxPage);
										setPage(clamped);
										setEditingPage(clamped);
									}
								}}
								autoComplete="off"
								data-1p-ignore
								data-lpignore="true"
								data-form-type="other"
							/>
						</div>
					))}
				<Button
					type="button"
					variant="subtle"
					size="sm"
					aria-label={labels.nextPage}
					disabled={isLastPageDisabled}
					onClick={() => {
						const nextPage = Math.min(page + 1, maxPage);
						setPage(nextPage);
						setEditingPage(nextPage);
					}}
					className={cn(
						'ml-[-2px] size-8 p-0 shadow-brutal-sm focus:z-10 disabled:opacity-100 disabled:shadow-[0_2px_0_0_#000]',
						controls === 'full' ? 'rounded-none' : 'rounded-l-none',
					)}
				>
					<CaretRight className={cn('size-4', isLastPageDisabled && 'opacity-30')} />
				</Button>
				{controls === 'full' && (
					<Button
						type="button"
						variant="subtle"
						size="sm"
						aria-label={labels.lastPage}
						disabled={isLastPageDisabled}
						onClick={() => {
							setPage(maxPage);
							setEditingPage(maxPage);
						}}
						className="ml-[-2px] size-8 rounded-l-none p-0 shadow-brutal-sm focus:z-10 disabled:opacity-100 disabled:shadow-[0_2px_0_0_#000]"
					>
						<CaretDoubleRight className={cn('size-4', isLastPageDisabled && 'opacity-30')} />
					</Button>
				)}
			</nav>
		</div>
	);
}

PaginationControls.displayName = 'Pagination.Controls';

// ============================================================================
// Pagination.Separator
// ============================================================================

export interface PaginationSeparatorProps {
	/** Additional CSS classes */
	readonly className?: string;
}

function PaginationSeparator({ className }: PaginationSeparatorProps) {
	return <div data-slot="pagination-separator" className={cn('mx-2 h-6 border-l-2 border-black/15 dark:border-white/15', className)} />;
}

PaginationSeparator.displayName = 'Pagination.Separator';

// ============================================================================
// Pagination Root
// ============================================================================

export interface PaginationProps {
	/** Callback fired when the current page changes. */
	readonly setPage: (page: number) => void;
	/**
	 * Current page number (1-indexed).
	 * @default 1
	 */
	readonly page?: number;
	/** Number of items displayed per page. */
	readonly perPage?: number;
	/** Total number of items across all pages. */
	readonly totalCount?: number;
	/** Additional CSS classes for the container */
	readonly className?: string;
	/**
	 * Labels for internationalization of aria-labels. All labels have English defaults.
	 */
	readonly labels?: PaginationLabels;
	/**
	 * Compound component children for custom layouts.
	 * Use Pagination.Info, Pagination.PageSize, Pagination.Controls, and Pagination.Separator.
	 */
	readonly children: React.ReactNode;
}

function PaginationRoot(props: PaginationProps) {
	const { page = 1, perPage, totalCount, setPage, children, className, labels: labelsProp } = props;

	const [prevPage, setPrevPage] = React.useState(page);
	const [editingPage, setEditingPage] = React.useState(page);

	if (page !== prevPage) {
		setPrevPage(page);
		setEditingPage(page);
	}

	const labels = React.useMemo<Required<PaginationLabels>>(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);

	const pageShowingRange = React.useMemo(() => {
		let lower = page * (perPage ?? 1) - (perPage ?? 0) + 1;
		let upper = Math.min(page * (perPage ?? 0), totalCount ?? 0);

		if (Number.isNaN(lower)) lower = 0;
		if (Number.isNaN(upper)) upper = 0;

		return `${lower}-${upper}`;
	}, [page, perPage, totalCount]);

	const maxPage = React.useMemo(() => {
		return Math.ceil((totalCount ?? 1) / (perPage ?? 1));
	}, [totalCount, perPage]);

	const contextValue: PaginationContextValue = {
		page,
		perPage,
		totalCount,
		maxPage,
		pageShowingRange,
		setPage,
		editingPage,
		setEditingPage,
		labels,
	};

	return (
		<PaginationContext.Provider value={contextValue}>
			<div data-slot="pagination" className={cn('flex w-full items-center gap-4 py-2 select-none', className)}>
				{children}
			</div>
		</PaginationContext.Provider>
	);
}

PaginationRoot.displayName = 'Pagination';

export const Pagination = Object.assign(PaginationRoot, {
	Info: PaginationInfo,
	PageSize: PaginationPageSize,
	Controls: PaginationControls,
	Separator: PaginationSeparator,
});

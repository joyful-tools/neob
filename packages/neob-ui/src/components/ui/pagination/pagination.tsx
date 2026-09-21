import { CaretDoubleLeftIcon, CaretDoubleRightIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { createContext, KeyboardEvent, ReactNode, useContext, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useOptimisticAction } from '@/hooks/use-optimistic-action';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100, 250] as const;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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
	isPending: boolean;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext() {
	const context = useContext(PaginationContext);
	if (!context) {
		throw new Error('Pagination compound components must be used within a Pagination component');
	}
	return context;
}

export interface PaginationInfoProps {
	/** Custom render function for the info text */
	readonly children?: (props: { page: number; perPage?: number; totalCount?: number; pageShowingRange: string }) => ReactNode;
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
		<div data-slot="pagination-info" className={cn('grow text-sm font-semibold text-muted-foreground select-none', className)}>
			{content}
		</div>
	);
}

PaginationInfo.displayName = 'Pagination.Info';

export interface PaginationPageSizeProps {
	/** Current page size value */
	readonly value?: number;
	/** Initial page size in uncontrolled mode. */
	readonly defaultValue?: number;
	/** Action run when page size changes. */
	readonly action?: Action<[size: number]>;
	/** Available page size options */
	readonly options?: readonly number[];
	/**
	 * Label text shown before the selector.
	 * @default "Per page:"
	 */
	readonly label?: ReactNode;
	/** Additional CSS classes */
	readonly className?: string;
}

function PaginationPageSize({
	value,
	defaultValue,
	action,
	options = DEFAULT_PAGE_SIZE_OPTIONS,
	label = 'Per page:',
	className,
}: PaginationPageSizeProps) {
	const { labels } = usePaginationContext();
	const fallbackValue = defaultValue ?? options[0] ?? 25;
	const { optimisticValue, runAction, isPending } = useOptimisticAction({ value, defaultValue: fallbackValue, action });

	return (
		<div
			data-slot="pagination-page-size"
			className={cn('flex items-center gap-2 select-none', className)}
			aria-busy={isPending || undefined}
			data-pending={isPending ? '' : undefined}
		>
			{label && <span className="text-sm font-bold text-black dark:text-white">{label}</span>}
			<div className="p-1">
				<Select
					value={String(optimisticValue)}
					action={(nextValue) => runAction(Number(nextValue))}
					aria-label={labels.pageSize}
					size="sm"
					className="h-8 border-2 border-edge px-2.5 text-xs font-black dark:border-edge [&_svg]:size-3"
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
			<nav aria-label={labels.navigation} className={cn('flex items-center select-none', maxPage <= 1 && 'opacity-disabled')}>
				{controls === 'full' && (
					<Button
						type="button"
						variant="default"
						size="sm"
						aria-label={labels.firstPage}
						disabled={isFirstPageDisabled}
						action={() => {
							setPage(1);
							setEditingPage(1);
						}}
						className={cn(
							'size-8 rounded-r-none p-0 [--button-disabled-shadow-color:var(--shadow-cel-color-default)] focus:z-10 disabled:opacity-100',
							maxPage <= 1 && 'opacity-100!',
						)}
					>
						<CaretDoubleLeftIcon className={cn('size-4', isFirstPageDisabled && 'opacity-30')} />
					</Button>
				)}
				<Button
					type="button"
					variant="default"
					size="sm"
					aria-label={labels.previousPage}
					disabled={isFirstPageDisabled}
					action={() => {
						const previousPage = Math.max(page - 1, 1);
						setPage(previousPage);
						setEditingPage(previousPage);
					}}
					className={cn(
						'size-8 p-0 [--button-disabled-shadow-color:var(--shadow-cel-color-default)] focus:z-10 disabled:opacity-100',
						controls === 'full' ? '-ml-0.5 rounded-none' : 'rounded-r-none',
						maxPage <= 1 && 'opacity-100!',
					)}
				>
					<CaretLeftIcon className={cn('size-4', isFirstPageDisabled && 'opacity-30')} />
				</Button>
				{controls === 'full' &&
					(pageSelector === 'dropdown' ? (
						<div className="-ml-0.5 w-18 shadow-cel-sm focus-within:z-10">
							<Select
								value={String(page)}
								action={(value) => {
									const num = Number(value);
									setPage(num);
									setEditingPage(num);
								}}
								disabled={maxPage <= 1}
								aria-label={labels.pageNumber}
								size="sm"
								className={cn('rounded-none', maxPage <= 1 && 'opacity-100! [&_svg]:opacity-30 [&>span]:opacity-30')}
							>
								{Array.from({ length: maxPage }, (_, i) => i + 1).map((p) => (
									<Select.Option key={p} value={String(p)} className="px-2 py-1 text-xs">
										{p}
									</Select.Option>
								))}
							</Select>
						</div>
					) : (
						<div className="neo-focus-ring-focus isolate -ml-0.5 flex h-8 items-center justify-center rounded-none border-2 border-edge bg-white shadow-cel-sm outline-hidden transition-all duration-(--duration-control) ease-spring select-none focus-within:z-10 dark:border-edge dark:bg-zinc">
							<input
								type="number"
								data-neo-number-input=""
								disabled={maxPage <= 1}
								className={cn(
									'h-full w-12 border-0 bg-transparent p-0 text-center text-xs font-bold text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed',
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
								onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
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
					variant="default"
					size="sm"
					aria-label={labels.nextPage}
					disabled={isLastPageDisabled}
					action={() => {
						const nextPage = Math.min(page + 1, maxPage);
						setPage(nextPage);
						setEditingPage(nextPage);
					}}
					className={cn(
						'-ml-0.5 size-8 p-0 [--button-disabled-shadow-color:var(--shadow-cel-color-default)] focus:z-10 disabled:opacity-100',
						controls === 'full' ? 'rounded-none' : 'rounded-l-none',
						maxPage <= 1 && 'opacity-100!',
					)}
				>
					<CaretRightIcon className={cn('size-4', isLastPageDisabled && 'opacity-30')} />
				</Button>
				{controls === 'full' && (
					<Button
						type="button"
						variant="default"
						size="sm"
						aria-label={labels.lastPage}
						disabled={isLastPageDisabled}
						action={() => {
							setPage(maxPage);
							setEditingPage(maxPage);
						}}
						className={cn(
							'-ml-0.5 size-8 rounded-l-none p-0 [--button-disabled-shadow-color:var(--shadow-cel-color-default)] focus:z-10 disabled:opacity-100',
							maxPage <= 1 && 'opacity-100!',
						)}
					>
						<CaretDoubleRightIcon className={cn('size-4', isLastPageDisabled && 'opacity-30')} />
					</Button>
				)}
			</nav>
		</div>
	);
}

PaginationControls.displayName = 'Pagination.Controls';

export interface PaginationSeparatorProps {
	/** Additional CSS classes */
	readonly className?: string;
}

function PaginationSeparator({ className }: PaginationSeparatorProps) {
	return <div data-slot="pagination-separator" className={cn('mx-2 h-6 border-l-2 border-edge/15', className)} />;
}

PaginationSeparator.displayName = 'Pagination.Separator';

export interface PaginationProps {
	/** Action run when the current page changes. */
	readonly action?: Action<[page: number]>;
	/**
	 * Current page number (1-indexed).
	 * @default 1
	 */
	readonly page?: number;
	/** Initial page in uncontrolled mode. */
	readonly defaultPage?: number;
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
	readonly children: ReactNode;
}

function PaginationRoot(props: PaginationProps) {
	const { page, defaultPage = 1, perPage, totalCount, action, children, className, labels: labelsProp } = props;
	const { optimisticValue = defaultPage, runAction, isPending } = useOptimisticAction({ value: page, defaultValue: defaultPage, action });

	const [prevPage, setPrevPage] = useState(optimisticValue);
	const [editingPage, setEditingPage] = useState(optimisticValue);

	if (optimisticValue !== prevPage) {
		setPrevPage(optimisticValue);
		setEditingPage(optimisticValue);
	}

	const labels = useMemo<Required<PaginationLabels>>(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);

	const pageShowingRange = useMemo(() => {
		let lower = optimisticValue * (perPage ?? 1) - (perPage ?? 0) + 1;
		let upper = Math.min(optimisticValue * (perPage ?? 0), totalCount ?? 0);

		if (Number.isNaN(lower)) lower = 0;
		if (Number.isNaN(upper)) upper = 0;

		return `${lower}-${upper}`;
	}, [optimisticValue, perPage, totalCount]);

	const maxPage = useMemo(() => {
		return Math.max(1, Math.ceil((totalCount ?? 1) / (perPage ?? 1)));
	}, [totalCount, perPage]);

	const contextValue: PaginationContextValue = {
		page: optimisticValue,
		perPage,
		totalCount,
		maxPage,
		pageShowingRange,
		setPage: runAction,
		editingPage,
		setEditingPage,
		labels,
		isPending,
	};

	return (
		<PaginationContext.Provider value={contextValue}>
			<div
				data-slot="pagination"
				className={cn('flex w-full items-center gap-4 py-2 select-none', className)}
				aria-busy={isPending || undefined}
				data-pending={isPending ? '' : undefined}
			>
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

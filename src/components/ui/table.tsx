import * as React from 'react';

import { cn } from '@/lib/utilities';

export interface TableProperties extends React.HTMLAttributes<HTMLTableElement> {
	readonly ref?: React.Ref<HTMLTableElement>;
}

export interface TableHeaderProperties extends React.HTMLAttributes<HTMLTableSectionElement> {
	readonly ref?: React.Ref<HTMLTableSectionElement>;
}

export interface TableBodyProperties extends React.HTMLAttributes<HTMLTableSectionElement> {
	readonly ref?: React.Ref<HTMLTableSectionElement>;
}

export interface TableFooterProperties extends React.HTMLAttributes<HTMLTableSectionElement> {
	readonly ref?: React.Ref<HTMLTableSectionElement>;
}

export interface TableRowProperties extends React.HTMLAttributes<HTMLTableRowElement> {
	readonly ref?: React.Ref<HTMLTableRowElement>;
}

export interface TableHeadProperties extends React.ThHTMLAttributes<HTMLTableCellElement> {
	readonly ref?: React.Ref<HTMLTableCellElement>;
}

export interface TableCellProperties extends React.TdHTMLAttributes<HTMLTableCellElement> {
	readonly ref?: React.Ref<HTMLTableCellElement>;
}

/**
 * Responsive scroll container for Tables.
 */
export function TableContainer({ className, children, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className="w-full overflow-auto rounded-lg border-2 border-black shadow-brutal-sm">
			<table className={cn('w-full border-collapse text-sm', className)} {...properties}>
				{children}
			</table>
		</div>
	);
}
TableContainer.displayName = 'TableContainer';

/**
 * Table header container (thead).
 * Uses high-contrast black/white fill.
 */
export function TableHeader({ className, ref, ...properties }: TableHeaderProperties) {
	return (
		<thead
			ref={ref}
			className={cn('border-b-2 border-black bg-black text-white dark:bg-zinc dark:text-white', className)}
			{...properties}
		/>
	);
}
TableHeader.displayName = 'TableHeader';

/**
 * Table body section (tbody).
 */
export function TableBody({ className, ref, ...properties }: TableBodyProperties) {
	return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...properties} />;
}
TableBody.displayName = 'TableBody';

/**
 * Table footer section (tfoot).
 */
export function TableFooter({ className, ref, ...properties }: TableFooterProperties) {
	return <tfoot ref={ref} className={cn('border-t-2 border-black bg-muted/50 font-bold', className)} {...properties} />;
}
TableFooter.displayName = 'TableFooter';

/**
 * Table row (tr).
 */
export function TableRow({ className, ref, ...properties }: TableRowProperties) {
	return (
		<tr
			ref={ref}
			className={cn(`border-b-2 border-black/10 transition-colors hover:bg-muted/50 dark:border-white/10`, className)}
			{...properties}
		/>
	);
}
TableRow.displayName = 'TableRow';

/**
 * Header cell (th).
 */
export function TableHead({ className, ref, ...properties }: TableHeadProperties) {
	return (
		<th
			ref={ref}
			className={cn('h-10 px-4 text-left align-middle font-display text-sm font-black tracking-wider uppercase', className)}
			{...properties}
		/>
	);
}
TableHead.displayName = 'TableHead';

/**
 * Standard cell (td).
 */
export function TableCell({ className, ref, ...properties }: TableCellProperties) {
	return <td ref={ref} className={cn('p-4 align-middle font-medium text-black dark:text-white', className)} {...properties} />;
}
TableCell.displayName = 'TableCell';

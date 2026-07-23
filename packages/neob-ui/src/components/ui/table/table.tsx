import { HTMLAttributes, Ref, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import { cn } from '@/lib/utilities';

export interface TableProperties extends HTMLAttributes<HTMLTableElement> {
	readonly ref?: Ref<HTMLTableElement>;
}

export interface TableHeaderProperties extends HTMLAttributes<HTMLTableSectionElement> {
	readonly ref?: Ref<HTMLTableSectionElement>;
}

export interface TableBodyProperties extends HTMLAttributes<HTMLTableSectionElement> {
	readonly ref?: Ref<HTMLTableSectionElement>;
}

export interface TableFooterProperties extends HTMLAttributes<HTMLTableSectionElement> {
	readonly ref?: Ref<HTMLTableSectionElement>;
}

export interface TableRowProperties extends HTMLAttributes<HTMLTableRowElement> {
	readonly ref?: Ref<HTMLTableRowElement>;
}

export interface TableHeadProperties extends ThHTMLAttributes<HTMLTableCellElement> {
	readonly ref?: Ref<HTMLTableCellElement>;
}

export interface TableCellProperties extends TdHTMLAttributes<HTMLTableCellElement> {
	readonly ref?: Ref<HTMLTableCellElement>;
}

/**
 * Responsive scroll container for Tables.
 */
function TableRoot({ className, children, ...properties }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className="w-full overflow-auto rounded-lg border-2 border-edge shadow-cel-sm">
			<table className={cn('w-full border-collapse text-sm', className)} {...properties}>
				{children}
			</table>
		</div>
	);
}
TableRoot.displayName = 'Table';

/**
 * Table header container (thead).
 * Uses high-contrast black/white fill.
 */
function TableHeader({ className, ref, ...properties }: TableHeaderProperties) {
	return (
		<thead ref={ref} className={cn('border-b-2 border-edge bg-black text-white dark:bg-zinc dark:text-white', className)} {...properties} />
	);
}
TableHeader.displayName = 'Table.Header';

/**
 * Table body section (tbody).
 */
function TableBody({ className, ref, ...properties }: TableBodyProperties) {
	return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...properties} />;
}
TableBody.displayName = 'Table.Body';

/**
 * Table footer section (tfoot).
 */
function TableFooter({ className, ref, ...properties }: TableFooterProperties) {
	return <tfoot ref={ref} className={cn('border-t-2 border-edge bg-muted/50 font-bold', className)} {...properties} />;
}
TableFooter.displayName = 'Table.Footer';

/**
 * Table row (tr).
 */
function TableRow({ className, ref, ...properties }: TableRowProperties) {
	return <tr ref={ref} className={cn(`border-b-2 border-edge/10`, className)} {...properties} />;
}
TableRow.displayName = 'Table.Row';

/**
 * Header cell (th).
 */
function TableHead({ className, ref, ...properties }: TableHeadProperties) {
	return (
		<th
			ref={ref}
			className={cn('h-10 px-4 text-left align-middle font-display text-sm font-black tracking-wider text-white uppercase', className)}
			{...properties}
		/>
	);
}
TableHead.displayName = 'Table.Head';

/**
 * Standard cell (td).
 */
function TableCell({ className, ref, ...properties }: TableCellProperties) {
	return <td ref={ref} className={cn('p-4 align-middle font-medium text-black dark:text-white', className)} {...properties} />;
}
TableCell.displayName = 'Table.Cell';

export const Table = Object.assign(TableRoot, {
	Header: TableHeader,
	Body: TableBody,
	Footer: TableFooter,
	Row: TableRow,
	Head: TableHead,
	Cell: TableCell,
});

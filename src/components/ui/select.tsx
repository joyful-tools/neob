import { Select as BaseSelect } from '@base-ui/react/select';
import { CaretDown, Check } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

// ============================================================================
// Components
// ============================================================================

/**
 * Root Select component.
 * Wraps Base UI Select.Root.
 */
export const Select = BaseSelect.Root;

/**
 * SelectTrigger component.
 * The button that opens the select list.
 */
export function SelectTrigger({
	className,
	ref,
	children,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger> & {
	readonly ref?: React.Ref<HTMLButtonElement>;
}) {
	return (
		<BaseSelect.Trigger
			ref={ref}
			className={cn(
				`flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border-2 border-black bg-white px-4 py-2 text-base font-bold text-black shadow-brutal-sm transition-all duration-300 ease-spring select-none hover:-translate-y-0.5 hover:shadow-brutal focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-hidden active:translate-y-0 active:shadow-brutal-inset disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm aria-expanded:translate-y-0 aria-expanded:hover:translate-y-0 dark:bg-zinc dark:text-white dark:focus-visible:ring-white`,
				className,
			)}
			{...properties}
		>
			<span className="truncate">{children}</span>
			<BaseSelect.Icon className="ml-2 shrink-0 opacity-70">
				<CaretDown className="size-4 stroke-3" />
			</BaseSelect.Icon>
		</BaseSelect.Trigger>
	);
}
SelectTrigger.displayName = 'SelectTrigger';

/**
 * SelectValue component.
 * Displays the selected value or placeholder text.
 */
export const SelectValue = BaseSelect.Value;

/**
 * SelectContent component.
 * The popup overlay panel listing all options.
 */
export function SelectContent({
	className,
	ref,
	children,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<BaseSelect.Portal>
			<BaseSelect.Positioner side="bottom" align="start" sideOffset={6} className="z-50">
				<BaseSelect.Popup
					ref={ref}
					className={cn(
						`w-(--select-trigger-width) min-w-[200px] animate-popover-in overflow-hidden rounded-xl border-4 border-black bg-white p-2 text-black shadow-brutal data-closed:animate-popover-out dark:bg-zinc dark:text-white`,
						className,
					)}
					{...properties}
				>
					<div className="flex max-h-60 flex-col gap-1 overflow-y-auto pr-1">{children}</div>
				</BaseSelect.Popup>
			</BaseSelect.Positioner>
		</BaseSelect.Portal>
	);
}
SelectContent.displayName = 'SelectContent';

/**
 * SelectItem component.
 * An individual option inside the SelectContent popup.
 */
export function SelectItem({
	className,
	ref,
	children,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseSelect.Item> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<BaseSelect.Item
			ref={ref}
			className={cn(
				`relative flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-sm font-bold text-black outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-black data-highlighted:text-white dark:text-white dark:data-highlighted:bg-white dark:data-highlighted:text-black`,
				className,
			)}
			{...properties}
		>
			<BaseSelect.ItemText className="truncate">{children}</BaseSelect.ItemText>
			<BaseSelect.ItemIndicator className="ml-2 shrink-0">
				<Check className="size-4 stroke-3" />
			</BaseSelect.ItemIndicator>
		</BaseSelect.Item>
	);
}
SelectItem.displayName = 'SelectItem';

/**
 * SelectGroup component.
 * Standard container to partition select items.
 */
export const SelectGroup = BaseSelect.Group;

/**
 * SelectGroupLabel component.
 * The title/header shown above select groups.
 */
export function SelectGroupLabel({
	className,
	ref,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<BaseSelect.GroupLabel
			ref={ref}
			className={cn(`px-3 py-1.5 text-xs font-black tracking-wider text-muted-foreground uppercase`, className)}
			{...properties}
		/>
	);
}
SelectGroupLabel.displayName = 'SelectGroupLabel';

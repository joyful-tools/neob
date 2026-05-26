import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CaretDown, Check } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

// ============================================================================
// Components
// ============================================================================

/**
 * Root Combobox component.
 * Wraps Base UI Combobox.Root.
 */
export const Combobox = BaseCombobox.Root;

/**
 * ComboboxInput component.
 * The search/text input that controls the combobox filtering.
 */
export function ComboboxInput({
	className,
	ref,
	placeholder,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.Input> & {
	readonly ref?: React.Ref<HTMLInputElement>;
}) {
	return (
		<div className="relative w-full">
			<BaseCombobox.Input
				ref={ref}
				placeholder={placeholder}
				className={cn(
					`flex h-10 w-full rounded-lg border-2 border-black bg-white px-4 py-2 pr-10 text-base font-medium shadow-brutal-inset transition-all duration-300 ease-spring placeholder:text-muted-foreground focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc dark:text-white dark:focus:ring-white`,
					className,
				)}
				{...properties}
			/>
			<BaseCombobox.Trigger className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent text-black/60 hover:text-black focus:outline-hidden dark:text-white/60 dark:hover:text-white">
				<CaretDown className="size-4 stroke-3" />
			</BaseCombobox.Trigger>
		</div>
	);
}
ComboboxInput.displayName = 'ComboboxInput';

/**
 * ComboboxContent component.
 * The popup panel displaying filtered options.
 */
export function ComboboxContent({
	className,
	ref,
	children,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<BaseCombobox.Portal>
			<BaseCombobox.Positioner side="bottom" align="start" sideOffset={6} className="z-50">
				<BaseCombobox.Popup
					ref={ref}
					className={cn(
						`w-(--combobox-trigger-width) min-w-[200px] animate-popover-in overflow-hidden rounded-xl border-4 border-black bg-white p-2 text-black shadow-brutal data-closed:animate-popover-out dark:bg-zinc dark:text-white`,
						className,
					)}
					{...properties}
				>
					<div className="flex max-h-60 flex-col gap-1 overflow-y-auto pr-1">{children}</div>
				</BaseCombobox.Popup>
			</BaseCombobox.Positioner>
		</BaseCombobox.Portal>
	);
}
ComboboxContent.displayName = 'ComboboxContent';

/**
 * ComboboxItem component.
 * An individual option inside the ComboboxContent list.
 */
export function ComboboxItem({
	className,
	ref,
	children,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.Item> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<BaseCombobox.Item
			ref={ref}
			className={cn(
				`relative flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-sm font-bold text-black outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-black data-highlighted:text-white dark:text-white dark:data-highlighted:bg-white dark:data-highlighted:text-black`,
				className,
			)}
			{...properties}
		>
			<BaseCombobox.ItemText className="truncate">{children}</BaseCombobox.ItemText>
			<BaseCombobox.ItemIndicator className="ml-2 shrink-0">
				<Check className="size-4 stroke-3" />
			</BaseCombobox.ItemIndicator>
		</BaseCombobox.Item>
	);
}
ComboboxItem.displayName = 'ComboboxItem';

/**
 * ComboboxGroup component.
 * Layout container for grouping items.
 */
export const ComboboxGroup = BaseCombobox.Group;

/**
 * ComboboxGroupLabel component.
 * Group header label inside the combobox panel.
 */
export function ComboboxGroupLabel({
	className,
	ref,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<BaseCombobox.GroupLabel
			ref={ref}
			className={cn(`px-3 py-1.5 text-xs font-black tracking-wider text-muted-foreground uppercase`, className)}
			{...properties}
		/>
	);
}
ComboboxGroupLabel.displayName = 'ComboboxGroupLabel';

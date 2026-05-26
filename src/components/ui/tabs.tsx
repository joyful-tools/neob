import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import * as React from 'react';

import { cn } from '@/lib/utilities';

// ============================================================================
// Components
// ============================================================================

/**
 * Root Tabs container.
 * Wraps Base UI Tabs.Root.
 */
export const Tabs = BaseTabs.Root;

/**
 * TabsList component.
 * Flex container for holding TabsTriggers (tab headers).
 */
export function TabsList({
	className,
	ref,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseTabs.List> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<BaseTabs.List ref={ref} className={cn(`flex w-full gap-2 overflow-x-auto overflow-y-hidden pt-1.5 pb-1`, className)} {...properties} />
	);
}
TabsList.displayName = 'TabsList';

/**
 * TabsTrigger component.
 * Individual tab header button.
 */
export function TabsTrigger({
	className,
	ref,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseTabs.Tab> & {
	readonly ref?: React.Ref<HTMLButtonElement>;
}) {
	return (
		<BaseTabs.Tab
			ref={ref}
			className={cn(
				`relative z-0 inline-flex cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-muted px-4 py-2 text-sm font-bold whitespace-nowrap text-muted-foreground outline-hidden transition-all duration-75 ease-linear select-none hover:bg-muted/80 hover:text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 aria-selected:z-10 aria-selected:-translate-y-0.5 aria-selected:bg-white aria-selected:text-black aria-selected:shadow-brutal-sm dark:bg-zinc/40 dark:text-white/60 dark:hover:bg-zinc/80 dark:hover:text-white dark:focus-visible:ring-white dark:aria-selected:bg-zinc dark:aria-selected:text-white dark:aria-selected:shadow-brutal-sm`,
				className,
			)}
			{...properties}
		/>
	);
}
TabsTrigger.displayName = 'TabsTrigger';

/**
 * TabsContent component.
 * Content panel corresponding to an individual tab value.
 */
export function TabsContent({
	className,
	ref,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseTabs.Panel> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<BaseTabs.Panel
			ref={ref}
			className={cn(
				`outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:focus-visible:ring-white`,
				className,
			)}
			{...properties}
		/>
	);
}
TabsContent.displayName = 'TabsContent';

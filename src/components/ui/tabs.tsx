import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import * as React from 'react';

import { cn } from '@/lib/utilities';

// ============================================================================
// Context & Types
// ============================================================================

export type TabsVariant = 'segmented' | 'subtle';

const TabsVariantContext = React.createContext<TabsVariant>('segmented');

// ============================================================================
// Components
// ============================================================================

/**
 * Root Tabs container.
 * Wraps Base UI Tabs.Root.
 */
const TabsRoot = BaseTabs.Root;

/**
 * TabsList component.
 * Flex container for holding TabsTriggers (tab headers).
 */
function TabsList({
	className,
	variant = 'segmented',
	ref,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseTabs.List> & {
	readonly variant?: TabsVariant;
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	const listClasses =
		variant === 'segmented'
			? 'relative inline-flex items-center gap-1 border-2 border-black bg-muted/40 p-1 rounded-xl dark:border-black dark:bg-zinc/30'
			: 'relative flex w-full space-x-1 border-b-2 border-zinc-200 pb-px dark:border-zinc-800';

	const indicatorClasses =
		variant === 'segmented'
			? 'absolute rounded-md border-2 border-black bg-white shadow-cel-sm dark:bg-zinc dark:border-black z-0'
			: 'absolute border-b-4 border-black dark:border-white bg-transparent z-10';

	const indicatorStyle = {
		left: 'var(--active-tab-left)',
		width: 'var(--active-tab-width)',
		top: 'var(--active-tab-top)',
		height: 'var(--active-tab-height)',
		transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1.03)', // Significantly reduced spring overshoot (3% max bounce)
	};

	return (
		<TabsVariantContext.Provider value={variant}>
			<BaseTabs.List ref={ref} className={cn(listClasses, className)} {...properties}>
				{properties.children}
				<BaseTabs.Indicator className={indicatorClasses} style={indicatorStyle} />
			</BaseTabs.List>
		</TabsVariantContext.Provider>
	);
}
TabsList.displayName = 'Tabs.List';

/**
 * TabsTrigger component.
 * Individual tab header button.
 */
function TabsTrigger({
	className,
	ref,
	children,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseTabs.Tab> & {
	readonly ref?: React.Ref<HTMLButtonElement>;
}) {
	const variant = React.useContext(TabsVariantContext);

	return (
		<BaseTabs.Tab
			ref={ref}
			{...properties}
			render={(buttonProps, tabState) => {
				const isSelected = tabState.active;

				const triggerClasses =
					variant === 'segmented'
						? cn(
								`neo-focus-ring relative z-10 inline-flex cursor-pointer items-center justify-center rounded-lg border-2 border-transparent px-3.5 py-1.5 font-sans text-sm font-bold text-muted-foreground outline-hidden transition-colors duration-150 select-none hover:text-black dark:hover:text-white`,
								isSelected && 'text-black dark:text-white',
								className,
							)
						: cn(
								`neo-focus-ring relative z-10 mb-[-3px] inline-flex cursor-pointer items-center justify-center border-2 border-transparent px-4 py-2 font-sans text-sm font-semibold text-muted-foreground outline-hidden transition-colors duration-150 select-none hover:text-black dark:hover:text-white`,
								isSelected && 'z-20 text-black dark:text-white',
								className,
							);

				return (
					<button {...buttonProps} className={triggerClasses}>
						<span className="relative z-20">{children}</span>
					</button>
				);
			}}
		/>
	);
}
TabsTrigger.displayName = 'Tabs.Trigger';

/**
 * TabsContent component.
 * Content panel corresponding to an individual tab value.
 */
function TabsContent({
	className,
	ref,
	...properties
}: React.ComponentPropsWithoutRef<typeof BaseTabs.Panel> & {
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return <BaseTabs.Panel ref={ref} className={cn(`neo-focus-ring outline-hidden`, className)} {...properties} />;
}
TabsContent.displayName = 'Tabs.Content';

export const Tabs = Object.assign(TabsRoot, {
	List: TabsList,
	Trigger: TabsTrigger,
	Content: TabsContent,
});

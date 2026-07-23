import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { AnimatePresence, motion } from 'motion/react';
import { ComponentPropsWithoutRef, createContext, Ref, useContext, useId } from 'react';

import { cn } from '@/lib/utilities';

export type TabsVariant = 'segmented' | 'subtle';

const TabsVariantContext = createContext<TabsVariant>('segmented');
const TabsIdContext = createContext<string>('');

/**
 * Root Tabs container.
 * Wraps Base UI Tabs.Root.
 */
function TabsRoot({ children, ...properties }: ComponentPropsWithoutRef<typeof BaseTabs.Root>) {
	const id = useId();

	return (
		<TabsIdContext.Provider value={id}>
			<BaseTabs.Root {...properties}>{children}</BaseTabs.Root>
		</TabsIdContext.Provider>
	);
}

/**
 * TabsList component.
 * Flex container for holding TabsTriggers (tab headers).
 */
function TabsList({
	className,
	variant = 'segmented',
	ref,
	...properties
}: ComponentPropsWithoutRef<typeof BaseTabs.List> & {
	readonly variant?: TabsVariant;
	readonly ref?: Ref<HTMLDivElement>;
}) {
	const listClasses =
		variant === 'segmented'
			? 'relative inline-flex items-center gap-1 border-2 border-edge bg-muted/40 p-2 rounded-xl dark:border-edge dark:bg-zinc/30'
			: 'relative flex w-full space-x-1 border-b-2 border-zinc-200 pb-px dark:border-zinc-800';

	return (
		<TabsVariantContext.Provider value={variant}>
			<BaseTabs.List ref={ref} className={cn(listClasses, className)} {...properties}>
				{properties.children}
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
}: ComponentPropsWithoutRef<typeof BaseTabs.Tab> & {
	readonly ref?: Ref<HTMLButtonElement>;
}) {
	const variant = useContext(TabsVariantContext);
	const rootId = useContext(TabsIdContext);

	const indicatorClasses =
		variant === 'segmented'
			? 'absolute inset-0 rounded-lg border-2 border-edge bg-white dark:bg-zinc dark:border-edge z-0'
			: 'absolute left-0 right-0 bottom-0 h-[4px] bg-black dark:bg-white z-10';

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
								`neo-focus-ring relative z-10 -mb-0.75 inline-flex cursor-pointer items-center justify-center border-2 border-transparent px-4 py-2 font-sans text-sm font-semibold text-muted-foreground outline-hidden transition-colors duration-150 select-none hover:text-black dark:hover:text-white`,
								isSelected && 'z-20 text-black dark:text-white',
								className,
							);

				return (
					<button {...buttonProps} className={triggerClasses}>
						<AnimatePresence initial={false}>
							{isSelected && (
								<motion.div
									layoutId={`${rootId}-active-indicator`}
									layout="x"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
									className={indicatorClasses}
								/>
							)}
						</AnimatePresence>
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
}: ComponentPropsWithoutRef<typeof BaseTabs.Panel> & {
	readonly ref?: Ref<HTMLDivElement>;
}) {
	return <BaseTabs.Panel ref={ref} className={cn(`neo-focus-ring outline-hidden`, className)} {...properties} />;
}
TabsContent.displayName = 'Tabs.Content';

export const Tabs = Object.assign(TabsRoot, {
	List: TabsList,
	Trigger: TabsTrigger,
	Content: TabsContent,
});

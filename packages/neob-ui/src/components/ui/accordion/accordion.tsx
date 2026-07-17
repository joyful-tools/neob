import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { CaretDownIcon } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { ComponentPropsWithoutRef, Ref } from 'react';

import { cn } from '@/lib/utilities';

/**
 * Root Accordion container.
 * Wraps Base UI Accordion.Root.
 */
function AccordionRoot({
	className,
	ref,
	multiple = false,
	...properties
}: ComponentPropsWithoutRef<typeof BaseAccordion.Root> & {
	readonly ref?: Ref<HTMLDivElement>;
}) {
	return <BaseAccordion.Root ref={ref} multiple={multiple} className={cn('w-full', className)} {...properties} />;
}
AccordionRoot.displayName = 'Accordion';

/**
 * AccordionItem component.
 * Single expandable item with lightweight border separation.
 */
function AccordionItem({
	className,
	ref,
	...properties
}: ComponentPropsWithoutRef<typeof BaseAccordion.Item> & {
	readonly ref?: Ref<HTMLDivElement>;
}) {
	return <BaseAccordion.Item ref={ref} className={cn('border-t border-border first:border-t-0', className)} {...properties} />;
}
AccordionItem.displayName = 'Accordion.Item';

/**
 * AccordionTrigger component.
 * Header button that toggles panel visibility.
 */
function AccordionTrigger({
	className,
	children,
	ref,
	...properties
}: ComponentPropsWithoutRef<typeof BaseAccordion.Trigger> & {
	readonly ref?: Ref<HTMLButtonElement>;
}) {
	return (
		<BaseAccordion.Header className="flex">
			<BaseAccordion.Trigger
				ref={ref}
				{...properties}
				render={(triggerProps, triggerState) => {
					const isOpen = triggerState.open;
					return (
						<button
							{...triggerProps}
							type="button"
							className={cn(
								'neo-focus-ring isolate flex w-full cursor-pointer items-center justify-between py-2 text-left outline-hidden transition-colors select-none',
								className,
							)}
						>
							<span className="font-sans font-bold text-black dark:text-white">{children}</span>
							<CaretDownIcon
								className={cn(
									'ml-2 size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
									isOpen && 'rotate-180',
								)}
							/>
						</button>
					);
				}}
			/>
		</BaseAccordion.Header>
	);
}
AccordionTrigger.displayName = 'Accordion.Trigger';

/**
 * AccordionContent component.
 * Container wrapper for the accordion item panel with smooth spring height animation.
 */
function AccordionContent({
	className,
	children,
	ref,
	...properties
}: ComponentPropsWithoutRef<typeof BaseAccordion.Panel> & {
	readonly ref?: Ref<HTMLDivElement>;
}) {
	return (
		<BaseAccordion.Panel
			ref={ref}
			keepMounted
			{...properties}
			render={(panelProps, panelState) => {
				const isOpen = panelState.open;
				// Omit conflicting props to allow framer-motion animations and gestures
				const {
					hidden: _hidden,
					onAnimationStart: _onAnimationStart,
					onAnimationEnd: _onAnimationEnd,
					onDragStart: _onDragStart,
					onDragEnd: _onDragEnd,
					onDrag: _onDrag,
					...restProps
				} = panelProps;
				return (
					<motion.div
						{...restProps}
						initial={false}
						animate={isOpen ? 'open' : 'closed'}
						variants={{
							open: {
								height: 'auto',
								transition: { type: 'spring', stiffness: 800, damping: 57 },
							},
							closed: {
								height: 0,
								transition: { type: 'spring', stiffness: 800, damping: 57 },
							},
						}}
						className="overflow-hidden"
					>
						<motion.div
							variants={{
								open: { y: 0, scale: 1, opacity: [0, 1] },
								closed: { y: 33, scale: 0.99, opacity: 0 },
							}}
							transition={{
								y: { type: 'spring', stiffness: 800, damping: 57 },
								scale: { duration: 0.33, ease: 'easeInOut' },
								opacity: { duration: 0.33, ease: 'easeInOut' },
							}}
							className={cn('origin-top pb-1 text-sm/relaxed', className)}
						>
							{children}
						</motion.div>
					</motion.div>
				);
			}}
		/>
	);
}
AccordionContent.displayName = 'Accordion.Content';

export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Content: AccordionContent,
});

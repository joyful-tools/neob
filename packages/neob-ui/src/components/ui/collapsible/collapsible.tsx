import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { type ReactNode } from 'react';

import { cn } from '@/lib/utilities';

export interface CollapsibleProperties {
	readonly open: boolean;
	readonly children: ReactNode;
	readonly className?: string;
}

const springDefault: Transition = {
	type: 'spring',
	stiffness: 400,
	damping: 28,
};

export function Collapsible({ open, children, className }: CollapsibleProperties) {
	return (
		<BaseCollapsible.Root open={open}>
			<AnimatePresence initial={false}>
				{open && (
					<BaseCollapsible.Panel
						render={
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={springDefault}
								className={cn('overflow-hidden', className)}
							/>
						}
					>
						{children}
					</BaseCollapsible.Panel>
				)}
			</AnimatePresence>
		</BaseCollapsible.Root>
	);
}
Collapsible.displayName = 'Collapsible';

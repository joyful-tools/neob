import { AnimatePresence, motion, type Transition } from 'motion/react';
import { type ReactNode } from 'react';

import { cn } from '@/lib/utilities';

export interface CollapsibleProperties {
	open: boolean;
	children: ReactNode;
	className?: string;
}

const springDefault: Transition = {
	type: 'spring',
	stiffness: 400,
	damping: 28,
};

export function Collapsible({ open, children, className }: CollapsibleProperties) {
	return (
		<AnimatePresence initial={false}>
			{open && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: 'auto', opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={springDefault}
					className={cn('overflow-hidden', className)}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

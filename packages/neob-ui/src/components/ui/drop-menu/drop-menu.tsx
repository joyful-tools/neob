import { Menu } from '@base-ui/react/menu';
import { motion, type Transition, type Variants } from 'motion/react';
import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
	type ReactElement,
	type Dispatch,
	type SetStateAction,
	type MouseEvent,
} from 'react';

import { Button } from '@/components/ui/button';
import { useQueuedAction } from '@/hooks/use-queued-action';
import { afterAction } from '@/lib/actions';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';

interface DropMenuProperties {
	readonly trigger: (props: {
		readonly isOpen: boolean;
		readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
		readonly anchor: (node: HTMLButtonElement | null) => void;
	}) => ReactElement;
	readonly children: ReactNode;
	readonly className?: string;
}

export interface DropMenuItemProperties {
	readonly children: ReactNode;
	readonly action?: Action;
	readonly className?: string;
}

// React Context to communicate close handler safely without manual element cloning or assertions
const DropMenuContext = createContext<{
	readonly runItemAction: (action: Action) => Promise<void>;
	readonly isPending: boolean;
} | null>(null);

const containerVariants: Variants = {
	hidden: {
		opacity: 0,
	},
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.06,
		},
	},
	exit: {
		opacity: 0,
		transition: {
			staggerChildren: 0.03,
			staggerDirection: -1,
			when: 'afterChildren',
		},
	},
};

const springTransition: Transition = {
	type: 'spring',
	stiffness: 260,
	damping: 18,
};

const linearTransition: Transition = {
	duration: 0.15,
	ease: 'linear',
};

const itemVariants: Variants = {
	hidden: { scale: 0.6, opacity: 0, y: 0 },
	show: {
		scale: 1,
		opacity: 1,
		transition: {
			...springTransition,
		},
	},
	exit: {
		scale: 0.6,
		y: -20,
		opacity: 0,
		transition: {
			...linearTransition,
		},
	},
};

/**
 * DropMenu provides an animated dropdown with staggered item animations.
 * Built on Base UI Menu with custom staggered scale animations and centered overlay behavior.
 */
export function DropMenu({ trigger, children, className }: DropMenuProperties) {
	const [isOpen, setIsOpen] = useState(false);
	const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);

	const closeMenu = useCallback(() => {
		setIsOpen(false);
		anchorElement?.focus();
	}, [anchorElement]);
	const { runAction: runItemAction, isPending } = useQueuedAction((action: Action) => afterAction(action(), closeMenu));

	const triggerNode = trigger({
		isOpen,
		setIsOpen,
		anchor: setAnchorElement,
	});

	return (
		<DropMenuContext.Provider value={{ runItemAction, isPending }}>
			<Menu.Root open={isOpen} onOpenChange={setIsOpen}>
				<Menu.Trigger render={triggerNode} />

				<Menu.Portal keepMounted>
					<Menu.Positioner align="center" side="bottom" sideOffset={8} anchor={anchorElement} className="z-100">
						<Menu.Popup
							role="menu"
							render={<motion.div variants={containerVariants} initial="hidden" animate={isOpen ? 'show' : 'exit'} />}
							className={cn('min-w-44 outline-hidden select-none data-closed:animate-[popover-out_350ms_ease-in_forwards]', className)}
							aria-busy={isPending || undefined}
							data-pending={isPending ? '' : undefined}
						>
							<div className="flex flex-col gap-2 p-2">{children}</div>
						</Menu.Popup>
					</Menu.Positioner>
				</Menu.Portal>
			</Menu.Root>
		</DropMenuContext.Provider>
	);
}
DropMenu.displayName = 'DropMenu';

/**
 * DropMenuItem animates dynamically using Framer Motion variants and integrates with Base UI Menu.Item.
 */
export function DropMenuItem({ children, action, className }: DropMenuItemProperties) {
	const context = useContext(DropMenuContext);

	const handleItemClick = (event: MouseEvent) => {
		event.preventDefault();
		if (!action || !context) return;
		void context.runItemAction(action).catch(() => {});
	};

	return (
		<motion.div variants={itemVariants} className="w-full">
			<Menu.Item
				nativeButton
				disabled={context?.isPending}
				render={
					<Button
						type="button"
						variant="default"
						size="sm"
						className={cn(
							'w-full bg-white px-4 py-2 font-mono font-black text-black hover:bg-yellow focus-visible:bg-yellow dark:bg-zinc dark:text-white dark:hover:text-black dark:focus-visible:text-black',
							className,
						)}
					/>
				}
				onClick={handleItemClick}
			>
				{children}
			</Menu.Item>
		</motion.div>
	);
}
DropMenuItem.displayName = 'DropMenuItem';

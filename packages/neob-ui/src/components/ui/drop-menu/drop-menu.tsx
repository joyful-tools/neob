import { Menu } from '@base-ui/react/menu';
import { AnimatePresence, motion, type Transition, type Variants } from 'motion/react';
import {
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
	type ReactNode,
	type ReactElement,
	type Dispatch,
	type SetStateAction,
} from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utilities';

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
	readonly onClick?: () => void;
	readonly className?: string;
}

// React Context to communicate close handler safely without manual element cloning or assertions
const DropMenuContext = createContext<{
	readonly close: () => void;
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
 * Uses capture-phase event delegation to gate triggerSetIsOpen during click/key interactions,
 * preventing the user's manual setIsOpen from racing with Base UI's internal toggle.
 */
export function DropMenu({ trigger, children, className }: DropMenuProperties) {
	const [isOpen, setIsOpen] = useState(false);
	const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);

	const isClickingRef = useRef(false);
	const isKeyingRef = useRef(false);

	const closeMenu = useCallback(() => {
		setIsOpen(false);
		anchorElement?.focus();
	}, [anchorElement]);

	const triggerSetIsOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
		if (isClickingRef.current || isKeyingRef.current) {
			return;
		}
		setIsOpen(value);
	}, []);

	// eslint-disable-next-line react-hooks/refs -- triggerSetIsOpen closes over refs but is a callback prop, never invoked during render
	const triggerNode = trigger({
		isOpen,
		setIsOpen: triggerSetIsOpen,
		anchor: setAnchorElement,
	});

	// Capture-phase handlers fire before the trigger's bubble-phase onClick/onKeyDown,
	// so the guard flag is always set before triggerSetIsOpen can be called.
	// queueMicrotask resets after all synchronous event processing completes.
	const handleClickCapture = useCallback(() => {
		isClickingRef.current = true;
		queueMicrotask(() => {
			isClickingRef.current = false;
		});
	}, []);

	const handleKeyDownCapture = useCallback(() => {
		isKeyingRef.current = true;
		queueMicrotask(() => {
			isKeyingRef.current = false;
		});
	}, []);

	return (
		<DropMenuContext.Provider value={{ close: closeMenu }}>
			<Menu.Root open={isOpen} onOpenChange={setIsOpen}>
				{/* display:contents keeps this wrapper invisible to layout while preserving capture-phase event propagation */}
				<div style={{ display: 'contents' }} onClickCapture={handleClickCapture} onKeyDownCapture={handleKeyDownCapture}>
					<Menu.Trigger render={triggerNode} />
				</div>

				<AnimatePresence>
					{isOpen && (
						<Menu.Portal keepMounted>
							<Menu.Positioner align="center" side="bottom" sideOffset={8} anchor={anchorElement} className="z-100">
								<Menu.Popup
									role="menu"
									render={<motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" />}
									className={cn('min-w-44 outline-hidden select-none data-closed:animate-[popover-out_350ms_ease-in_forwards]', className)}
								>
									<div className="flex flex-col gap-2 p-2">{children}</div>
								</Menu.Popup>
							</Menu.Positioner>
						</Menu.Portal>
					)}
				</AnimatePresence>
			</Menu.Root>
		</DropMenuContext.Provider>
	);
}
DropMenu.displayName = 'DropMenu';

/**
 * DropMenuItem animates dynamically using Framer Motion variants and integrates with Base UI Menu.Item.
 */
export function DropMenuItem({ children, onClick, className }: DropMenuItemProperties) {
	const context = useContext(DropMenuContext);

	const handleItemClick = () => {
		onClick?.();
		context?.close();
	};

	return (
		<motion.div variants={itemVariants} className="w-full">
			<Menu.Item
				render={
					<Button
						type="button"
						variant="default"
						size="sm"
						className={cn(
							'w-full cursor-pointer rounded-lg border-2 border-black bg-white px-4 py-2 font-mono text-sm font-black text-black shadow-cel-sm outline-hidden transition-all',
							'hover:-translate-y-0.5 hover:bg-yellow focus-visible:bg-yellow focus-visible:outline-hidden active:translate-y-0.5 active:shadow-none dark:bg-zinc dark:text-white dark:hover:text-black',
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

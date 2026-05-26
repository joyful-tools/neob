import { Menu } from '@base-ui/react/menu';
import { motion, type Transition } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

const DropdownMenuContext = React.createContext<{
	readonly anchorRef: React.RefCallback<HTMLDivElement | null>;
	readonly anchorElement: HTMLDivElement | null;
} | null>(null);

interface DropdownMenuProperties {
	readonly children?: React.ReactNode;
	readonly open?: boolean;
	readonly defaultOpen?: boolean;
	readonly onOpenChange?: (open: boolean) => void;
	readonly modal?: boolean;
}

function DropdownMenu({ children, ...properties }: DropdownMenuProperties) {
	const [anchorElement, setAnchorElement] = React.useState<HTMLDivElement | null>(null);

	const contextValue = React.useMemo(() => {
		return {
			anchorRef: setAnchorElement,
			anchorElement,
		};
	}, [anchorElement]);

	return (
		<DropdownMenuContext.Provider value={contextValue}>
			<Menu.Root {...properties}>{children}</Menu.Root>
		</DropdownMenuContext.Provider>
	);
}
DropdownMenu.displayName = 'DropdownMenu';

const DropdownMenuGroup = Menu.Group;

interface DropdownMenuTriggerProperties {
	readonly children: React.ReactElement<Record<string, unknown>>;
	readonly disabled?: boolean;
}

function DropdownMenuTrigger({ children, disabled }: DropdownMenuTriggerProperties) {
	const context = React.useContext(DropdownMenuContext);
	return (
		<div ref={context?.anchorRef} className="inline-flex">
			<Menu.Trigger disabled={disabled} render={children} />
		</div>
	);
}
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

interface DropdownMenuContentProperties extends React.HTMLAttributes<HTMLDivElement> {
	readonly align?: 'start' | 'center' | 'end';
	readonly sideOffset?: number;
	readonly ref?: React.Ref<HTMLDivElement>;
}

const springSnappy: Transition = {
	type: 'spring',
	stiffness: 500,
	damping: 30,
};

const popoverVariants = {
	hidden: { opacity: 0, scale: 0.95, y: -4 },
	visible: { opacity: 1, scale: 1, y: 0 },
	exit: { opacity: 0, scale: 0.95, y: -4 },
};

function DropdownMenuContent({ children, className, align = 'end', sideOffset, ref, ...properties }: DropdownMenuContentProperties) {
	const context = React.useContext(DropdownMenuContext);

	const resolvedSideOffset = React.useCallback(
		(data: { side: string }) => {
			if (sideOffset !== undefined) {
				return sideOffset;
			}
			return data.side === 'top' ? 12 : 6;
		},
		[sideOffset],
	);

	return (
		<Menu.Portal>
			<Menu.Positioner align={align} sideOffset={resolvedSideOffset} className="z-100" anchor={context?.anchorElement}>
				<Menu.Popup
					ref={ref}
					render={<motion.div variants={popoverVariants} initial="hidden" animate="visible" exit="exit" transition={springSnappy} />}
					className={cn(
						`min-w-40 overflow-hidden rounded-xl border-2 border-black bg-white p-1.5 shadow-sm outline-hidden select-none dark:bg-zinc dark:text-white`,
						className,
					)}
					{...properties}
				>
					{children}
				</Menu.Popup>
			</Menu.Positioner>
		</Menu.Portal>
	);
}
DropdownMenuContent.displayName = 'DropdownMenuContent';

interface DropdownMenuItemProperties {
	readonly children: React.ReactNode;
	readonly className?: string;
	readonly disabled?: boolean;
	readonly onSelect?: () => void;
	readonly ref?: React.Ref<HTMLDivElement>;
	readonly 'aria-current'?: 'true' | undefined;
}

function DropdownMenuItem({ children, className, disabled, onSelect, ref, 'aria-current': ariaCurrent }: DropdownMenuItemProperties) {
	return (
		<Menu.Item
			ref={ref}
			disabled={disabled}
			onClick={onSelect}
			aria-current={ariaCurrent}
			className={cn(
				`relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-black outline-hidden transition-all select-none focus:bg-orange focus:text-black data-disabled:pointer-events-none data-disabled:opacity-50 dark:text-white`,
				className,
			)}
		>
			{children}
		</Menu.Item>
	);
}
DropdownMenuItem.displayName = 'DropdownMenuItem';

function DropdownMenuSeparator({ className }: { readonly className?: string }) {
	return <Menu.Separator className={cn('my-1.5 h-0.5 bg-black', className)} />;
}
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

function DropdownMenuLabel({ children, className }: { readonly children: React.ReactNode; readonly className?: string }) {
	return <div className={cn('px-3 py-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase', className)}>{children}</div>;
}
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
};
export type { DropdownMenuTriggerProperties, DropdownMenuContentProperties, DropdownMenuItemProperties };

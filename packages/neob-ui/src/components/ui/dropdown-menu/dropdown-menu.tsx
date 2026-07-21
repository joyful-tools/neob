import { Menu } from '@base-ui/react/menu';
import {
	createContext,
	HTMLAttributes,
	ReactElement,
	ReactNode,
	Ref,
	RefCallback,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

import { useTransformOrigin } from '@/hooks/use-transform-origin';
import { cn } from '@/lib/utilities';

const DropdownMenuContext = createContext<{
	readonly anchorRef: RefCallback<HTMLDivElement | null>;
	readonly anchorElement: HTMLDivElement | null;
} | null>(null);

interface DropdownMenuProperties {
	readonly children?: ReactNode;
	readonly open?: boolean;
	readonly defaultOpen?: boolean;
	readonly onOpenChange?: (open: boolean) => void;
	readonly modal?: boolean;
}

function DropdownMenuRoot({ children, ...properties }: DropdownMenuProperties) {
	const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);

	const contextValue = useMemo(() => {
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
DropdownMenuRoot.displayName = 'DropdownMenu';

const DropdownMenuGroup = Menu.Group;

interface DropdownMenuTriggerProperties {
	readonly children: ReactElement<Record<string, unknown>>;
	readonly disabled?: boolean;
}

function DropdownMenuTrigger({ children, disabled }: DropdownMenuTriggerProperties) {
	const context = useContext(DropdownMenuContext);
	return (
		<div ref={context?.anchorRef} className="inline-flex">
			<Menu.Trigger disabled={disabled} render={children} />
		</div>
	);
}
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

interface DropdownMenuContentProperties extends HTMLAttributes<HTMLDivElement> {
	readonly align?: 'start' | 'center' | 'end';
	readonly sideOffset?: number;
	readonly ref?: Ref<HTMLDivElement>;
}

function DropdownMenuContent({ children, className, align = 'end', sideOffset, ref, ...properties }: DropdownMenuContentProperties) {
	const context = useContext(DropdownMenuContext);
	const transformOriginRef = useTransformOrigin(context?.anchorElement || null, ref);

	const resolvedSideOffset = useCallback(
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
					ref={transformOriginRef}
					className={cn(
						`z-50 min-w-40 origin-(--transform-origin) rounded-xl border-2 border-black bg-popover p-1.5 text-popover-foreground shadow-md outline-hidden select-none`,
						`data-closed:animate-popover-out data-open:animate-popover-in`,
						`data-[side=bottom]:[--tw-enter-translate-y:-0.5rem] data-[side=left]:[--tw-enter-translate-x:0.5rem] data-[side=right]:[--tw-enter-translate-x:-0.5rem] data-[side=top]:[--tw-enter-translate-y:0.5rem]`,
						`dark:border-black dark:shadow-cel-md`,
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
	readonly children: ReactNode;
	readonly className?: string;
	readonly disabled?: boolean;
	readonly onSelect?: () => void;
	readonly ref?: Ref<HTMLDivElement>;
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
				`relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-black outline-hidden transition-all select-none focus:bg-orange focus:text-black data-disabled:pointer-events-none data-disabled:opacity-50 dark:text-white dark:focus:text-orange-light`,
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

function DropdownMenuLabel({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
	return <div className={cn('px-3 py-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase', className)}>{children}</div>;
}
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
	Trigger: DropdownMenuTrigger,
	Content: DropdownMenuContent,
	Group: DropdownMenuGroup,
	Item: DropdownMenuItem,
	Separator: DropdownMenuSeparator,
	Label: DropdownMenuLabel,
});

export type { DropdownMenuTriggerProperties, DropdownMenuContentProperties, DropdownMenuItemProperties };

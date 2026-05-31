import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { useTransformOrigin } from '../../hooks/use-transform-origin';

const POPOVER_CONTENT_CLASS_NAME = `
	z-50 w-72 origin-(--transform-origin) rounded-xl
	border-2 border-black bg-popover p-4 text-popover-foreground shadow-cel
	outline-none
	data-[side=bottom]:[--tw-enter-translate-y:-0.5rem]
	data-[side=left]:[--tw-enter-translate-x:0.5rem]
	data-[side=right]:[--tw-enter-translate-x:-0.5rem]
	data-[side=top]:[--tw-enter-translate-y:0.5rem]
	data-[closed]:animate-popover-out
	data-[open]:animate-popover-in
	dark:border-black dark:shadow-cel
`;

const PopoverContext = React.createContext<{
	readonly anchorRef: React.RefCallback<HTMLDivElement | null>;
	readonly anchorElement: HTMLDivElement | null;
} | null>(null);

interface PopoverContentProperties {
	readonly ref?: React.Ref<HTMLDivElement>;
	readonly className?: string;
	readonly children?: React.ReactNode;
	readonly align?: 'start' | 'center' | 'end';
	readonly sideOffset?: number;
	readonly side?: 'top' | 'bottom' | 'left' | 'right';
	readonly onOpenAutoFocus?: (event: Event) => void;
}

/** Popover root component. Wraps Base UI Popover primitive with a stable anchor context. */
function PopoverRoot({ children, ...properties }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
	const [anchorElement, setAnchorElement] = React.useState<HTMLDivElement | null>(null);

	const contextValue = React.useMemo(() => {
		return {
			anchorRef: setAnchorElement,
			anchorElement,
		};
	}, [anchorElement]);

	return (
		<PopoverContext.Provider value={contextValue}>
			<PopoverPrimitive.Root {...properties}>{children}</PopoverPrimitive.Root>
		</PopoverContext.Provider>
	);
}
PopoverRoot.displayName = 'Popover';

/** Anchor point for popover positioning. Decoupled from translating elements. */
function PopoverAnchor({
	children,
	className,
	ref,
	...properties
}: {
	readonly children?: React.ReactNode;
	readonly className?: string;
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	const context = React.useContext(PopoverContext);

	const handleRef = React.useCallback(
		(node: HTMLDivElement | null) => {
			if (context) {
				context.anchorRef(node);
			}
			if (ref) {
				if (typeof ref === 'function') {
					ref(node);
				} else {
					Object.assign(ref, { current: node });
				}
			}
		},
		[context, ref],
	);

	return (
		<div ref={handleRef} className={className} {...properties}>
			{children}
		</div>
	);
}
PopoverAnchor.displayName = 'Popover.Anchor';

/** Button that triggers the popover. Wrapped in a stable anchor context. */
function PopoverTrigger({ children, ...properties }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
	const context = React.useContext(PopoverContext);
	return (
		<div ref={context?.anchorRef} className="inline-flex">
			<PopoverPrimitive.Trigger {...properties}>{children}</PopoverPrimitive.Trigger>
		</div>
	);
}
PopoverTrigger.displayName = 'Popover.Trigger';

/** Popover content panel. Renders in a portal positioned against the stable anchor. */
function PopoverContent({
	className,
	align = 'center',
	sideOffset,
	side,
	ref,
	onOpenAutoFocus,
	children,
	...properties
}: PopoverContentProperties) {
	const context = React.useContext(PopoverContext);
	const transformOriginRef = useTransformOrigin(context?.anchorElement || null, ref);

	const resolvedSideOffset = React.useCallback(
		(data: { side: string }) => {
			if (sideOffset !== undefined) {
				return sideOffset;
			}
			return data.side === 'top' ? 10 : 4;
		},
		[sideOffset],
	);

	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner sideOffset={resolvedSideOffset} align={align} side={side} anchor={context?.anchorElement}>
				<PopoverPrimitive.Popup
					ref={transformOriginRef}
					className={cn(POPOVER_CONTENT_CLASS_NAME, className)}
					initialFocus={onOpenAutoFocus ? false : undefined}
					{...properties}
				>
					{children}
				</PopoverPrimitive.Popup>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	);
}
PopoverContent.displayName = 'Popover.Content';

const PopoverClose = PopoverPrimitive.Close;
const PopoverDescription = PopoverPrimitive.Description;
const PopoverTitle = PopoverPrimitive.Title;

export const Popover = Object.assign(PopoverRoot, {
	Trigger: PopoverTrigger,
	Content: PopoverContent,
	Anchor: PopoverAnchor,
	Close: PopoverClose,
	Description: PopoverDescription,
	Title: PopoverTitle,
});

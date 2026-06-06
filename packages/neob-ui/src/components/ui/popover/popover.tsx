import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { ComponentProps, createContext, ReactNode, Ref, RefCallback, useCallback, useContext, useMemo, useState } from 'react';

import { useTransformOrigin } from '@/hooks/use-transform-origin';
import { cn } from '@/lib/utilities';

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

const PopoverContext = createContext<{
	readonly anchorRef: RefCallback<HTMLDivElement | null>;
	readonly anchorElement: HTMLDivElement | null;
} | null>(null);

interface PopoverContentProperties {
	readonly ref?: Ref<HTMLDivElement>;
	readonly className?: string;
	readonly children?: ReactNode;
	readonly align?: 'start' | 'center' | 'end';
	readonly sideOffset?: number;
	readonly side?: 'top' | 'bottom' | 'left' | 'right';
	readonly onOpenAutoFocus?: (event: Event) => void;
}

/** Popover root component. Wraps Base UI Popover primitive with a stable anchor context. */
function PopoverRoot({ children, ...properties }: ComponentProps<typeof PopoverPrimitive.Root>) {
	const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);

	const contextValue = useMemo(() => {
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
	readonly children?: ReactNode;
	readonly className?: string;
	readonly ref?: Ref<HTMLDivElement>;
}) {
	const context = useContext(PopoverContext);

	const handleRef = useCallback(
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
function PopoverTrigger({ children, ...properties }: ComponentProps<typeof PopoverPrimitive.Trigger>) {
	const context = useContext(PopoverContext);
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
	const context = useContext(PopoverContext);
	const transformOriginRef = useTransformOrigin(context?.anchorElement || null, ref);

	const resolvedSideOffset = useCallback(
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

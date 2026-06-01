import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

export interface HoverPreviewProps {
	readonly children?: React.ReactElement<Record<string, unknown>>;
	readonly preview?: React.ReactNode;
	readonly className?: string;
	readonly delayDuration?: number;
	readonly forceOpen?: boolean;
}

let lastInteractionWasTouch = false;

if (typeof document !== 'undefined') {
	document.addEventListener(
		'touchstart',
		() => {
			lastInteractionWasTouch = true;
		},
		{ passive: true, capture: true },
	);
	document.addEventListener(
		'pointermove',
		(event: PointerEvent) => {
			if (event.pointerType !== 'touch') {
				lastInteractionWasTouch = false;
			}
		},
		{ passive: true },
	);
}

const LONG_PRESS_DURATION = 500;

const springSnappy: Transition = {
	type: 'spring',
	stiffness: 800,
	damping: 35,
};

const previewVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.95 },
};

/**
 * HoverPreview component.
 * Displays a cursor-following preview on hover, focus, or touch long-press.
 * Adds no default layout styling to the preview container.
 */
export function HoverPreview({ children, preview, className, delayDuration = 200, forceOpen = false }: HoverPreviewProps) {
	const [open, setOpen] = useState(false);
	const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
	const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

	const longPressTimerReference = useRef<ReturnType<typeof setTimeout>>(undefined);
	const longPressFiredReference = useRef(false);
	const mountedReference = useRef(false);

	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			mountedReference.current = true;
		});
		return () => cancelAnimationFrame(frame);
	}, []);

	const onTriggerTouchStart = useCallback(() => {
		longPressFiredReference.current = false;
		longPressTimerReference.current = setTimeout(() => {
			longPressFiredReference.current = true;
			setOpen(true);
		}, LONG_PRESS_DURATION);
	}, []);

	const cancelLongPress = useCallback(() => {
		clearTimeout(longPressTimerReference.current);
	}, []);

	useEffect(() => {
		return () => clearTimeout(longPressTimerReference.current);
	}, []);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (forceOpen) return;
			if (nextOpen) {
				if (!mountedReference.current) return;
				if (!lastInteractionWasTouch || longPressFiredReference.current) {
					setOpen(true);
				}
			} else {
				longPressFiredReference.current = false;
				setOpen(false);
			}
		},
		[forceOpen],
	);

	const handlePointerMove = useCallback((event: React.PointerEvent) => {
		if (event.pointerType === 'mouse') {
			setCoords({ x: event.clientX, y: event.clientY });
		}
	}, []);

	const virtualAnchor = useMemo(() => {
		if (coords) {
			const rect: DOMRect = {
				width: 0,
				height: 0,
				x: coords.x,
				y: coords.y,
				left: coords.x,
				right: coords.x,
				top: coords.y,
				bottom: coords.y,
				toJSON: () => '{}',
			};
			return {
				getBoundingClientRect: () => rect,
			};
		}
		return triggerElement;
	}, [coords, triggerElement]);

	const isOpen = forceOpen || open;

	if (!children) {
		return null;
	}

	return (
		<BaseTooltip.Root open={isOpen} onOpenChange={handleOpenChange}>
			<BaseTooltip.Trigger
				delay={delayDuration}
				onPointerMove={handlePointerMove}
				onTouchStart={onTriggerTouchStart}
				onTouchEnd={cancelLongPress}
				onTouchMove={cancelLongPress}
				ref={setTriggerElement}
				render={children}
			/>
			<AnimatePresence>
				{isOpen && (
					<BaseTooltip.Portal keepMounted>
						<BaseTooltip.Positioner
							anchor={virtualAnchor || undefined}
							side="right"
							align="start"
							sideOffset={25}
							alignOffset={-15}
							className="z-20"
						>
							<BaseTooltip.Popup
								render={
									<motion.div
										variants={previewVariants}
										initial="hidden"
										animate="visible"
										exit="exit"
										transition={springSnappy}
										onAnimationComplete={() => {
											if (!isOpen) {
												setCoords(null);
											}
										}}
									/>
								}
								className={cn('z-20 outline-hidden', className)}
							>
								{preview}
							</BaseTooltip.Popup>
						</BaseTooltip.Positioner>
					</BaseTooltip.Portal>
				)}
			</AnimatePresence>
		</BaseTooltip.Root>
	);
}
HoverPreview.displayName = 'HoverPreview';

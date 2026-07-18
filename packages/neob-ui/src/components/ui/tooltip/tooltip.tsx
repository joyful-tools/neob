import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { useLastInteractionWasTouch } from '@/hooks/use-interaction-modality';
import { cn } from '@/lib/utilities';

const LONG_PRESS_DURATION = 700;

function useTouchGatedTooltip() {
	const [open, setOpen] = useState(false);
	const getLastInteractionWasTouch = useLastInteractionWasTouch();
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

	const onOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				if (!mountedReference.current) return;
				if (!getLastInteractionWasTouch() || longPressFiredReference.current) {
					setOpen(true);
				}
			} else {
				longPressFiredReference.current = false;
				setOpen(false);
			}
		},
		[getLastInteractionWasTouch],
	);

	return { open, onOpenChange, onTriggerTouchStart, cancelLongPress };
}

interface TooltipProperties {
	readonly children?: ReactElement<Record<string, unknown>>;
	readonly content?: ReactNode;
	readonly side?: 'top' | 'right' | 'bottom' | 'left';
	readonly delayDuration?: number;
	readonly className?: string;
	readonly forceOpen?: boolean;
}

function TooltipProvider({ children }: { children: ReactNode }) {
	return <BaseTooltip.Provider delay={300}>{children}</BaseTooltip.Provider>;
}
TooltipProvider.displayName = 'Tooltip.Provider';

const springSnappy: Transition = {
	type: 'spring',
	stiffness: 800,
	damping: 35,
};

const tooltipVariants = {
	hidden: { opacity: 0, scale: 0.92 },
	visible: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.92 },
};

function TooltipRoot({ children, content, side = 'top', delayDuration, className, forceOpen = false }: TooltipProperties) {
	const { open, onOpenChange, onTriggerTouchStart, cancelLongPress } = useTouchGatedTooltip();
	const isOpen = forceOpen || open;

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (forceOpen) return;
			onOpenChange(nextOpen);
		},
		[forceOpen, onOpenChange],
	);

	if (!children) return null;

	return (
		<BaseTooltip.Root open={isOpen} onOpenChange={handleOpenChange}>
			<BaseTooltip.Trigger
				delay={delayDuration}
				onTouchStart={onTriggerTouchStart}
				onTouchEnd={cancelLongPress}
				onTouchMove={cancelLongPress}
				render={children}
			/>
			<AnimatePresence>
				{isOpen && (
					<BaseTooltip.Portal keepMounted>
						<BaseTooltip.Positioner side={side} sideOffset={6} className="z-100">
							<BaseTooltip.Popup
								role="tooltip"
								render={<motion.div variants={tooltipVariants} initial="hidden" animate="visible" exit="exit" transition={springSnappy} />}
								className={cn(
									`rounded-full border border-black bg-white px-2 py-1 text-xs font-bold text-black shadow-sm select-none dark:bg-zinc dark:text-white`,
									className,
								)}
							>
								{content}
								<BaseTooltip.Arrow className="fill-black" />
							</BaseTooltip.Popup>
						</BaseTooltip.Positioner>
					</BaseTooltip.Portal>
				)}
			</AnimatePresence>
		</BaseTooltip.Root>
	);
}
TooltipRoot.displayName = 'Tooltip';

export const Tooltip = Object.assign(TooltipRoot, {
	Provider: TooltipProvider,
});

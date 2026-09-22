import { Popover } from '@base-ui/react/popover';
import { TrashIcon, XIcon } from '@phosphor-icons/react';
import { motion, useAnimationControls, type TargetAndTransition, type Transition } from 'motion/react';
import { cloneElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useQueuedAction } from '@/hooks/use-queued-action';
import { afterAction } from '@/lib/actions';
import { cn } from '@/lib/utilities';

import type { ButtonProperties } from '@/components/ui/button';
import type { Action } from '@/lib/actions';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

export type InlineConfirmGroupDirection = 'left' | 'right';
export type InlineConfirmGroupIntent = 'danger' | 'info' | 'success';

export interface InlineConfirmGroupProperties {
	readonly itemName: string;
	readonly actionLabel?: string;
	readonly actionIcon?: ReactElement<{ className?: string }>;
	readonly intent?: InlineConfirmGroupIntent;
	readonly action: Action;
	readonly onCancel?: () => void;
	readonly className?: string;
	readonly direction?: InlineConfirmGroupDirection;
	readonly variant?: ButtonProperties['variant'];
	readonly color?: ButtonProperties['color'];
	readonly size?: ButtonProperties['size'];
}

const spring: Transition = {
	type: 'spring',
	stiffness: 700,
	damping: 40,
};

const intentClassNames: Record<InlineConfirmGroupIntent, string> = {
	danger: 'bg-red/10 text-red hover:bg-red dark:bg-red/20 dark:text-red-light dark:hover:text-black',
	info: 'bg-blue/10 text-blue hover:bg-blue dark:bg-blue/20 dark:text-blue-light dark:hover:text-black',
	success: 'bg-green/10 text-green hover:bg-green dark:bg-green/20 dark:text-green-light dark:hover:text-black',
};

export function InlineConfirmGroup({
	itemName,
	actionLabel = 'Delete',
	actionIcon = <TrashIcon />,
	intent = 'danger',
	action,
	onCancel,
	className,
	direction = 'left',
	variant = 'ghost',
	color,
	size = 'icon',
}: InlineConfirmGroupProperties) {
	const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);
	const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null);
	const [morphTarget, setMorphTarget] = useState<TargetAndTransition | null>(null);
	const [morphBorderTarget, setMorphBorderTarget] = useState<TargetAndTransition | null>(null);
	const [morphScale, setMorphScale] = useState({ x: 1, y: 1 });
	const [surfaceHandedOff, setSurfaceHandedOff] = useState(false);
	const [opening, setOpening] = useState(false);
	const [closing, setClosing] = useState(false);
	const wasOpen = useRef(false);
	const triggerButtonReference = useRef<HTMLButtonElement>(null);
	const confirmButtonReference = useRef<HTMLButtonElement>(null);
	const cancelButtonReference = useRef<HTMLButtonElement>(null);
	const closingReference = useRef(false);
	const popupAnimation = useAnimationControls();
	const borderAnimation = useAnimationControls();
	const actionLabelLowercase = actionLabel.toLowerCase();
	const transformOrigin = direction === 'left' ? 'right center' : 'left center';
	const shouldTransitionSurface = variant === 'ghost' || variant === 'dark-ghost';
	const renderActionIcon = useCallback(
		(sizeClassName: string) => cloneElement(actionIcon, { className: cn(sizeClassName, actionIcon.props.className) }),
		[actionIcon],
	);

	const closeConfirmation = useCallback(() => {
		if (closingReference.current) return;

		if (!morphTarget) {
			setOpen(false);
			setOpening(false);
			setSurfaceHandedOff(false);
			return;
		}

		closingReference.current = true;
		setClosing(true);
		const animations = [popupAnimation.start({ ...morphTarget, transition: spring })];
		if (morphBorderTarget) animations.push(borderAnimation.start({ ...morphBorderTarget, transition: spring }));
		void Promise.all(animations).then(() => {
			setOpen(false);
			setSurfaceHandedOff(false);
			setMorphTarget(null);
			setMorphBorderTarget(null);
			setOpening(false);
			setClosing(false);
			closingReference.current = false;
		});
	}, [borderAnimation, morphBorderTarget, morphTarget, popupAnimation]);

	const openConfirmation = useCallback(() => {
		setOpening(true);
		setOpen(true);
	}, []);

	const { runAction, isPending } = useQueuedAction(() => afterAction(action(), closeConfirmation));

	useEffect(() => {
		if (open) wasOpen.current = true;
	}, [open]);

	useLayoutEffect(() => {
		if (open || surfaceHandedOff || !wasOpen.current) return;

		triggerButtonReference.current?.focus();
		wasOpen.current = false;
	}, [open, surfaceHandedOff]);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				openConfirmation();
				return;
			}

			if (isPending) return;
			closeConfirmation();
			onCancel?.();
		},
		[closeConfirmation, isPending, onCancel, openConfirmation],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (isPending) return;

			switch (event.key) {
				case 'Escape': {
					event.preventDefault();
					event.stopPropagation();
					closeConfirmation();
					onCancel?.();
					return;
				}
				case 'Tab':
				case 'ArrowLeft':
				case 'ArrowRight': {
					event.preventDefault();
					event.stopPropagation();
					if (document.activeElement === confirmButtonReference.current) {
						cancelButtonReference.current?.focus();
					} else {
						confirmButtonReference.current?.focus();
					}
					return;
				}
				default: {
					return;
				}
			}
		},
		[closeConfirmation, isPending, onCancel],
	);

	const handleConfirmClick = useCallback(
		(event: MouseEvent) => {
			event.stopPropagation();
			void runAction().catch(() => {});
		},
		[runAction],
	);

	const handleCancelClick = useCallback(
		(event: MouseEvent) => {
			event.stopPropagation();
			closeConfirmation();
			onCancel?.();
		},
		[closeConfirmation, onCancel],
	);

	useLayoutEffect(() => {
		if (!open || !anchorElement || !popupElement || !triggerButtonReference.current) return;

		const ownerWindow = popupElement.ownerDocument.defaultView;
		if (!ownerWindow) return;

		let animationFrame = ownerWindow.requestAnimationFrame(() => {
			const anchorBounds = anchorElement.getBoundingClientRect();
			const popupBounds = popupElement.getBoundingClientRect();
			if (popupBounds.width === 0 || popupBounds.height === 0) return;
			const scaleX = anchorBounds.width / popupBounds.width;
			const scaleY = anchorBounds.height / popupBounds.height;

			const triggerStyles = ownerWindow.getComputedStyle(triggerButtonReference.current!);
			const popupStyles = ownerWindow.getComputedStyle(popupElement);
			const popupBackgroundColor = popupStyles.backgroundColor;
			const popupColor = popupStyles.color;
			const popupBorderTopWidth = popupStyles.borderTopWidth;
			const popupBorderRightWidth = popupStyles.borderRightWidth;
			const popupBorderBottomWidth = popupStyles.borderBottomWidth;
			const popupBorderLeftWidth = popupStyles.borderLeftWidth;
			const targetBackgroundColor = shouldTransitionSurface ? triggerStyles.backgroundColor : popupBackgroundColor;
			const targetColor = shouldTransitionSurface ? triggerStyles.color : popupColor;
			const targetBorderTopColor = shouldTransitionSurface ? 'transparent' : triggerStyles.borderTopColor;
			const targetBorderRightColor = shouldTransitionSurface ? 'transparent' : triggerStyles.borderRightColor;
			const targetBorderBottomColor = shouldTransitionSurface ? 'transparent' : triggerStyles.borderBottomColor;
			const targetBorderLeftColor = shouldTransitionSurface ? 'transparent' : triggerStyles.borderLeftColor;
			const borderTarget: TargetAndTransition = {
				borderTopWidth: `${Math.max(0, Number.parseFloat(triggerStyles.borderTopWidth) / scaleY - (shouldTransitionSurface ? 0 : Number.parseFloat(popupBorderTopWidth)))}px`,
				borderRightWidth: `${Math.max(0, Number.parseFloat(triggerStyles.borderRightWidth) / scaleX - (shouldTransitionSurface ? 0 : Number.parseFloat(popupBorderRightWidth)))}px`,
				borderBottomWidth: `${Math.max(0, Number.parseFloat(triggerStyles.borderBottomWidth) / scaleY - (shouldTransitionSurface ? 0 : Number.parseFloat(popupBorderBottomWidth)))}px`,
				borderLeftWidth: `${Math.max(0, Number.parseFloat(triggerStyles.borderLeftWidth) / scaleX - (shouldTransitionSurface ? 0 : Number.parseFloat(popupBorderLeftWidth)))}px`,
				borderTopColor: targetBorderTopColor,
				borderRightColor: targetBorderRightColor,
				borderBottomColor: targetBorderBottomColor,
				borderLeftColor: targetBorderLeftColor,
			};
			const target: TargetAndTransition = {
				x: direction === 'left' ? anchorBounds.right - popupBounds.right : anchorBounds.left - popupBounds.left,
				y: anchorBounds.top + anchorBounds.height / 2 - (popupBounds.top + popupBounds.height / 2),
				scaleX,
				scaleY,
				borderRadius: `${8 / scaleX}px / ${8 / scaleY}px`,
				backgroundColor: targetBackgroundColor,
				color: targetColor,
				opacity: 1,
			};

			setMorphTarget(target);
			setMorphBorderTarget(borderTarget);
			setMorphScale({ x: scaleX, y: scaleY });
			borderAnimation.set(borderTarget);
			popupAnimation.set(target);
			animationFrame = ownerWindow.requestAnimationFrame(() => {
				setSurfaceHandedOff(true);
				void popupAnimation
					.start({
						x: 0,
						y: 0,
						scaleX: 1,
						scaleY: 1,
						borderRadius: '8px / 8px',
						backgroundColor: popupBackgroundColor,
						color: popupColor,
						opacity: 1,
						transition: spring,
					})
					.then(() => setOpening(false));
				void borderAnimation.start({
					borderTopWidth: 0,
					borderRightWidth: 0,
					borderBottomWidth: 0,
					borderLeftWidth: 0,
					transition: spring,
				});
			});
		});

		return () => ownerWindow.cancelAnimationFrame(animationFrame);
	}, [anchorElement, borderAnimation, direction, open, popupAnimation, popupElement, shouldTransitionSurface]);

	const confirmButton = (
		<Button
			key="confirm"
			ref={confirmButtonReference}
			type="button"
			variant="subtle"
			size="icon"
			tabIndex={0}
			disabled={isPending}
			action={handleConfirmClick}
			className={cn('size-7 rounded-md border hover:text-white', intentClassNames[intent])}
			aria-label={`Confirm ${actionLabelLowercase} ${itemName}`}
		>
			{renderActionIcon('size-4')}
		</Button>
	);
	const cancelButton = (
		<Button
			key="cancel"
			ref={cancelButtonReference}
			type="button"
			variant="subtle"
			size="icon"
			tabIndex={0}
			disabled={isPending}
			action={handleCancelClick}
			className="size-7 rounded-md border bg-zinc/10 text-black hover:bg-black hover:text-white dark:bg-zinc/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
			aria-label={`Cancel ${actionLabelLowercase} ${itemName}`}
		>
			<XIcon className="size-4" />
		</Button>
	);
	const confirmationButtons = direction === 'left' ? [confirmButton, cancelButton] : [cancelButton, confirmButton];

	return (
		<Popover.Root open={open} onOpenChange={handleOpenChange}>
			<div ref={setAnchorElement} className="relative inline-flex items-center justify-center">
				<Button
					ref={triggerButtonReference}
					type="button"
					variant={variant}
					color={color}
					size={size}
					disabled={isPending}
					aria-hidden={open || undefined}
					tabIndex={open ? -1 : undefined}
					action={(event) => {
						event.stopPropagation();
						openConfirmation();
					}}
					aria-label={`${actionLabel} ${itemName}`}
					style={{ pointerEvents: open ? 'none' : undefined, visibility: surfaceHandedOff ? 'hidden' : undefined }}
					data-morph-source={surfaceHandedOff ? 'hidden' : undefined}
				>
					<motion.span
						initial={false}
						animate={open && !closing ? { opacity: 0, scale: 0.35 } : { opacity: 1, scale: 1 }}
						transition={spring}
						className="inline-flex items-center justify-center"
					>
						{renderActionIcon('size-5')}
					</motion.span>
				</Button>
			</div>
			{open ? (
				<Popover.Portal>
					<Popover.Positioner
						anchor={anchorElement}
						positionMethod="fixed"
						side="bottom"
						align="center"
						alignOffset={({ anchor, positioner }) =>
							direction === 'left' ? -(positioner.width - anchor.width) / 2 : (positioner.width - anchor.width) / 2
						}
						sideOffset={({ anchor, positioner }) => -(anchor.height + positioner.height) / 2}
						collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}
						className="z-100"
					>
						<Popover.Popup
							ref={setPopupElement}
							render={<motion.div initial={{ opacity: 0 }} animate={popupAnimation} style={{ borderRadius: 8, transformOrigin }} />}
							initialFocus={cancelButtonReference}
							finalFocus={false}
							role="group"
							aria-label={`${actionLabel} confirmation for ${itemName}`}
							aria-busy={isPending || undefined}
							data-pending={isPending ? '' : undefined}
							data-opening={opening ? '' : undefined}
							data-closing={closing ? '' : undefined}
							className={cn(
								'relative flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-transparent bg-white p-1 outline-hidden dark:bg-zinc',
								className,
							)}
							onClick={(event) => event.stopPropagation()}
							onKeyDown={handleKeyDown}
						>
							<motion.span
								aria-hidden="true"
								initial={{ opacity: shouldTransitionSurface ? 0 : 1 }}
								animate={{ opacity: shouldTransitionSurface && closing ? 0 : 1 }}
								transition={spring}
								style={{ borderRadius: 'inherit' }}
								className="pointer-events-none absolute inset-0 border-2 border-edge shadow-sm"
								data-surface-border=""
								data-surface-transition={shouldTransitionSurface ? 'fade' : undefined}
							/>
							<motion.span
								aria-hidden="true"
								initial={false}
								animate={borderAnimation}
								style={{ borderRadius: 'inherit', borderStyle: 'solid' }}
								className="pointer-events-none absolute inset-0"
								data-morph-border=""
							/>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: closing ? 0 : 1 }}
								transition={{ duration: 0.12, ease: 'easeOut' }}
								className="flex items-center gap-1.5"
							>
								{confirmationButtons}
							</motion.div>
							<motion.span
								aria-hidden="true"
								initial={false}
								animate={
									closing ? { opacity: 1, scaleX: 1 / morphScale.x, scaleY: 1 / morphScale.y } : { opacity: 0, scaleX: 0.35, scaleY: 0.35 }
								}
								transition={closing ? spring : { duration: 0.12, ease: 'easeOut' }}
								className="pointer-events-none absolute inset-0 flex items-center justify-center"
								data-morph-label=""
							>
								{renderActionIcon('size-5')}
							</motion.span>
						</Popover.Popup>
					</Popover.Positioner>
				</Popover.Portal>
			) : null}
		</Popover.Root>
	);
}

InlineConfirmGroup.displayName = 'InlineConfirmGroup';

import { Popover } from '@base-ui/react/popover';
import { motion, useAnimationControls, type TargetAndTransition, type Transition } from 'motion/react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { useQueuedAction } from '@/hooks/use-queued-action';
import { afterAction } from '@/lib/actions';
import { cn } from '@/lib/utilities';

import type { ButtonProperties } from '@/components/ui/button';
import type { Action } from '@/lib/actions';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';

interface ConfirmButtonProperties {
	readonly children: ReactNode;
	readonly title: string;
	readonly description?: string;
	readonly confirmLabel: string;
	readonly cancelLabel?: string;
	readonly action: Action;
	readonly variant?: ButtonProperties['variant'];
	readonly color?: ButtonProperties['color'];
	readonly size?: ButtonProperties['size'];
	readonly confirmVariant?: ButtonProperties['variant'];
	readonly confirmColor?: ButtonProperties['color'];
	readonly className?: string;
	readonly disabled?: boolean;
}

const springOpen: Transition = {
	type: 'spring',
	stiffness: 550,
	damping: 35,
};

const springClose: Transition = {
	type: 'spring',
	stiffness: 700,
	damping: 40,
};

export function ConfirmButton({
	children,
	title,
	description,
	confirmLabel,
	cancelLabel = 'Cancel',
	action,
	variant = 'subtle',
	color,
	size = 'sm',
	confirmVariant = 'danger',
	confirmColor,
	className,
	disabled = false,
}: ConfirmButtonProperties) {
	const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);
	const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null);
	const [morphTarget, setMorphTarget] = useState<TargetAndTransition | null>(null);
	const [morphBorderTarget, setMorphBorderTarget] = useState<TargetAndTransition | null>(null);
	const [morphScale, setMorphScale] = useState({ x: 1, y: 1 });
	const [morphLabelStyle, setMorphLabelStyle] = useState<CSSProperties>();
	const [surfaceHandedOff, setSurfaceHandedOff] = useState(false);
	const [opening, setOpening] = useState(false);
	const [closing, setClosing] = useState(false);
	const titleId = useId();
	const descriptionId = useId();
	const wasOpen = useRef(false);
	const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
	const cancelButtonRef = useRef<HTMLButtonElement>(null);
	const triggerButtonRef = useRef<HTMLButtonElement>(null);
	const closingRef = useRef(false);
	const popupAnimation = useAnimationControls();
	const borderAnimation = useAnimationControls();

	const closeOverlay = useCallback(() => {
		if (closingRef.current) return;

		if (!morphTarget) {
			setOpen(false);
			setOpening(false);
			setSurfaceHandedOff(false);
			return;
		}

		closingRef.current = true;
		setClosing(true);
		const animations = [popupAnimation.start({ ...morphTarget, transition: springClose })];
		if (morphBorderTarget) animations.push(borderAnimation.start({ ...morphBorderTarget, transition: springClose }));
		void Promise.all(animations).then(() => {
			setOpen(false);
			setSurfaceHandedOff(false);
			setMorphTarget(null);
			setMorphBorderTarget(null);
			setOpening(false);
			setClosing(false);
			closingRef.current = false;
		});
	}, [borderAnimation, morphBorderTarget, morphTarget, popupAnimation]);

	const openOverlay = useCallback(() => {
		setOpening(true);
		setOpen(true);
	}, []);

	const { runAction, isPending } = useQueuedAction(() => afterAction(action(), closeOverlay));

	useEffect(() => {
		if (open) {
			wasOpen.current = true;
		}
	}, [open]);

	useLayoutEffect(() => {
		if (open || surfaceHandedOff || !wasOpen.current) return;

		triggerButtonRef.current?.focus();
		wasOpen.current = false;
	}, [open, surfaceHandedOff]);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				openOverlay();
				return;
			}

			if (!isPending) closeOverlay();
		},
		[closeOverlay, isPending, openOverlay],
	);

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Escape': {
				event.preventDefault();
				event.stopPropagation();
				if (!isPending) {
					closeOverlay();
				}
				return;
			}
			case 'Tab':
			case 'ArrowLeft':
			case 'ArrowRight': {
				event.preventDefault();
				event.stopPropagation();
				if (document.activeElement === confirmButtonRef.current) {
					cancelButtonRef.current?.focus();
				} else {
					confirmButtonRef.current?.focus();
				}
				return;
			}
			default: {
				return;
			}
		}
	}

	const borderRadius = size === 'sm' ? 6 : size === 'lg' || size === 'xl' ? 12 : 8;

	useLayoutEffect(() => {
		if (!open || !anchorElement || !popupElement || !triggerButtonRef.current) return;

		const ownerWindow = popupElement.ownerDocument.defaultView;
		if (!ownerWindow) return;

		let animationFrame = ownerWindow.requestAnimationFrame(() => {
			const anchorBounds = anchorElement.getBoundingClientRect();
			const popupBounds = popupElement.getBoundingClientRect();
			if (popupBounds.width === 0 || popupBounds.height === 0) return;
			const scaleX = anchorBounds.width / popupBounds.width;
			const scaleY = anchorBounds.height / popupBounds.height;

			const triggerStyles = ownerWindow.getComputedStyle(triggerButtonRef.current!);
			const popupStyles = ownerWindow.getComputedStyle(popupElement);
			const popupBackgroundColor = popupStyles.backgroundColor;
			const popupColor = popupStyles.color;
			const popupBoxShadow = popupStyles.boxShadow;
			const popupBorderTopWidth = popupStyles.borderTopWidth;
			const popupBorderRightWidth = popupStyles.borderRightWidth;
			const popupBorderBottomWidth = popupStyles.borderBottomWidth;
			const popupBorderLeftWidth = popupStyles.borderLeftWidth;
			const popupBorderTopColor = popupStyles.borderTopColor;
			const popupBorderRightColor = popupStyles.borderRightColor;
			const popupBorderBottomColor = popupStyles.borderBottomColor;
			const popupBorderLeftColor = popupStyles.borderLeftColor;
			const borderTarget: TargetAndTransition = {
				borderTopWidth: `${Math.max(0, Number.parseFloat(triggerStyles.borderTopWidth) / scaleY - Number.parseFloat(popupBorderTopWidth))}px`,
				borderRightWidth: `${Math.max(0, Number.parseFloat(triggerStyles.borderRightWidth) / scaleX - Number.parseFloat(popupBorderRightWidth))}px`,
				borderBottomWidth: `${Math.max(0, Number.parseFloat(triggerStyles.borderBottomWidth) / scaleY - Number.parseFloat(popupBorderBottomWidth))}px`,
				borderLeftWidth: `${Math.max(0, Number.parseFloat(triggerStyles.borderLeftWidth) / scaleX - Number.parseFloat(popupBorderLeftWidth))}px`,
				borderTopColor: triggerStyles.borderTopColor,
				borderRightColor: triggerStyles.borderRightColor,
				borderBottomColor: triggerStyles.borderBottomColor,
				borderLeftColor: triggerStyles.borderLeftColor,
			};
			const target: TargetAndTransition = {
				x: anchorBounds.left + anchorBounds.width / 2 - (popupBounds.left + popupBounds.width / 2),
				y: anchorBounds.top + anchorBounds.height / 2 - (popupBounds.top + popupBounds.height / 2),
				scaleX,
				scaleY,
				borderRadius: `${borderRadius / scaleX}px / ${borderRadius / scaleY}px`,
				backgroundColor: triggerStyles.backgroundColor,
				color: triggerStyles.color,
				boxShadow: triggerStyles.boxShadow,
				borderTopColor: triggerStyles.borderTopColor,
				borderRightColor: triggerStyles.borderRightColor,
				borderBottomColor: triggerStyles.borderBottomColor,
				borderLeftColor: triggerStyles.borderLeftColor,
				opacity: 1,
			};

			setMorphTarget(target);
			setMorphBorderTarget(borderTarget);
			setMorphScale({ x: scaleX, y: scaleY });
			setMorphLabelStyle({
				fontSize: triggerStyles.fontSize,
				fontWeight: triggerStyles.fontWeight,
				letterSpacing: triggerStyles.letterSpacing,
				lineHeight: triggerStyles.lineHeight,
				textTransform: triggerStyles.textTransform === 'uppercase' ? 'uppercase' : 'none',
			});
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
						borderRadius: '12px / 12px',
						backgroundColor: popupBackgroundColor,
						color: popupColor,
						boxShadow: popupBoxShadow,
						borderTopColor: popupBorderTopColor,
						borderRightColor: popupBorderRightColor,
						borderBottomColor: popupBorderBottomColor,
						borderLeftColor: popupBorderLeftColor,
						opacity: 1,
						transition: springOpen,
					})
					.then(() => setOpening(false));
				void borderAnimation.start({
					borderTopWidth: 0,
					borderRightWidth: 0,
					borderBottomWidth: 0,
					borderLeftWidth: 0,
					transition: springOpen,
				});
			});
		});

		return () => {
			ownerWindow.cancelAnimationFrame(animationFrame);
		};
	}, [anchorElement, borderAnimation, borderRadius, open, popupAnimation, popupElement]);

	return (
		<Popover.Root open={open} onOpenChange={handleOpenChange}>
			<div ref={setAnchorElement} className="relative inline-flex items-center justify-center">
				<button
					ref={triggerButtonRef}
					type="button"
					className={cn(buttonVariants({ variant, color, size, className }), 'relative')}
					disabled={disabled}
					aria-hidden={open || undefined}
					tabIndex={open ? -1 : undefined}
					onClick={openOverlay}
					style={{
						borderRadius,
						transition: 'none',
						pointerEvents: open ? 'none' : undefined,
						visibility: surfaceHandedOff ? 'hidden' : undefined,
					}}
					data-morph-source={surfaceHandedOff ? 'hidden' : undefined}
				>
					<motion.span
						initial={false}
						animate={open && !closing ? { opacity: 0, scale: 0.35 } : { opacity: 1, scale: 1 }}
						transition={open && !closing ? springOpen : springClose}
						className="inline-flex items-center gap-2"
					>
						{children}
					</motion.span>
				</button>
			</div>
			{open ? (
				<Popover.Portal>
					<Popover.Positioner
						anchor={anchorElement}
						positionMethod="fixed"
						side="bottom"
						sideOffset={({ anchor, positioner }) => -(anchor.height + positioner.height) / 2}
						collisionBoundary={anchorElement?.ownerDocument.documentElement}
						collisionPadding={8}
						collisionAvoidance={{ side: 'shift', align: 'shift', fallbackAxisSide: 'none' }}
						sticky
						className="z-100"
					>
						<Popover.Popup
							ref={setPopupElement}
							render={
								<motion.div initial={{ opacity: 0 }} animate={popupAnimation} style={{ borderRadius: 12, transformOrigin: 'center' }} />
							}
							initialFocus={cancelButtonRef}
							finalFocus={false}
							className={cn(
								`relative flex max-h-[min(var(--available-height),calc(100vh-1rem))] max-w-[calc(100vw-1rem)] min-w-[min(14rem,calc(100vw-1rem))] flex-col items-center overflow-auto rounded-xl border-2 border-edge bg-white p-3 text-black shadow-md outline-hidden dark:bg-zinc dark:text-white`,
							)}
							role="dialog"
							aria-labelledby={titleId}
							aria-describedby={description ? descriptionId : undefined}
							aria-busy={isPending || undefined}
							data-pending={isPending ? '' : undefined}
							data-opening={opening ? '' : undefined}
							data-closing={closing ? '' : undefined}
							onKeyDown={handleKeyDown}
						>
							<motion.span
								aria-hidden="true"
								initial={false}
								animate={borderAnimation}
								style={{ borderRadius: 'inherit', borderStyle: 'solid' }}
								className="pointer-events-none absolute inset-0"
							/>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: closing ? 0 : 1 }}
								transition={{ duration: 0.18, ease: 'easeOut' }}
								className="flex w-full flex-col items-center"
							>
								<Popover.Title id={titleId} className="text-center text-sm font-bold text-black dark:text-white">
									{title}
								</Popover.Title>
								{description && (
									<Popover.Description id={descriptionId} className="mt-1 text-center text-xs/relaxed text-black/60 dark:text-white/60">
										{description}
									</Popover.Description>
								)}
								<div className="mt-3 flex w-full items-center justify-center gap-1.5">
									<Button
										ref={cancelButtonRef}
										type="button"
										variant="subtle"
										size="sm"
										disabled={isPending}
										className="h-7 px-3"
										action={closeOverlay}
									>
										{cancelLabel}
									</Button>
									<Button
										ref={confirmButtonRef}
										type="button"
										variant={confirmVariant}
										color={confirmColor}
										size="sm"
										action={runAction}
										className="h-7 px-3"
									>
										{confirmLabel}
									</Button>
								</div>
							</motion.div>
							<motion.span
								aria-hidden="true"
								initial={false}
								animate={
									closing ? { opacity: 1, scaleX: 1 / morphScale.x, scaleY: 1 / morphScale.y } : { opacity: 0, scaleX: 0.35, scaleY: 0.35 }
								}
								transition={closing ? springClose : { duration: 0.12, ease: 'easeOut' }}
								style={morphLabelStyle}
								className="pointer-events-none absolute inset-0 flex items-center justify-center"
								data-morph-label=""
							>
								<span className="inline-flex items-center gap-2">{children}</span>
							</motion.span>
						</Popover.Popup>
					</Popover.Positioner>
				</Popover.Portal>
			) : null}
		</Popover.Root>
	);
}
ConfirmButton.displayName = 'ConfirmButton';

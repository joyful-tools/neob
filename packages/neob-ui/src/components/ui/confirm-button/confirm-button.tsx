import { AnimatePresence, motion, type Transition } from 'motion/react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { useQueuedAction } from '@/hooks/use-queued-action';
import { afterAction } from '@/lib/actions';
import { cn } from '@/lib/utilities';

import type { ButtonProperties } from '@/components/ui/button';
import type { Action } from '@/lib/actions';
import type { KeyboardEvent, ReactNode } from 'react';

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

interface ViewportOffset {
	readonly x: number;
	readonly y: number;
}

const VIEWPORT_GAP = 8;
const ZERO_VIEWPORT_OFFSET: ViewportOffset = { x: 0, y: 0 };

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.min(Math.max(value, minimum), maximum);
}

function getViewportOffset(anchor: HTMLElement, overlay: HTMLElement): ViewportOffset {
	const anchorRect = anchor.getBoundingClientRect();
	const visualViewport = window.visualViewport;
	const viewportLeft = visualViewport?.offsetLeft ?? 0;
	const viewportTop = visualViewport?.offsetTop ?? 0;
	const viewportWidth = visualViewport?.width ?? document.documentElement.clientWidth;
	const viewportHeight = visualViewport?.height ?? document.documentElement.clientHeight;
	const preferredLeft = anchorRect.left + (anchorRect.width - overlay.offsetWidth) / 2;
	const preferredTop = anchorRect.top + (anchorRect.height - overlay.offsetHeight) / 2;
	const minimumLeft = viewportLeft + VIEWPORT_GAP;
	const minimumTop = viewportTop + VIEWPORT_GAP;
	const maximumLeft = Math.max(minimumLeft, viewportLeft + viewportWidth - VIEWPORT_GAP - overlay.offsetWidth);
	const maximumTop = Math.max(minimumTop, viewportTop + viewportHeight - VIEWPORT_GAP - overlay.offsetHeight);

	return {
		x: clamp(preferredLeft, minimumLeft, maximumLeft) - preferredLeft,
		y: clamp(preferredTop, minimumTop, maximumTop) - preferredTop,
	};
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
	const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);
	const [triggerSize, setTriggerSize] = useState<{ width: number; height: number } | null>(null);
	const [viewportOffset, setViewportOffset] = useState<ViewportOffset>(ZERO_VIEWPORT_OFFSET);
	const titleId = useId();
	const descriptionId = useId();
	const layoutId = useId();
	const wasOpen = useRef(false);
	const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
	const cancelButtonRef = useRef<HTMLButtonElement>(null);
	const triggerButtonRef = useRef<HTMLButtonElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const { runAction, isPending } = useQueuedAction(() => afterAction(action(), () => setOpen(false)));

	useEffect(() => {
		if (open) {
			wasOpen.current = true;
		}
	}, [open]);

	const setCancelButtonRef = useCallback(
		(node: HTMLButtonElement | null) => {
			cancelButtonRef.current = node;
			if (node && open) {
				node.focus();
			}
		},
		[open],
	);

	const setConfirmButtonRef = useCallback((node: HTMLButtonElement | null) => {
		confirmButtonRef.current = node;
	}, []);

	const setTriggerButtonRef = useCallback(
		(node: HTMLButtonElement | null) => {
			triggerButtonRef.current = node;
			if (node && !open && wasOpen.current) {
				node.focus();
				wasOpen.current = false;
			}
		},
		[open],
	);

	useEffect(() => {
		if (!open && triggerButtonRef.current) {
			const rect = triggerButtonRef.current.getBoundingClientRect();
			if (rect.width > 0 && rect.height > 0) {
				setTriggerSize({ width: rect.width, height: rect.height });
			}
		}
	}, [open]);

	const updateViewportOffset = useCallback(() => {
		if (!containerElement || !overlayRef.current) return;

		const overlay = overlayRef.current;
		const nextOffset = getViewportOffset(containerElement, overlay);
		// Individual translate composes with Motion's shared-layout transform so the surface still morphs from its trigger.
		overlay.style.translate = `${nextOffset.x}px ${nextOffset.y}px`;
		setViewportOffset((currentOffset) => {
			if (currentOffset.x === nextOffset.x && currentOffset.y === nextOffset.y) {
				return currentOffset;
			}
			return nextOffset;
		});
	}, [containerElement]);

	useLayoutEffect(() => {
		if (!open || !containerElement || !overlayRef.current) return;

		const overlay = overlayRef.current;
		updateViewportOffset();

		const resizeObserver = new ResizeObserver(updateViewportOffset);
		resizeObserver.observe(containerElement);
		resizeObserver.observe(overlay);
		window.addEventListener('resize', updateViewportOffset);
		document.addEventListener('scroll', updateViewportOffset, true);
		window.visualViewport?.addEventListener('resize', updateViewportOffset);
		window.visualViewport?.addEventListener('scroll', updateViewportOffset);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener('resize', updateViewportOffset);
			document.removeEventListener('scroll', updateViewportOffset, true);
			window.visualViewport?.removeEventListener('resize', updateViewportOffset);
			window.visualViewport?.removeEventListener('scroll', updateViewportOffset);
		};
	}, [containerElement, open, updateViewportOffset]);

	// Close on click outside
	useEffect(() => {
		if (!open || isPending) return;

		function handlePointerDown(event: PointerEvent) {
			if (!(event.target instanceof Node)) return;
			if (containerElement && !containerElement.contains(event.target)) {
				setOpen(false);
			}
		}

		document.addEventListener('pointerdown', handlePointerDown);
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
		};
	}, [open, isPending, containerElement]);

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Escape': {
				event.preventDefault();
				event.stopPropagation();
				if (!isPending) {
					setOpen(false);
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
	const openConfirmation = () => {
		setViewportOffset(ZERO_VIEWPORT_OFFSET);
		setOpen(true);
	};

	return (
		<div
			ref={setContainerElement}
			className="relative inline-flex items-center justify-center"
			style={open && triggerSize ? { width: triggerSize.width, height: triggerSize.height } : undefined}
		>
			<span className="pointer-events-none opacity-0 select-none" aria-hidden="true">
				&#x200b;
			</span>
			<AnimatePresence initial={false}>
				{open ? (
					<motion.div
						ref={overlayRef}
						key="popover"
						layoutId={layoutId}
						layoutDependency={`${open}-${viewportOffset.x}-${viewportOffset.y}`}
						transition={springOpen}
						style={{ borderRadius: 12 }}
						className={cn(
							`absolute z-20 flex max-h-[calc(100vh-1rem)] max-w-[calc(100vw-1rem)] min-w-[min(14rem,calc(100vw-1rem))] flex-col items-center overflow-auto rounded-xl border-2 border-edge bg-white p-3 text-black shadow-md dark:bg-zinc dark:text-white`,
							'origin-center',
						)}
						role="dialog"
						aria-label={title}
						aria-describedby={description ? descriptionId : undefined}
						aria-busy={isPending || undefined}
						data-pending={isPending ? '' : undefined}
						onKeyDown={handleKeyDown}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.92 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.92 }}
							transition={{ duration: 0.18, ease: 'easeOut' }}
							className="flex w-full flex-col items-center"
						>
							<p id={titleId} className="text-center text-sm font-bold text-black dark:text-white">
								{title}
							</p>
							{description && (
								<p id={descriptionId} className="mt-1 text-center text-xs/relaxed text-black/60 dark:text-white/60">
									{description}
								</p>
							)}
							<div className="mt-3 flex w-full items-center justify-center gap-1.5">
								<Button
									ref={setCancelButtonRef}
									type="button"
									variant="subtle"
									size="sm"
									disabled={isPending}
									className="h-7 px-3"
									action={() => setOpen(false)}
								>
									{cancelLabel}
								</Button>
								<Button
									ref={setConfirmButtonRef}
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
					</motion.div>
				) : (
					<motion.button
						ref={setTriggerButtonRef}
						key="trigger"
						type="button"
						layoutId={layoutId}
						layoutDependency={open}
						transition={springClose}
						className={cn(buttonVariants({ variant, color, size, className }), 'relative')}
						disabled={disabled}
						onClick={openConfirmation}
						style={{ borderRadius, transition: 'none' }}
					>
						<span className="inline-flex items-center gap-2">{children}</span>
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}
ConfirmButton.displayName = 'ConfirmButton';

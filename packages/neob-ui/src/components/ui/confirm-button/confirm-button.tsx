import { AnimatePresence, motion, type Transition } from 'motion/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utilities';

import type { ButtonProperties } from '@/components/ui/button';
import type { KeyboardEvent, ReactNode } from 'react';

interface ConfirmButtonProperties {
	readonly children: ReactNode;
	readonly title: string;
	readonly description?: string;
	readonly confirmLabel: string;
	readonly cancelLabel?: string;
	readonly onConfirm: () => Promise<void> | void;
	readonly variant?: ButtonProperties['variant'];
	readonly size?: ButtonProperties['size'];
	readonly confirmVariant?: ButtonProperties['variant'];
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
	onConfirm,
	variant = 'subtle',
	size = 'sm',
	confirmVariant = 'danger',
	className,
	disabled = false,
}: ConfirmButtonProperties) {
	const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const [triggerSize, setTriggerSize] = useState<{ width: number; height: number } | null>(null);
	const titleId = useId();
	const descriptionId = useId();
	const layoutId = useId();
	const wasOpen = useRef(false);
	const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
	const cancelButtonRef = useRef<HTMLButtonElement>(null);
	const triggerButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (open) {
			wasOpen.current = true;
		}
	}, [open]);

	const setConfirmButtonRef = useCallback(
		(node: HTMLButtonElement | null) => {
			confirmButtonRef.current = node;
			if (node && open) {
				node.focus();
			}
		},
		[open],
	);

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

	// Close on click outside
	useEffect(() => {
		if (!open) return;

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
	}, [open, containerElement]);

	async function handleConfirm() {
		setIsConfirming(true);
		try {
			await onConfirm();
			setOpen(false);
		} finally {
			setIsConfirming(false);
		}
	}

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		switch (event.key) {
			case 'Escape': {
				event.preventDefault();
				event.stopPropagation();
				setOpen(false);
				return;
			}
			case 'Tab': {
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
	}, []);

	const borderRadius = size === 'sm' ? 6 : size === 'lg' || size === 'xl' ? 12 : 8;

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
						key="popover"
						layoutId={layoutId}
						layoutDependency={open}
						transition={springOpen}
						style={{ borderRadius: 12 }}
						className={cn(
							`absolute z-20 flex min-w-56 flex-col items-center rounded-xl border-2 border-edge bg-white p-3 text-black shadow-md dark:bg-zinc dark:text-white`,
							'origin-center',
						)}
						role="dialog"
						aria-label={title}
						aria-describedby={description ? descriptionId : undefined}
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
									ref={cancelButtonRef}
									type="button"
									variant="subtle"
									size="sm"
									disabled={isConfirming}
									className="h-7 px-3"
									onClick={() => setOpen(false)}
								>
									{cancelLabel}
								</Button>
								<Button
									ref={setConfirmButtonRef}
									type="button"
									variant={confirmVariant}
									size="sm"
									onClick={() => void handleConfirm()}
									isLoading={isConfirming}
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
						className={cn(buttonVariants({ variant, size, className }), 'relative')}
						disabled={disabled}
						onClick={() => setOpen(true)}
						style={{ borderRadius, transition: 'none' }}
					>
						<motion.span
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.18, ease: 'easeOut' }}
							className="inline-flex items-center gap-2"
						>
							{children}
						</motion.span>
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}
ConfirmButton.displayName = 'ConfirmButton';

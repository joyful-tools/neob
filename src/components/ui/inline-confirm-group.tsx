import { Trash, X } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState, useId } from 'react';

import { cn } from '@/lib/utilities';

import { Spinner } from './spinner';

export interface InlineConfirmGroupProperties {
	readonly itemName: string;
	readonly onConfirm: () => void;
	readonly onCancel?: () => void;
	readonly className?: string;
	readonly isLoading?: boolean;
}

const springCritical = {
	type: 'spring',
	stiffness: 550,
	damping: 35,
} as const;

export function InlineConfirmGroup({ itemName, onConfirm, onCancel, className, isLoading = false }: InlineConfirmGroupProperties) {
	const [open, setOpen] = useState(false);
	const [isClickable, setIsClickable] = useState(false);
	const containerReference = useRef<HTMLDivElement>(null);
	const confirmButtonReference = useRef<HTMLButtonElement>(null);
	const cancelButtonReference = useRef<HTMLButtonElement>(null);
	const layoutId = useId();

	// Throttle clickability of confirm to protect against accidental double click
	useEffect(() => {
		if (!open) return;
		const timer = setTimeout(() => {
			setIsClickable(true);
		}, 300);
		return () => {
			clearTimeout(timer);
		};
	}, [open]);

	// Auto-focus cancel button on mount so the user has immediate focus there
	useEffect(() => {
		if (!open) return;
		cancelButtonReference.current?.focus();

		function handlePointerDown(event: PointerEvent) {
			if (!(event.target instanceof Node)) return;
			if (!containerReference.current?.contains(event.target)) {
				setOpen(false);
				setIsClickable(false);
				onCancel?.();
			}
		}

		document.addEventListener('pointerdown', handlePointerDown);
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
		};
	}, [open, onCancel]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			switch (event.key) {
				case 'Escape': {
					event.preventDefault();
					event.stopPropagation();
					setOpen(false);
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
		[onCancel],
	);

	const handleConfirmClick = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			if (!isClickable) return;
			onConfirm();
			setOpen(false);
		},
		[onConfirm, isClickable],
	);

	const handleCancelClick = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			setOpen(false);
			onCancel?.();
		},
		[onCancel],
	);

	return (
		<div ref={containerReference} className="relative inline-flex items-center justify-center">
			<AnimatePresence mode="popLayout" initial={false}>
				{open ? (
					<motion.div
						key="group"
						layoutId={layoutId}
						role="group"
						aria-label={`Delete confirmation for ${itemName}`}
						transition={springCritical}
						style={{ borderRadius: 8 }}
						className={cn(
							`flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-black bg-white p-1 shadow-brutal-sm dark:border-white dark:bg-black`,
							className,
						)}
						onClick={(event) => event.stopPropagation()}
						onKeyDown={handleKeyDown}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.15 }}
							className="flex items-center gap-1.5"
						>
							<button
								ref={confirmButtonReference}
								type="button"
								tabIndex={0}
								disabled={!isClickable || isLoading}
								onClick={handleConfirmClick}
								className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-black bg-red/10 text-red transition-all hover:bg-red hover:text-white disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:bg-red/20"
								aria-label={`Confirm delete ${itemName}`}
							>
								{isLoading ? <Spinner size="sm" className="size-4" /> : <Trash className="size-4" />}
							</button>
							<button
								ref={cancelButtonReference}
								type="button"
								tabIndex={0}
								disabled={isLoading}
								onClick={handleCancelClick}
								className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-black bg-zinc/10 text-black transition-all hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:bg-zinc/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
								aria-label={`Cancel delete ${itemName}`}
							>
								<X className="size-4" />
							</button>
						</motion.div>
					</motion.div>
				) : (
					<motion.div
						key="trigger"
						layoutId={layoutId}
						transition={springCritical}
						style={{ borderRadius: 8 }}
						className="inline-flex items-center justify-center border-2 border-transparent"
					>
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								setOpen(true);
							}}
							className="flex size-9 cursor-pointer items-center justify-center rounded-md border-2 border-transparent text-black transition-all hover:border-black hover:bg-muted active:translate-y-0.5 dark:text-white dark:hover:border-white dark:hover:bg-zinc"
							aria-label={`Delete ${itemName}`}
						>
							<motion.span
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.15 }}
								className="flex items-center justify-center"
							>
								<Trash className="size-5" />
							</motion.span>
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

InlineConfirmGroup.displayName = 'InlineConfirmGroup';

import { Trash, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, Transition } from 'motion/react';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState, useId } from 'react';

import { cn } from '@/lib/utilities';

import { Spinner } from './spinner';

export type InlineConfirmGroupDirection = 'left' | 'right';

export interface InlineConfirmGroupProperties {
	readonly itemName: string;
	readonly onConfirm: () => void;
	readonly onCancel?: () => void;
	readonly className?: string;
	readonly isLoading?: boolean;
	readonly direction?: InlineConfirmGroupDirection;
}

const spring: Transition = {
	type: 'spring',
	stiffness: 700,
	damping: 40,
};

export function InlineConfirmGroup({
	itemName,
	onConfirm,
	onCancel,
	className,
	isLoading = false,
	direction = 'left',
}: InlineConfirmGroupProperties) {
	const [open, setOpen] = useState(false);
	const containerReference = useRef<HTMLDivElement>(null);
	const confirmButtonReference = useRef<HTMLButtonElement>(null);
	const cancelButtonReference = useRef<HTMLButtonElement>(null);
	const layoutId = useId();
	const groupPositionClassName = direction === 'left' ? 'right-0 origin-right' : 'left-0 origin-left';
	const triggerOriginClassName = direction === 'left' ? 'origin-right' : 'origin-left';
	const transformOrigin = direction;

	// Auto-focus cancel button on mount so the user has immediate focus there
	useEffect(() => {
		if (!open) return;
		cancelButtonReference.current?.focus();

		function handlePointerDown(event: PointerEvent) {
			if (!(event.target instanceof Node)) return;
			if (!containerReference.current?.contains(event.target)) {
				setOpen(false);
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
			onConfirm();
			setOpen(false);
		},
		[onConfirm],
	);

	const handleCancelClick = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			setOpen(false);
			onCancel?.();
		},
		[onCancel],
	);
	const confirmButton = (
		<button
			key="confirm"
			ref={confirmButtonReference}
			type="button"
			tabIndex={0}
			disabled={isLoading}
			onClick={handleConfirmClick}
			className="neo-focus-ring isolate flex size-7 cursor-pointer items-center justify-center rounded-md border border-black bg-red/10 text-red outline-hidden transition-all select-none hover:bg-red hover:text-white disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:bg-red/20"
			aria-label={`Confirm delete ${itemName}`}
		>
			<Trash className="size-4" />
		</button>
	);
	const cancelButton = (
		<button
			key="cancel"
			ref={cancelButtonReference}
			type="button"
			tabIndex={0}
			disabled={isLoading}
			onClick={handleCancelClick}
			className="neo-focus-ring isolate flex size-7 cursor-pointer items-center justify-center rounded-md border border-black bg-zinc/10 text-black outline-hidden transition-all select-none hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:bg-zinc/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
			aria-label={`Cancel delete ${itemName}`}
		>
			<X className="size-4" />
		</button>
	);
	const confirmationButtons = direction === 'left' ? [confirmButton, cancelButton] : [cancelButton, confirmButton];

	return (
		<div ref={containerReference} className="relative inline-flex size-9 items-center justify-center">
			<AnimatePresence mode="popLayout" initial={false}>
				{open ? (
					<motion.div
						key="group"
						layoutId={layoutId}
						layoutDependency={open}
						role="group"
						aria-label={`Delete confirmation for ${itemName}`}
						transition={spring}
						style={{ borderRadius: 8, transformOrigin }}
						className={cn(
							`absolute top-1/2 z-10 flex shrink-0 -translate-y-1/2 items-center gap-1.5 rounded-lg border-2 border-black bg-white p-1 shadow-cel-sm dark:bg-zinc`,
							groupPositionClassName,
							className,
						)}
						onClick={(event) => event.stopPropagation()}
						onKeyDown={handleKeyDown}
					>
						{confirmationButtons}
					</motion.div>
				) : (
					<motion.div
						key="trigger"
						layoutId={layoutId}
						layoutDependency={open}
						transition={spring}
						style={{ borderRadius: 8, transformOrigin }}
						className={cn('inline-flex size-9 items-center justify-center border-2 border-transparent', triggerOriginClassName)}
					>
						<button
							type="button"
							disabled={isLoading}
							onClick={(event) => {
								event.stopPropagation();
								setOpen(true);
							}}
							className="neo-focus-ring isolate flex size-9 cursor-pointer items-center justify-center rounded-md border-2 border-transparent text-black outline-hidden transition-all select-none hover:border-black hover:bg-muted active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:border-white dark:hover:bg-zinc"
							aria-label={`Delete ${itemName}`}
						>
							{isLoading ? <Spinner size="sm" className="size-5" /> : <Trash className="size-5" />}
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

InlineConfirmGroup.displayName = 'InlineConfirmGroup';

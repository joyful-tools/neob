import { AnimatePresence, motion, type Transition } from 'motion/react';
import { useCallback, useEffect, useId, useState } from 'react';

import { cn } from '@/lib/utilities';

import { Button } from './button';

import type { ButtonProperties } from './button';
import type { ReactNode } from 'react';

interface ConfirmButtonProperties {
	children: ReactNode;
	title: string;
	description?: string;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => Promise<void> | void;
	variant?: ButtonProperties['variant'];
	size?: ButtonProperties['size'];
	confirmVariant?: ButtonProperties['variant'];
	className?: string;
	disabled?: boolean;
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
	const [containerElement, setContainerElement] = useState<HTMLDivElement | undefined>();
	const [confirmButtonElement, setConfirmButtonElement] = useState<HTMLButtonElement | undefined>();
	const [open, setOpen] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const titleId = useId();
	const descriptionId = useId();
	const layoutId = useId();

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen && isConfirming) {
				return;
			}

			setOpen(nextOpen);
		},
		[isConfirming],
	);

	useEffect(() => {
		if (!open) return;

		confirmButtonElement?.focus();

		function handlePointerDown(event: PointerEvent) {
			if (!(event.target instanceof Node)) {
				return;
			}

			if (!containerElement?.contains(event.target)) {
				handleOpenChange(false);
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				handleOpenChange(false);
			}
		}

		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [confirmButtonElement, containerElement, handleOpenChange, open]);

	async function handleConfirm() {
		setIsConfirming(true);
		try {
			await onConfirm();
			setOpen(false);
		} finally {
			setIsConfirming(false);
		}
	}

	return (
		<div ref={(element) => setContainerElement(element ?? undefined)} className="relative inline-flex items-center justify-center">
			<AnimatePresence initial={false}>
				{open ? (
					<motion.div
						key="popover"
						layoutId={layoutId}
						layoutDependency={open}
						role="dialog"
						aria-modal="false"
						aria-labelledby={titleId}
						aria-describedby={description ? descriptionId : undefined}
						transition={springOpen}
						style={{ borderRadius: 12 }}
						className={cn(
							`absolute z-20 flex min-w-56 flex-col items-center rounded-xl border-2 border-black bg-white p-3 text-black shadow-cel-md dark:bg-zinc dark:text-white`,
							'origin-center',
						)}
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
								type="button"
								variant="subtle"
								size="sm"
								disabled={isConfirming}
								onClick={() => handleOpenChange(false)}
								className="h-7 px-3"
							>
								{cancelLabel}
							</Button>
							<Button
								ref={(element) => setConfirmButtonElement(element ?? undefined)}
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
				) : (
					<motion.div
						key="trigger"
						layoutId={layoutId}
						layoutDependency={open}
						transition={springClose}
						className="inline-flex items-center justify-center border-2 border-transparent"
						style={{ borderRadius: 8 }}
					>
						<Button type="button" variant={variant} size={size} className={className} disabled={disabled} onClick={() => setOpen(true)}>
							{children}
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

import { TrashIcon, XIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, Transition } from 'motion/react';
import { cloneElement, KeyboardEvent, MouseEvent, ReactElement, useCallback, useEffect, useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useQueuedAction } from '@/hooks/use-queued-action';
import { afterAction } from '@/lib/actions';
import { cn } from '@/lib/utilities';

import type { ButtonProperties } from '@/components/ui/button';
import type { Action } from '@/lib/actions';

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
	const [open, setOpen] = useState(false);
	const [transitionId, setTransitionId] = useState(0);
	const [triggerSize, setTriggerSize] = useState<{ width: number; height: number } | null>(null);
	const containerReference = useRef<HTMLDivElement>(null);
	const triggerButtonReference = useRef<HTMLButtonElement>(null);
	const confirmButtonReference = useRef<HTMLButtonElement>(null);
	const cancelButtonReference = useRef<HTMLButtonElement>(null);
	const layoutId = useId();
	const groupPositionClassName = direction === 'left' ? 'right-0 origin-right' : 'left-0 origin-left';
	const triggerOriginClassName = direction === 'left' ? 'origin-right' : 'origin-left';
	const transformOrigin = direction;
	const actionLabelLowercase = actionLabel.toLowerCase();
	const { runAction, isPending } = useQueuedAction(() => afterAction(action(), () => setOpen(false)));
	const renderActionIcon = useCallback(
		(sizeClassName: string) => cloneElement(actionIcon, { className: cn(sizeClassName, actionIcon.props.className) }),
		[actionIcon],
	);

	useEffect(() => {
		const triggerButton = triggerButtonReference.current;
		if (open || !triggerButton) return;

		const updateTriggerSize = () => {
			setTriggerSize({ width: triggerButton.offsetWidth, height: triggerButton.offsetHeight });
		};
		const resizeObserver = new ResizeObserver(updateTriggerSize);

		updateTriggerSize();
		resizeObserver.observe(triggerButton);
		return () => resizeObserver.disconnect();
	}, [open]);

	// Auto-focus cancel button on mount so the user has immediate focus there
	useEffect(() => {
		if (!open || isPending) return;
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
	}, [open, isPending, onCancel]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (isPending) return;

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
		[isPending, onCancel],
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
			setOpen(false);
			onCancel?.();
		},
		[onCancel],
	);
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
		<div
			ref={containerReference}
			className="relative inline-flex items-center justify-center"
			style={open && triggerSize ? { width: triggerSize.width, height: triggerSize.height } : undefined}
		>
			<AnimatePresence mode="popLayout" initial={false}>
				{open ? (
					<motion.div
						key={`group-${transitionId}`}
						layoutId={layoutId}
						layoutCrossfade={false}
						layoutDependency={open}
						role="group"
						aria-label={`${actionLabel} confirmation for ${itemName}`}
						aria-busy={isPending || undefined}
						data-pending={isPending ? '' : undefined}
						transition={spring}
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeOut' } }}
						style={{ borderRadius: 8, transformOrigin }}
						className={cn(
							`absolute top-1/2 z-10 flex shrink-0 -translate-y-1/2 items-center gap-1.5 rounded-lg border-2 border-edge bg-white p-1 shadow-sm dark:bg-zinc`,
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
						key={`trigger-${transitionId}`}
						layoutId={layoutId}
						layoutCrossfade={false}
						layoutDependency={open}
						transition={spring}
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeOut' } }}
						style={{ borderRadius: 8, transformOrigin }}
						className={cn('inline-flex items-center justify-center', triggerOriginClassName)}
					>
						<Button
							ref={triggerButtonReference}
							type="button"
							variant={variant}
							color={color}
							size={size}
							disabled={isPending}
							action={(event) => {
								event.stopPropagation();
								setTransitionId((current) => current + 1);
								setOpen(true);
							}}
							aria-label={`${actionLabel} ${itemName}`}
						>
							{renderActionIcon('size-5')}
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

InlineConfirmGroup.displayName = 'InlineConfirmGroup';

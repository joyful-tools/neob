import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

import { buttonVariants } from './button';
import { useDialogStackPresence } from './dialog-stack';

// ============================================================================
// Constants
// ============================================================================

const OVERLAY_CLASS_NAME = `
	fixed inset-0 z-50 bg-black/50 backdrop-blur-xs
	data-[closed]:animate-overlay-out
	data-[open]:animate-overlay-in
`;

const CONTENT_CLASS_NAME = `
	relative grid w-full max-w-[calc(100vw-2rem)] gap-4 rounded-xl
	border-4 border-black bg-white dark:bg-zinc p-6 shadow-brutal
	sm:max-w-lg dark:text-white
`;

const MOTION_VARIANTS = {
	initial: { opacity: 0, scale: 1.08 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 1.08 },
} as const;

const springSnappy = {
	type: 'spring',
	stiffness: 550,
	damping: 28,
} as const;

// ============================================================================
// Context
// ============================================================================

const DialogContext = createContext<{ open: boolean; isComposed?: boolean }>({ open: false });

// ============================================================================
// Types
// ============================================================================

interface DialogProperties {
	readonly children?: React.ReactNode;
	readonly open?: boolean;
	readonly defaultOpen?: boolean;
	readonly onOpenChange?: (open: boolean) => void;
	readonly title?: string;
	readonly className?: string;
	readonly hideClose?: boolean;
}

interface DialogContentProperties {
	readonly ref?: React.Ref<HTMLDivElement>;
	readonly className?: string;
	readonly children?: React.ReactNode;
	readonly onAnimationEnd?: () => void;
}

interface DialogTitleProperties {
	readonly ref?: React.Ref<HTMLHeadingElement>;
	readonly className?: string;
	readonly children?: React.ReactNode;
}

interface DialogDescriptionProperties {
	readonly ref?: React.Ref<HTMLParagraphElement>;
	readonly className?: string;
	readonly children?: React.ReactNode;
}

// ============================================================================
// Components
// ============================================================================

/** Dialog root supporting compound pattern or composed modal pattern. */
function DialogRoot({
	children,
	open: controlledOpen,
	defaultOpen,
	onOpenChange,
	title,
	className,
	hideClose = false,
	...properties
}: DialogProperties) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
	const actionsReference = useRef<DialogPrimitive.Root.Actions>(null);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!isControlled) {
				setUncontrolledOpen(nextOpen);
			}
			onOpenChange?.(nextOpen);
		},
		[isControlled, onOpenChange],
	);

	useDialogStackPresence(open, () => handleOpenChange(false));

	if (title !== undefined) {
		return (
			<DialogContext.Provider value={{ open, isComposed: true }}>
				<DialogPrimitive.Root open={open} onOpenChange={handleOpenChange} actionsRef={actionsReference} {...properties}>
					<DialogContent className={cn('gap-0 p-0', className)}>
						<DialogHeader className="border-b-2 border-black px-6 py-4" hideClose={hideClose}>
							<DialogTitle>{title}</DialogTitle>
						</DialogHeader>
						{children}
					</DialogContent>
				</DialogPrimitive.Root>
			</DialogContext.Provider>
		);
	}

	return (
		<DialogContext.Provider value={{ open, isComposed: false }}>
			<DialogPrimitive.Root open={open} onOpenChange={handleOpenChange} actionsRef={actionsReference} {...properties}>
				{children}
			</DialogPrimitive.Root>
		</DialogContext.Provider>
	);
}
DialogRoot.displayName = 'Dialog';

const DialogTrigger = DialogPrimitive.Trigger;

/** Dialog content with animated overlay and panel. */
function DialogContent({ className, children, ref, onAnimationEnd, ...properties }: DialogContentProperties) {
	const { open } = useContext(DialogContext);

	return (
		<AnimatePresence>
			{open && (
				<DialogPrimitive.Portal keepMounted>
					<DialogPrimitive.Backdrop className={OVERLAY_CLASS_NAME} />
					<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
						<DialogPrimitive.Popup
							ref={ref}
							render={
								<motion.div
									className={cn(CONTENT_CLASS_NAME, className)}
									initial={MOTION_VARIANTS.initial}
									animate={MOTION_VARIANTS.animate}
									exit={MOTION_VARIANTS.exit}
									transition={springSnappy}
									onAnimationComplete={() => !open && onAnimationEnd?.()}
								/>
							}
							{...properties}
						>
							{children}
						</DialogPrimitive.Popup>
					</div>
				</DialogPrimitive.Portal>
			)}
		</AnimatePresence>
	);
}
DialogContent.displayName = 'Dialog.Content';

/** Dialog header with title area and close button. */
function DialogHeader({
	className,
	children,
	hideClose = false,
	...properties
}: React.HTMLAttributes<HTMLDivElement> & { readonly hideClose?: boolean }) {
	return (
		<div className={cn('flex flex-row items-start justify-between gap-4', className)} {...properties}>
			<div className="flex flex-1 flex-col space-y-1.5 text-center sm:text-left">{children}</div>
			{!hideClose && (
				<DialogPrimitive.Close className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), '-mt-3 -mr-3 shrink-0')}>
					<X className="size-4" />
					<span className="sr-only">Close</span>
				</DialogPrimitive.Close>
			)}
		</div>
	);
}
DialogHeader.displayName = 'Dialog.Header';

/** Dialog body for composed modals. */
function DialogBody({
	children,
	className,
	ref,
}: {
	readonly children: React.ReactNode;
	readonly className?: string;
	readonly ref?: React.Ref<HTMLDivElement>;
}) {
	return (
		<div ref={ref} className={cn('p-6', className)}>
			{children}
		</div>
	);
}
DialogBody.displayName = 'Dialog.Body';

/** Dialog footer for action buttons. */
function DialogFooter({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
	const { isComposed } = useContext(DialogContext);
	return (
		<div
			className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', isComposed && 'border-t-2 border-black px-6 py-4', className)}
			{...properties}
		/>
	);
}
DialogFooter.displayName = 'Dialog.Footer';

/** Dialog title text. */
function DialogTitle({ className, ref, ...properties }: DialogTitleProperties) {
	return (
		<DialogPrimitive.Title
			ref={ref}
			className={cn('font-display text-2xl leading-none font-bold tracking-tight', className)}
			{...properties}
		/>
	);
}
DialogTitle.displayName = 'Dialog.Title';

/** Dialog description text. */
function DialogDescription({ className, ref, ...properties }: DialogDescriptionProperties) {
	return <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...properties} />;
}
DialogDescription.displayName = 'Dialog.Description';

const DialogClose = DialogPrimitive.Close;

export const Dialog = Object.assign(DialogRoot, {
	Trigger: DialogTrigger,
	Content: DialogContent,
	Header: DialogHeader,
	Footer: DialogFooter,
	Title: DialogTitle,
	Description: DialogDescription,
	Close: DialogClose,
	Body: DialogBody,
});

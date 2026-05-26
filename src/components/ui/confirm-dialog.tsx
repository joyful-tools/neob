import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import { Check, Copy } from '@phosphor-icons/react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { useState, type ReactNode } from 'react';

import { useDeferredOpen } from '@/hooks/use-deferred-open';
import { cn } from '@/lib/utilities';

import { Button } from './button';
import { useDialogStackPresence } from './dialog-stack';

export interface ConfirmDialogProperties {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
	variant?: 'default' | 'danger' | 'warning';
	resourceName?: string;
	isConfirming?: boolean;
}

const springSnappy: Transition = {
	type: 'spring',
	stiffness: 550,
	damping: 28,
};

const modalContentVariants = {
	hidden: { opacity: 0, scale: 1.08 },
	visible: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 1.08 },
};

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	onConfirm,
	variant = 'default',
	resourceName,
	isConfirming = false,
}: ConfirmDialogProperties) {
	const { dialogOpen, show, onExitComplete } = useDeferredOpen(open);
	useDialogStackPresence(open);

	const [typedConfirmation, setTypedConfirmation] = useState('');
	const [copied, setCopied] = useState(false);

	const confirmationMatches = resourceName ? typedConfirmation === resourceName : true;

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			setTypedConfirmation('');
			setCopied(false);
		}
		onOpenChange(nextOpen);
	}

	function handleCopyResourceName() {
		if (!resourceName) return;
		void navigator.clipboard.writeText(resourceName).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}

	return (
		<AlertDialogPrimitive.Root open={dialogOpen} onOpenChange={handleOpenChange}>
			{dialogOpen && (
				<AlertDialogPrimitive.Portal keepMounted>
					<AnimatePresence onExitComplete={onExitComplete}>
						{show && (
							<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
								<AlertDialogPrimitive.Popup
									render={
										<motion.div variants={modalContentVariants} initial="hidden" animate="visible" exit="exit" transition={springSnappy} />
									}
									className={cn(
										`relative grid w-full max-w-[calc(100vw-2rem)] gap-4 rounded-xl border-4 border-black bg-white p-6 shadow-brutal sm:max-w-lg dark:bg-zinc dark:text-white`,
									)}
								>
									<div className="border-b-2 border-black pb-3">
										<AlertDialogPrimitive.Title className="font-display text-xl font-bold tracking-tight text-black dark:text-white">
											{title}
										</AlertDialogPrimitive.Title>
									</div>
									<div className="py-2">
										<AlertDialogPrimitive.Description className="text-sm/relaxed text-black/80 dark:text-white/80">
											{description}
										</AlertDialogPrimitive.Description>

										{resourceName && (
											<div className="mt-4 space-y-3">
												<p className="text-sm text-black/80 dark:text-white/80">
													Type in{' '}
													<Button
														type="button"
														variant="subtle"
														size="sm"
														onClick={handleCopyResourceName}
														className="h-6 px-2 font-mono text-xs"
													>
														{resourceName}
														{copied ? <Check className="size-3 text-green" /> : <Copy className="size-3" />}
													</Button>{' '}
													to confirm:
												</p>
												<input
													type="text"
													value={typedConfirmation}
													onChange={(event) => setTypedConfirmation(event.target.value)}
													onKeyDown={(event) => {
														if (event.key === 'Enter' && confirmationMatches && !isConfirming) {
															onConfirm();
														}
													}}
													disabled={isConfirming}
													placeholder={resourceName}
													autoComplete="off"
													className={cn(
														`h-10 w-full rounded-md border-2 border-black bg-white px-3 text-sm text-black shadow-brutal-inset-sm transition-all placeholder:text-black/40 focus:ring-2 focus:ring-orange focus:outline-none dark:bg-zinc dark:text-white`,
													)}
												/>
											</div>
										)}
									</div>
									<div className="flex flex-col-reverse gap-2 border-t-2 border-black pt-3 sm:flex-row sm:justify-end">
										<Button type="button" variant="subtle" onClick={() => handleOpenChange(false)} disabled={isConfirming}>
											{cancelLabel}
										</Button>
										<Button
											type="button"
											onClick={onConfirm}
											disabled={!confirmationMatches}
											variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'accent' : 'default'}
											isLoading={isConfirming}
										>
											{confirmLabel}
										</Button>
									</div>
								</AlertDialogPrimitive.Popup>
							</div>
						)}
					</AnimatePresence>
				</AlertDialogPrimitive.Portal>
			)}
		</AlertDialogPrimitive.Root>
	);
}

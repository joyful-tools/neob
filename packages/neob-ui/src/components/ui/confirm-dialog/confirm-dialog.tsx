import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useQueuedAction } from '@/hooks/use-queued-action';
import { afterAction } from '@/lib/actions';

import type { Action } from '@/lib/actions';

export interface ConfirmDialogProperties {
	readonly open: boolean;
	readonly onOpenChange: (open: boolean) => void;
	readonly title: string;
	readonly description: ReactNode;
	readonly confirmLabel?: string;
	readonly cancelLabel?: string;
	readonly action: Action;
	readonly variant?: 'default' | 'danger' | 'warning';
	readonly resourceName?: string;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	action,
	variant = 'default',
	resourceName,
}: ConfirmDialogProperties) {
	const [typedConfirmation, setTypedConfirmation] = useState('');
	const [copied, setCopied] = useState(false);
	const inputId = useId();
	const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const cancelButtonRef = useRef<HTMLButtonElement>(null);
	const { runAction, isPending } = useQueuedAction(() => afterAction(action(), () => handleOpenChange(false)));

	useEffect(() => () => clearTimeout(copyTimeoutRef.current), []);

	useEffect(() => {
		if (open && !resourceName) {
			cancelButtonRef.current?.focus();
		}
	}, [open, resourceName]);

	const confirmationMatches = resourceName ? typedConfirmation === resourceName : true;

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			clearTimeout(copyTimeoutRef.current);
			setTypedConfirmation('');
			setCopied(false);
		}
		onOpenChange(nextOpen);
	}

	function handleCopyResourceName() {
		if (!resourceName) return;
		void navigator.clipboard.writeText(resourceName).then(() => {
			setCopied(true);
			clearTimeout(copyTimeoutRef.current);
			copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
		});
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange} preventClose>
			<Dialog.Content aria-busy={isPending || undefined} data-pending={isPending ? '' : undefined}>
				<Dialog.Header>
					<Dialog.Title>{title}</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<div className="flex flex-col gap-6">
						<Dialog.Description>{description}</Dialog.Description>
						{resourceName && (
							<div className="flex flex-col gap-3">
								<label htmlFor={inputId} className="text-sm text-black/80 dark:text-white/80">
									Enter{' '}
									<Button
										type="button"
										variant="subtle"
										size="sm"
										action={handleCopyResourceName}
										className="mx-0.5 h-6 px-2 font-mono text-xs"
									>
										{resourceName}
										{copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
									</Button>{' '}
									to confirm:
								</label>
								<Input
									id={inputId}
									type="text"
									value={typedConfirmation}
									onChange={(event) => setTypedConfirmation(event.target.value)}
									onKeyDown={(event) => {
										if (event.key === 'Enter' && confirmationMatches && !isPending) {
											void runAction().catch(() => {});
										}
									}}
									disabled={isPending}
									placeholder={resourceName}
									autoComplete="off"
									className="rounded-md px-3 text-sm shadow-cel-inset-sm"
								/>
							</div>
						)}
					</div>
				</Dialog.Body>
				<Dialog.Footer>
					<Button ref={cancelButtonRef} type="button" variant="subtle" action={() => handleOpenChange(false)} disabled={isPending}>
						{cancelLabel}
					</Button>
					<Button
						type="button"
						action={runAction}
						disabled={!confirmationMatches}
						variant={variant === 'danger' ? 'danger' : 'default'}
						color={variant === 'warning' ? 'gold' : undefined}
					>
						{confirmLabel}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog>
	);
}
ConfirmDialog.displayName = 'ConfirmDialog';

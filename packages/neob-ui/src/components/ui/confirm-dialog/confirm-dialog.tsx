import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export interface ConfirmDialogProperties {
	readonly open: boolean;
	readonly onOpenChange: (open: boolean) => void;
	readonly title: string;
	readonly description: ReactNode;
	readonly confirmLabel?: string;
	readonly cancelLabel?: string;
	readonly onConfirm: () => void;
	readonly variant?: 'default' | 'danger' | 'warning';
	readonly resourceName?: string;
	readonly isConfirming?: boolean;
}

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
		<Dialog open={open} onOpenChange={handleOpenChange} preventClose>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>{title}</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<div className="flex flex-col gap-6">
						<Dialog.Description>{description}</Dialog.Description>
						{resourceName && (
							<div className="flex flex-col gap-3">
								<p className="text-sm text-black/80 dark:text-white/80">
									Type in{' '}
									<Button
										type="button"
										variant="subtle"
										size="sm"
										onClick={handleCopyResourceName}
										className="mx-0.5 h-6 px-2 font-mono text-xs"
									>
										{resourceName}
										{copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
									</Button>{' '}
									to confirm:
								</p>
								<Input
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
									className="rounded-md px-3 text-sm shadow-cel-inset-sm"
								/>
							</div>
						)}
					</div>
				</Dialog.Body>
				<Dialog.Footer>
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
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog>
	);
}

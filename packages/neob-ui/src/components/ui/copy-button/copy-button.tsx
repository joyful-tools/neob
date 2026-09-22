import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { ButtonHTMLAttributes, MouseEvent, Ref, useEffect, useRef, useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utilities';

const COPIED_FEEDBACK_DURATION = 2000;

export interface CopyButtonProperties extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> {
	readonly text: string;
	readonly copyLabel?: string;
	readonly copiedLabel?: string;
	readonly ref?: Ref<HTMLButtonElement>;
}

export function CopyButton({
	text,
	copyLabel = 'Copy to clipboard',
	copiedLabel = 'Copied to clipboard',
	className,
	onClick,
	type,
	title,
	ref,
	'aria-label': ariaLabel,
	...properties
}: CopyButtonProperties) {
	const [isCopied, setIsCopied] = useState(false);
	const resetTimeoutReference = useRef<ReturnType<typeof setTimeout>>(undefined);
	const isMountedReference = useRef(true);

	useEffect(() => {
		isMountedReference.current = true;
		return () => {
			isMountedReference.current = false;
			globalThis.clearTimeout(resetTimeoutReference.current);
		};
	}, []);

	const copyText = async () => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			return;
		}
		if (!isMountedReference.current) return;

		globalThis.clearTimeout(resetTimeoutReference.current);
		setIsCopied(true);
		resetTimeoutReference.current = globalThis.setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_DURATION);
	};

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		onClick?.(event);
		if (event.defaultPrevented) return;
		void copyText();
	};

	const currentLabel = isCopied ? copiedLabel : copyLabel;

	return (
		<button
			{...properties}
			ref={ref}
			type={type ?? 'button'}
			className={cn(
				buttonVariants({ variant: 'ghost', size: 'icon' }),
				'size-7 shrink-0 rounded-md border text-muted-foreground transition-colors [--focus-ring-inner-size:var(--focus-ring-compact-inner-size)] [--focus-ring-outer-size:var(--focus-ring-compact-outer-size)] hover:bg-muted hover:text-foreground disabled:cursor-not-allowed',
				className,
			)}
			onClick={handleClick}
			data-copied={isCopied ? '' : undefined}
			aria-label={ariaLabel ?? currentLabel}
			title={title ?? currentLabel}
		>
			{isCopied ? (
				<CheckIcon aria-hidden="true" className="size-3.5 text-green-dark dark:text-green" />
			) : (
				<CopyIcon aria-hidden="true" className="size-3.5" />
			)}
		</button>
	);
}
CopyButton.displayName = 'CopyButton';

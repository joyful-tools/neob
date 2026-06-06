import { type HTMLAttributes, type ReactNode, type Ref } from 'react';

import { cn } from '@/lib/utilities';

export interface TextErrorProperties extends HTMLAttributes<HTMLSpanElement> {
	readonly ref?: Ref<HTMLSpanElement>;
	readonly children: ReactNode;
}

/**
 * TextError applies a wavy red underline to text to indicate errors, spelling mistakes, or issues.
 */
export function TextError({ children, className, ref, ...properties }: TextErrorProperties) {
	return (
		<span
			ref={ref}
			className={cn('underline decoration-red decoration-wavy underline-offset-[0.15em] [text-decoration-skip-ink:none]', className)}
			{...properties}
		>
			{children}
		</span>
	);
}
TextError.displayName = 'TextError';

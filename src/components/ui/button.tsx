import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { buttonVariants } from './button-variants';
import { Spinner } from './spinner';

export interface ButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

/**
 * Minimal Slot implementation: renders the single child element,
 * merging the parent's props (className, style, ref, etc.) onto it.
 * Replaces the Radix `Slot` primitive for the `asChild` pattern.
 */
function Slot({ children, ...properties }: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }) {
	if (React.isValidElement<Record<string, unknown>>(children)) {
		const childProperties = children.props;
		return React.cloneElement(children, {
			...properties,
			...childProperties,
			className: cn(properties.className, String(childProperties.className ?? '')),
		});
	}
	return <>{children}</>;
}

export function Button({
	className,
	variant,
	size,
	asChild = false,
	isLoading = false,
	children,
	disabled,
	ref,
	...properties
}: ButtonProperties & { ref?: React.Ref<HTMLButtonElement> }) {
	const Comp = asChild ? Slot : 'button';
	const isDisabledOrLoading = disabled || isLoading;

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }), isLoading && 'relative')}
			ref={ref}
			disabled={isDisabledOrLoading}
			{...properties}
		>
			{asChild ? (
				children
			) : (
				<>
					<span className={cn('inline-flex items-center gap-2', isLoading && 'invisible')}>{children}</span>
					{isLoading && (
						<span className="absolute inset-0 flex items-center justify-center">
							<Spinner className="size-4" />
						</span>
					)}
				</>
			)}
		</Comp>
	);
}
Button.displayName = 'Button';

export { buttonVariants } from './button-variants';

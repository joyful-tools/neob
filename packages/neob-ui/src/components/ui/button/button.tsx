import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, isValidElement, Ref } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utilities';

import { buttonVariants } from './button-variants';

export interface ButtonProperties extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	readonly asChild?: boolean;
	readonly isLoading?: boolean;
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
}: ButtonProperties & { ref?: Ref<HTMLButtonElement> }) {
	const isDisabledOrLoading = disabled || isLoading;
	const buttonClass = cn(buttonVariants({ variant, size, className }), isLoading && 'relative');

	if (asChild && isValidElement(children)) {
		return <BaseButton ref={ref} disabled={isDisabledOrLoading} className={buttonClass} render={children} {...properties} />;
	}

	return (
		<BaseButton ref={ref} disabled={isDisabledOrLoading} className={buttonClass} {...properties}>
			<span className={cn('inline-flex items-center gap-2', isLoading && 'opacity-0')}>{children}</span>
			{isLoading && (
				<span className="absolute inset-0 flex items-center justify-center">
					<Spinner className="size-4" />
				</span>
			)}
		</BaseButton>
	);
}
Button.displayName = 'Button';

export { buttonVariants } from './button-variants';

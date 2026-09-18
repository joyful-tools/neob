import { Button as BaseButton } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';
import { type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import { ButtonHTMLAttributes, isValidElement, MouseEvent, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { Spinner } from '@/components/ui/spinner';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useQueuedAction } from '@/hooks/use-queued-action';
import { cn } from '@/lib/utilities';

import { buttonVariants } from './button-variants';

import type { Action } from '@/lib/actions';

export interface ButtonProperties
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'onClick'>, VariantProps<typeof buttonVariants> {
	readonly asChild?: boolean;
	readonly action?: Action<[event: MouseEvent<HTMLButtonElement>]>;
}

export function Button({
	className,
	variant,
	color,
	size,
	asChild = false,
	action,
	children,
	disabled,
	type,
	ref,
	...properties
}: ButtonProperties & { ref?: Ref<HTMLButtonElement> }) {
	const { pending: isFormPending } = useFormStatus();
	const prefersReducedMotion = usePrefersReducedMotion();
	const { runAction, isPending: isActionPending } = useQueuedAction(action);
	const isSubmitButton = type === undefined || type === 'submit';
	const isPending = isActionPending || (isSubmitButton && isFormPending);
	const isDisabledOrPending = disabled || isPending;
	const buttonClass = cn(buttonVariants({ variant, color, size, className }), isPending && 'relative');
	const handleClick = action
		? (event: MouseEvent<HTMLButtonElement>) => {
				void runAction(event).catch(() => {});
			}
		: undefined;
	const mergedProperties = mergeProps({ onClick: handleClick }, properties);

	if (asChild && isValidElement(children)) {
		return (
			<BaseButton
				ref={ref}
				disabled={isDisabledOrPending}
				className={buttonClass}
				render={children}
				aria-busy={isPending || undefined}
				data-pending={isPending ? '' : undefined}
				{...mergedProperties}
			/>
		);
	}

	return (
		<BaseButton
			ref={ref}
			type={type}
			disabled={isDisabledOrPending}
			className={buttonClass}
			aria-busy={isPending || undefined}
			data-pending={isPending ? '' : undefined}
			{...mergedProperties}
		>
			<span
				className={cn(
					'inline-flex items-center gap-2 transition-opacity duration-150 ease-out motion-reduce:transition-none',
					isPending ? 'opacity-0 delay-100' : 'opacity-100 delay-0',
				)}
			>
				{children}
			</span>
			<AnimatePresence initial={false}>
				{isPending && (
					<motion.span
						className="absolute inset-0 flex items-center justify-center"
						initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{
							opacity: 0,
							scale: prefersReducedMotion ? 1 : 0.9,
							transition: { duration: prefersReducedMotion ? 0 : 0.1 },
						}}
						transition={{ duration: prefersReducedMotion ? 0 : 0.15, delay: 0.1, ease: 'easeOut' }}
					>
						<Spinner className="size-4" />
					</motion.span>
				)}
			</AnimatePresence>
		</BaseButton>
	);
}
Button.displayName = 'Button';

export { buttonVariants } from './button-variants';

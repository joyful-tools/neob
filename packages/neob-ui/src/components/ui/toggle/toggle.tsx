import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { type VariantProps } from 'class-variance-authority';
import { isValidElement, ReactNode, Ref } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { useOptimisticAction } from '@/hooks/use-optimistic-action';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';

const TOGGLE_ON_CLASS_NAME = `
	data-[pressed]:bg-cyan data-[pressed]:text-black
	dark:data-[pressed]:text-black data-[pressed]:hover:bg-cyan/90
`;

interface ToggleProperties extends VariantProps<typeof buttonVariants> {
	readonly ref?: Ref<HTMLButtonElement>;
	readonly pressed?: boolean;
	readonly defaultPressed?: boolean;
	readonly action?: Action<[pressed: boolean, eventDetails: TogglePrimitive.ChangeEventDetails]>;
	readonly disabled?: boolean;
	readonly className?: string;
	readonly children?: ReactNode;
	readonly asChild?: boolean;
	readonly 'aria-label'?: string;
	readonly 'aria-pressed'?: boolean;
}

/** Toggle button with pressed/unpressed states. Wraps Base UI Toggle primitive. */
export function Toggle({
	className,
	variant = 'ghost',
	size = 'default',
	asChild = false,
	ref,
	children,
	pressed,
	defaultPressed = false,
	action,
	...properties
}: ToggleProperties) {
	const { optimisticValue, runAction, isPending } = useOptimisticAction({ value: pressed, defaultValue: defaultPressed, action });

	if (asChild && isValidElement<Record<string, unknown>>(children)) {
		return (
			<TogglePrimitive
				ref={ref}
				render={children}
				className={cn(buttonVariants({ variant, size }), TOGGLE_ON_CLASS_NAME, className)}
				pressed={optimisticValue}
				onPressedChange={runAction}
				aria-busy={isPending || undefined}
				data-pending={isPending ? '' : undefined}
				{...properties}
			/>
		);
	}

	return (
		<TogglePrimitive
			ref={ref}
			className={cn(buttonVariants({ variant, size }), TOGGLE_ON_CLASS_NAME, className)}
			pressed={optimisticValue}
			onPressedChange={runAction}
			aria-busy={isPending || undefined}
			data-pending={isPending ? '' : undefined}
			{...properties}
		>
			{children}
		</TogglePrimitive>
	);
}
Toggle.displayName = 'Toggle';

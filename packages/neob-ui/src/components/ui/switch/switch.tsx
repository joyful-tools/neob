import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { ComponentPropsWithoutRef, ReactNode, Ref, useId } from 'react';

import { cn } from '@/lib/utilities';

export interface SwitchProperties extends ComponentPropsWithoutRef<typeof BaseSwitch.Root> {
	readonly ref?: Ref<HTMLButtonElement>;
	readonly label?: ReactNode;
	readonly description?: ReactNode;
	readonly controlFirst?: boolean;
	readonly error?: string;
	readonly variant?: 'default' | 'accent' | 'success';
}

const VARIANT_ROOT_CLASSES = {
	default: `
		data-[checked]:bg-black dark:data-[checked]:bg-white
		data-[checked]:text-white dark:data-[checked]:text-black
	`,
	accent: `
		data-[checked]:bg-orange dark:data-[checked]:bg-orange
		data-[checked]:text-black
	`,
	success: `
		data-[checked]:bg-green dark:data-[checked]:bg-green
		data-[checked]:text-white dark:data-[checked]:text-black
	`,
} as const;

const SWITCH_ROOT_CLASSES = `
	peer relative isolate inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
	rounded-full border-2 border-edge bg-white shadow-cel-inset-sm transition-colors
	duration-300 ease-spring neo-focus-ring outline-hidden
	disabled:cursor-not-allowed disabled:opacity-50
	dark:bg-zinc
`;

const SWITCH_THUMB_CLASSES = `
	pointer-events-none block h-4 w-4 rounded-full border border-edge bg-black
	transition-transform duration-300 ease-spring translate-x-0.5
	data-[checked]:translate-x-[22px] data-[checked]:bg-white
	dark:bg-white dark:data-[checked]:bg-black
`;

/**
 * Sliding Switch toggle control component.
 * Supports multiple active variants (default black/white, accent orange, success green).
 */
export function Switch({
	label,
	description,
	controlFirst = true,
	error,
	variant = 'default',
	className,
	ref,
	...properties
}: SwitchProperties) {
	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const switchControl = (
		<BaseSwitch.Root
			ref={ref}
			className={cn(SWITCH_ROOT_CLASSES, VARIANT_ROOT_CLASSES[variant], error && 'border-red dark:border-red', className)}
			aria-describedby={describedBy}
			aria-invalid={hasError ? true : undefined}
			{...properties}
		>
			<BaseSwitch.Thumb className={SWITCH_THUMB_CLASSES} />
		</BaseSwitch.Root>
	);

	if (!label) {
		return switchControl;
	}

	return (
		<div className="flex flex-col gap-1.5">
			<label
				className={cn(
					'inline-flex items-start gap-4 select-none',
					properties.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
					!controlFirst && 'flex-row-reverse justify-end',
				)}
			>
				<span className="mt-0.5">{switchControl}</span>
				<div className="flex flex-col gap-0.5">
					<span className="text-base/tight font-bold text-black dark:text-white">{label}</span>
					{description && (
						<span id={descriptionId} className="text-xs/normal text-muted-foreground">
							{description}
						</span>
					)}
				</div>
			</label>
			{error && (
				<span id={errorId} className="pl-14 text-xs font-bold text-red-dark dark:text-red-light">
					{error}
				</span>
			)}
		</div>
	);
}
Switch.displayName = 'Switch';

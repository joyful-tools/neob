import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
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
		data-[checked]:bg-zinc dark:data-[checked]:bg-zinc-lighter
		data-[checked]:border-edge
	`,
	accent: `
		data-[checked]:bg-cyan dark:data-[checked]:bg-cyan-light
		data-[checked]:border-edge
	`,
	success: `
		data-[checked]:bg-green dark:data-[checked]:bg-green-light
		data-[checked]:border-edge
	`,
} as const;

const VARIANT_ICON_CLASSES = {
	default: 'text-zinc dark:text-zinc-lighter',
	accent: 'text-cyan-dark dark:text-cyan-light',
	success: 'text-green-dark dark:text-green-light',
} as const;

const SWITCH_ROOT_CLASSES = `
	group peer relative isolate inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
	rounded-md border border-edge bg-muted/80 shadow-cel-inset-sm transition-all
	duration-240 [transition-timing-function:cubic-bezier(0.2,1.15,0.3,1)] neo-focus-ring outline-hidden
	disabled:cursor-not-allowed disabled:opacity-50
	dark:bg-muted
`;

const SWITCH_THUMB_CLASSES = `
	pointer-events-none relative flex h-[24px] w-[23px] items-center justify-center rounded-md border border-edge bg-white
	shadow-cel-xs transition-all duration-240 [transition-timing-function:cubic-bezier(0.2,1.15,0.3,1)] -translate-x-px -translate-y-px
	group-data-[checked]:translate-x-5
	dark:bg-zinc
`;

/**
 * Sliding Switch toggle control component inspired by tactile S.C.R.A.P.S. design.
 * Supports multiple active variants (default neutral zinc, accent cyan, success green).
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
	const isInvalid = hasError || properties['aria-invalid'] === true || properties['aria-invalid'] === 'true';

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const switchControl = (
		<BaseSwitch.Root
			ref={ref}
			className={cn(
				SWITCH_ROOT_CLASSES,
				VARIANT_ROOT_CLASSES[variant],
				isInvalid && 'bg-red-light [--color-ring:var(--color-red)] dark:bg-red',
				className,
			)}
			aria-describedby={describedBy}
			aria-invalid={isInvalid ? true : undefined}
			{...properties}
		>
			<BaseSwitch.Thumb className={SWITCH_THUMB_CLASSES}>
				<span
					className={cn(
						'absolute inset-0 flex scale-100 items-center justify-center text-muted-foreground opacity-100 transition-all duration-120 ease-[cubic-bezier(0.2,1.15,0.3,1)] group-data-checked:scale-75 group-data-checked:opacity-0',
						error && 'text-red-dark dark:text-red-light',
					)}
				>
					<XIcon className="size-3.5" weight="bold" />
				</span>
				<span
					className={cn(
						'absolute inset-0 flex scale-75 items-center justify-center opacity-0 transition-all duration-120 ease-[cubic-bezier(0.2,1.15,0.3,1)] group-data-checked:scale-100 group-data-checked:opacity-100',
						VARIANT_ICON_CLASSES[variant],
					)}
				>
					<CheckIcon className="size-3.5" weight="bold" />
				</span>
			</BaseSwitch.Thumb>
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
					{error && (
						<span id={errorId} className="text-xs/normal font-bold text-red-dark dark:text-red-light">
							{error}
						</span>
					)}
				</div>
			</label>
		</div>
	);
}
Switch.displayName = 'Switch';

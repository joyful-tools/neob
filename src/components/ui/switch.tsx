import { Switch as BaseSwitch } from '@base-ui/react/switch';
import * as React from 'react';

import { cn } from '@/lib/utilities';

// ============================================================================
// Types
// ============================================================================

export interface SwitchProperties extends React.ComponentPropsWithoutRef<typeof BaseSwitch.Root> {
	readonly ref?: React.Ref<HTMLButtonElement>;
	readonly label?: React.ReactNode;
	readonly description?: React.ReactNode;
	readonly controlFirst?: boolean;
	readonly error?: string;
	readonly variant?: 'default' | 'accent' | 'success';
}

// ============================================================================
// Constants
// ============================================================================

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
	peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
	rounded-full border-2 border-black bg-white shadow-brutal-inset-sm transition-colors
	duration-300 ease-spring neo-focus-ring outline-hidden
	disabled:cursor-not-allowed disabled:opacity-50
	dark:bg-zinc
`;

const SWITCH_THUMB_CLASSES = `
	pointer-events-none block h-4 w-4 rounded-full border border-black bg-black
	transition-transform duration-300 ease-spring translate-x-0.5
	data-[checked]:translate-x-[22px] data-[checked]:bg-white
	dark:bg-white dark:data-[checked]:bg-black
`;

// ============================================================================
// Components
// ============================================================================

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
	const switchControl = (
		<BaseSwitch.Root
			ref={ref}
			className={cn(SWITCH_ROOT_CLASSES, VARIANT_ROOT_CLASSES[variant], error && 'border-red dark:border-red', className)}
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
					{description && <span className="text-xs/normal text-muted-foreground">{description}</span>}
				</div>
			</label>
			{error && <span className="pl-14 text-xs font-bold text-red dark:text-red">{error}</span>}
		</div>
	);
}
Switch.displayName = 'Switch';

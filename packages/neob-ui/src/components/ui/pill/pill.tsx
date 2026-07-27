import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utilities';

import type { HTMLAttributes, Ref } from 'react';

const pillVariants = cva(
	`
		inline-flex items-center justify-center border-2 border-edge
		leading-none font-bold tracking-wide transition-all
		select-none
	`,
	{
		variants: {
			size: {
				xs: 'gap-0.5 px-1 py-px text-[9px]',
				sm: 'gap-1 px-1.5 py-0.5 text-[10px]',
				md: 'gap-1.5 px-2 py-0.5 text-xs',
				lg: 'gap-2 px-3 py-1 text-sm',
			},
			rounded: {
				full: 'rounded-full',
				md: 'rounded-md',
				sm: 'rounded-sm',
			},
			color: {
				default: 'bg-foreground text-background',
				orange: 'bg-orange text-orange-darker dark:text-orange-lighter',
				gold: 'bg-gold text-gold-darker dark:text-gold-lighter',
				red: 'bg-red text-red-darker dark:text-red-lighter',
				green: 'bg-green text-green-darker dark:text-green-lighter',
				blue: 'bg-blue text-blue-darker dark:text-blue-lighter',
				purple: 'bg-purple text-purple-darker dark:text-purple-lighter',
				pink: 'bg-pink text-pink-darker dark:text-pink-lighter',
				yellow: 'bg-yellow text-yellow-darker dark:text-yellow-lighter',
				zinc: 'bg-zinc text-zinc-lighter dark:text-zinc-lighter',
				white: 'bg-white text-black',
			},
		},
		defaultVariants: {
			size: 'sm',
			rounded: 'full',
			color: 'default',
		},
	},
);

interface PillProperties extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof pillVariants> {
	readonly ref?: Ref<HTMLSpanElement>;
}

function Pill({ className, size, rounded, color, ref, ...properties }: PillProperties) {
	return <span className={cn(pillVariants({ size, rounded, color }), className)} ref={ref} {...properties} />;
}

Pill.displayName = 'Pill';

export { Pill };
export type { PillProperties };
export { pillVariants };

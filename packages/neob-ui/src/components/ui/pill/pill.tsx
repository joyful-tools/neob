import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utilities';

import type { HTMLAttributes, Ref } from 'react';

const pillVariants = cva(
	`
		inline-flex items-center justify-center border-2 border-black
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
				orange: 'bg-orange text-black dark:text-orange-light',
				gold: 'bg-gold text-black dark:text-gold-light',
				red: 'bg-red text-black dark:text-red-light',
				green: 'bg-green text-black dark:text-green-light',
				blue: 'bg-blue text-black dark:text-blue-light',
				purple: 'bg-purple text-black dark:text-purple-light',
				pink: 'bg-pink text-black dark:text-pink-light',
				yellow: 'bg-yellow text-black dark:text-yellow-light',
				zinc: 'bg-zinc text-white',
				white: 'bg-white text-black dark:bg-zinc dark:text-white',
			},
		},
		defaultVariants: {
			size: 'sm',
			rounded: 'full',
			color: 'orange',
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

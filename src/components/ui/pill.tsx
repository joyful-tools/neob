import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

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
				orange: 'bg-orange text-black',
				gold: 'bg-gold text-black',
				red: 'bg-red text-white',
				green: 'bg-green text-black',
				blue: 'bg-blue text-black',
				purple: 'bg-purple text-black',
				pink: 'bg-pink text-black',
				yellow: 'bg-yellow text-black',
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
	ref?: Ref<HTMLSpanElement>;
}

function Pill({ className, size, rounded, color, ref, ...properties }: PillProperties) {
	return <span className={cn(pillVariants({ size, rounded, color }), className)} ref={ref} {...properties} />;
}

Pill.displayName = 'Pill';

export { Pill };
export type { PillProperties };
export { pillVariants };

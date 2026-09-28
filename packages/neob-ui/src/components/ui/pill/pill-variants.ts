import { cva } from 'class-variance-authority';

export const pillVariants = cva(
	`
		inline-flex shrink-0 items-center justify-center
		leading-none font-medium select-none
	`,
	{
		variants: {
			size: {
				xs: 'h-5 gap-0.5 px-1.5 text-[10px]',
				sm: 'h-7 gap-1.5 px-2.5 text-xs',
				md: 'h-8 gap-1.5 px-3 text-sm',
				lg: 'h-9 gap-2 px-3.5 text-base',
			},
			rounded: {
				full: 'rounded-full',
				md: 'rounded-md',
				sm: 'rounded-sm',
			},
			color: {
				default: 'bg-muted text-muted-foreground',
				cyan: 'bg-cyan/15 text-cyan-darkest dark:bg-cyan/20 dark:text-cyan-light',
				gold: 'bg-gold/15 text-gold-darkest dark:bg-gold/20 dark:text-gold-light',
				red: 'bg-red/15 text-red-darkest dark:bg-red/20 dark:text-red-light',
				green: 'bg-green/15 text-green-darkest dark:bg-green/20 dark:text-green-light',
				blue: 'bg-blue/15 text-blue-darkest dark:bg-blue/20 dark:text-blue-light',
				purple: 'bg-purple/15 text-purple-darkest dark:bg-purple/20 dark:text-purple-light',
				pink: 'bg-pink/15 text-pink-darkest dark:bg-pink/20 dark:text-pink-light',
				yellow: 'bg-yellow/15 text-yellow-darkest dark:bg-yellow/20 dark:text-yellow-light',
				zinc: 'bg-zinc/15 text-zinc-darkest dark:bg-zinc/30 dark:text-zinc-lightest',
				white: 'bg-white/90 text-black',
			},
		},
		defaultVariants: {
			size: 'sm',
			rounded: 'full',
			color: 'default',
		},
	},
);

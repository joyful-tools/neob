import { cva } from 'class-variance-authority';

export const pillVariants = cva(
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
				default: 'bg-background text-foreground',
				cyan: 'bg-cyan text-cyan-darkest',
				gold: 'bg-gold text-gold-darkest',
				red: 'bg-red text-red-darkest',
				green: 'bg-green text-green-darkest',
				blue: 'bg-blue text-blue-darkest',
				purple: 'bg-purple text-purple-darkest',
				pink: 'bg-pink text-pink-darkest',
				yellow: 'bg-yellow text-yellow-darkest',
				zinc: 'bg-zinc text-zinc-lightest',
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

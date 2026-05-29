import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
	`
		neo-focus-ring
		relative isolate inline-flex cursor-pointer items-center justify-center
		gap-2 rounded-lg border-2 border-black text-sm font-bold whitespace-nowrap
		outline-hidden transition-all duration-25 ease-linear select-none
		after:absolute after:inset-0 after:-bottom-1 after:z-[-1]
		after:transition-transform after:duration-25 after:ease-linear
		after:content-[''] disabled:pointer-events-none
		disabled:opacity-50 disabled:shadow-none
		aria-expanded:translate-y-0.5 aria-expanded:shadow-cel-inset-md
		aria-expanded:after:translate-y-0 aria-expanded:hover:translate-y-0.5 aria-expanded:hover:shadow-cel-inset-md aria-expanded:hover:after:translate-y-0
		data-pressed:translate-y-0.5 data-pressed:shadow-cel-inset-md
		data-pressed:after:translate-y-0 data-pressed:hover:translate-y-0.5 data-pressed:hover:shadow-cel-inset-md data-pressed:hover:after:translate-y-0
	`,
	{
		variants: {
			variant: {
				default: `
					bg-primary-foreground text-primary shadow-cel-sm
					hover:-translate-y-0.5 hover:shadow-cel-md
					hover:after:translate-y-0.5
					active:translate-y-0.5 active:shadow-cel-inset-md
				`,
				accent: `
					bg-orange text-primary shadow-cel-sm
					hover:-translate-y-0.5 hover:bg-orange/90 hover:shadow-cel-md
					hover:after:translate-y-0.5
					active:translate-y-0.5 active:shadow-cel-inset-md
				`,
				danger: `
					bg-red text-primary shadow-cel-sm
					hover:-translate-y-0.5 hover:bg-red/90 hover:shadow-cel-md
					hover:after:translate-y-0.5
					active:translate-y-0.5 active:shadow-cel-inset-md
				`,
				subtle: `
					bg-primary-foreground text-primary
					hover:-translate-y-0.5 hover:bg-muted hover:shadow-cel-sm
					hover:after:translate-y-0.5
					active:translate-y-0.5 active:shadow-cel-inset-md
				`,
				ghost: `
					border-transparent
					hover:border-black hover:bg-muted
					active:translate-y-0.5 active:border-black active:bg-muted
					active:shadow-cel-inset-md aria-expanded:border-black
					data-pressed:border-black
				`,
				link: `
					border-transparent underline-slide text-primary transition-none
					[transition:background-size_0.3s,color_0.3s] hover:text-orange
				`,
				// Dark variants for use on dark backgrounds (player pages)
				'dark-default': `
					border-black bg-zinc text-white shadow-cel-sm
					hover:-translate-y-0.5 hover:shadow-cel-md
					hover:after:translate-y-0.5
					active:translate-y-0.5 active:shadow-cel-inset-md
				`,
				'dark-accent': `
					border-4 border-black bg-orange text-black shadow-cel-md
					hover:-translate-y-1 hover:shadow-cel-lg
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
				'dark-subtle': `
					border-black bg-black text-white
					hover:-translate-y-0.5 hover:bg-zinc/80 hover:shadow-cel-sm
					hover:after:translate-y-0.5
					active:translate-y-0.5 active:shadow-cel-inset-md
				`,
				'dark-ghost': `
					border-transparent text-white
					hover:border-black hover:bg-zinc/80
					active:translate-y-0.5 active:border-black active:bg-zinc/80
					active:shadow-cel-inset-md aria-expanded:border-black
					data-pressed:border-black
				`,
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-8 rounded-md px-3 py-1 text-xs',
				lg: 'h-12 rounded-xl px-8 py-3 text-base',
				xl: 'h-14 rounded-xl px-8 py-4 text-xl font-black uppercase',
				icon: 'size-10 p-0',
			},
		},
		compoundVariants: [
			{
				variant: ['default', 'accent', 'danger'],
				size: 'lg',
				class: `
					shadow-cel-md
					hover:-translate-y-1 hover:shadow-cel-lg
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
			},
			{
				variant: 'subtle',
				size: 'lg',
				class: `
					hover:-translate-y-1 hover:shadow-cel-md
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
			},
			{
				variant: 'dark-default',
				size: 'lg',
				class: `
					shadow-cel-md
					hover:-translate-y-1 hover:shadow-cel-lg
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
			},
			{
				variant: 'dark-accent',
				size: 'lg',
				class: `
					shadow-cel-md
					hover:-translate-y-1 hover:shadow-cel-lg
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
			},
			{
				variant: ['default', 'accent', 'danger'],
				size: 'xl',
				class: `
					shadow-cel-md
					hover:-translate-y-1 hover:shadow-cel-lg
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
			},
			{
				variant: 'subtle',
				size: 'xl',
				class: `
					hover:-translate-y-1 hover:shadow-cel-md
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
			},
			{
				variant: 'dark-default',
				size: 'xl',
				class: `
					shadow-cel-md
					hover:-translate-y-1 hover:shadow-cel-lg
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
			},
			{
				variant: 'dark-accent',
				size: 'xl',
				class: `
					shadow-cel-md
					hover:-translate-y-1 hover:shadow-cel-lg
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
			},
			// Link variant should have no padding/height - it's inline text
			{
				variant: 'link',
				class: 'h-auto p-0',
			},
		],
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

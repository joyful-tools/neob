import { cva } from 'class-variance-authority';

const standardButtonStyles = `
	rounded-lg border-2 border-edge text-sm font-bold
	transition-all duration-25 ease-linear
	after:absolute after:inset-0 after:-bottom-1 after:z-[-1]
	after:transition-transform after:duration-25 after:ease-linear
	after:content-[''] disabled:shadow-none
	active:duration-0 active:after:duration-0
	aria-expanded:duration-0 aria-expanded:after:duration-0
	data-pressed:duration-0 data-pressed:after:duration-0
`;

const raisedButtonStyles = `
	shadow-cel-sm
	hover:-translate-y-0.5 hover:shadow-cel-md hover:after:translate-y-0.5
	active:translate-y-0.5 active:shadow-cel-inset-md
	aria-expanded:translate-y-0.5 aria-expanded:shadow-cel-inset-md
	aria-expanded:after:translate-y-0 aria-expanded:hover:translate-y-0.5 aria-expanded:hover:shadow-cel-inset-md aria-expanded:hover:after:translate-y-0
	data-pressed:translate-y-0.5 data-pressed:shadow-cel-inset-md
	data-pressed:after:translate-y-0 data-pressed:hover:translate-y-0.5 data-pressed:hover:shadow-cel-inset-md data-pressed:hover:after:translate-y-0
`;

const subtleButtonStyles = `
	translate-y-0 shadow-none after:translate-y-0
	hover:-translate-y-0.5 hover:shadow-cel-sm hover:after:translate-y-0.5
	active:translate-y-0.5 active:shadow-cel-inset-md
	aria-expanded:translate-y-0.5 aria-expanded:shadow-cel-inset-md
	aria-expanded:after:translate-y-0 aria-expanded:hover:translate-y-0.5 aria-expanded:hover:shadow-cel-inset-md aria-expanded:hover:after:translate-y-0
	data-pressed:translate-y-0.5 data-pressed:shadow-cel-inset-md
	data-pressed:after:translate-y-0 data-pressed:hover:translate-y-0.5 data-pressed:hover:shadow-cel-inset-md data-pressed:hover:after:translate-y-0
`;

const ghostButtonStyles = `
	border-transparent hover:border-edge
	active:translate-y-0.5 active:border-edge active:shadow-cel-inset-md
	aria-expanded:border-edge
	data-pressed:translate-y-0.5 data-pressed:border-edge data-pressed:shadow-cel-inset-md
	data-pressed:hover:translate-y-0.5 data-pressed:hover:shadow-cel-inset-md
`;

export const buttonVariants = cva(
	`
		neo-focus-ring
		relative isolate inline-flex cursor-pointer items-center justify-center
		gap-2 whitespace-nowrap outline-hidden select-none
		disabled:pointer-events-none disabled:opacity-50
	`,
	{
		variants: {
			variant: {
				default: `
					${standardButtonStyles}
					${raisedButtonStyles}
					bg-primary-foreground text-primary
				`,
				accent: `
					${standardButtonStyles}
					${raisedButtonStyles}
					bg-orange text-primary dark:text-orange-light
				`,
				danger: `
					${standardButtonStyles}
					${raisedButtonStyles}
					bg-red text-primary dark:text-red-light
				`,
				subtle: `
					${standardButtonStyles}
					${subtleButtonStyles}
					bg-primary-foreground text-primary
				`,
				'subtle-accent': `
					${standardButtonStyles}
					${subtleButtonStyles}
					bg-orange text-primary dark:text-orange-light
				`,
				ghost: `
					${standardButtonStyles}
					${ghostButtonStyles}
				`,
				link: `
					underline-slide font-semibold text-primary
				`,
				// Dark variants for use on dark backgrounds (player pages)
				'dark-default': `
					${standardButtonStyles}
					border-edge bg-zinc text-white shadow-cel-sm
					hover:-translate-y-0.5 hover:shadow-cel-md
					hover:after:translate-y-0.5
					active:translate-y-0.5 active:shadow-cel-inset-md
				`,
				'dark-accent': `
					${standardButtonStyles}
					border-4 border-edge bg-orange text-orange-light shadow-cel-md
					hover:-translate-y-1 hover:shadow-cel-lg
					hover:after:translate-y-1
					active:translate-y-1 active:shadow-cel-inset-md
				`,
				'dark-subtle': `
					${standardButtonStyles}
					border-edge bg-black text-white
					hover:-translate-y-0.5 hover:shadow-cel-sm
					hover:after:translate-y-0.5
					active:translate-y-0.5 active:shadow-cel-inset-md
				`,
				'dark-ghost': `
					${standardButtonStyles}
					${ghostButtonStyles}
					text-white
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

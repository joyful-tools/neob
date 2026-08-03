import { cva } from 'class-variance-authority';

const standardButtonStyles = `
	button-physical rounded-lg border-2 border-edge text-sm font-bold
`;

const raisedButtonStyles = `
	[--button-rest-shadow-color:var(--shadow-cel-color-default)]
`;

const subtleButtonStyles = `
	[--button-rest-shadow-color:transparent]
	[--button-hover-shadow-color:var(--shadow-cel-color-default)]
	[--button-shadow-depth-limit:2px]
`;

const ghostButtonStyles = `
	border-transparent [--button-hover-depth:2px] [--button-rest-shadow-color:transparent] [--button-hover-shadow-color:transparent]
	hover:border-edge active:border-edge aria-expanded:border-edge data-pressed:border-edge
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
					bg-cyan text-black dark:bg-cyan-dark dark:text-white
				`,
				danger: `
					${standardButtonStyles}
					${raisedButtonStyles}
					bg-red text-black dark:bg-red-dark dark:text-white
				`,
				subtle: `
					${standardButtonStyles}
					${subtleButtonStyles}
					bg-primary-foreground text-primary
				`,
				'subtle-accent': `
					${standardButtonStyles}
					${subtleButtonStyles}
					bg-cyan text-black dark:bg-cyan-dark dark:text-white
				`,
				ghost: `
					${standardButtonStyles}
					${ghostButtonStyles}
				`,
				link: `
					underline-slide font-semibold text-primary active:[--underline-slide-thickness:2px]
				`,
				// Dark variants for use on dark backgrounds (player pages)
				'dark-default': `
					${standardButtonStyles}
					${raisedButtonStyles}
					bg-zinc text-white
				`,
				'dark-accent': `
					${standardButtonStyles}
					border-4 bg-cyan-dark text-white
					[--button-hover-depth:8px] [--button-rest-depth:4px]
					[--button-rest-shadow-color:var(--shadow-cel-color-default)]
				`,
				'dark-subtle': `
					${standardButtonStyles}
					${subtleButtonStyles}
					bg-black text-white
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

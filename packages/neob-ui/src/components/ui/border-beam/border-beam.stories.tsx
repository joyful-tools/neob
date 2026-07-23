/* eslint-disable better-tailwindcss/no-unknown-classes */
import { cn } from '@/lib/utilities';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

interface BorderBeamStoryProps {
	borderOffset: string;
	strokeWidth: string;
	strokeOffset: number;
	radius: number;
	color: string;
	duration: string;
}

interface CustomCSSProperties extends CSSProperties {
	[key: `--${string}`]: string | number;
}

/**
 * BorderBeam is a decorative glowing/animated border beam effect.
 *
 * ### Usage
 * ```tsx
 * import { BorderBeam } from '@joyful-tools/neob';
 *
 * <div className="relative overflow-hidden rounded-xl">
 *   <BorderBeam duration={8} size={100} />
 * </div>
 * ```
 */
const meta: Meta<BorderBeamStoryProps> = {
	title: 'Experiments/BorderBeam',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	args: {
		borderOffset: '12px',
		strokeWidth: '6px',
		strokeOffset: -15,
		radius: 8,
		color: 'var(--color-gold)',
		duration: '3s',
	},
};

export default meta;
type Story = StoryObj<BorderBeamStoryProps>;

const getStrokeColor = (colorName: string) => {
	if (colorName.startsWith('var(')) return colorName;
	return `var(--color-${colorName}, ${colorName})`;
};

export const Infinite: Story = {
	render: (args) => {
		const customVars: CustomCSSProperties = {
			'--border-beam-offset': args.borderOffset,
			'--border-beam-stroke-width': args.strokeWidth,
			'--border-beam-color': getStrokeColor(args.color),
			'--border-beam-duration': args.duration,
			'--border-beam-stroke-offset-start': 200 + args.strokeOffset,
			'--border-beam-stroke-offset-end': 0 + args.strokeOffset,
		};

		return (
			<div
				className={cn(
					'group relative whitespace-nowrap',
					'flex items-center justify-center',
					'rounded-sm border border-edge/10 bg-muted/20 dark:bg-muted/10',
					'h-24 w-48',
				)}
				style={customVars}
			>
				<div className="font-sans font-bold">Hello World!</div>

				<svg className="border-beam-svg pointer-events-none absolute">
					<rect
						className="border-beam"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
						rx={args.radius}
						pathLength="200"
						strokeDasharray="100 100"
					/>
				</svg>
			</div>
		);
	},
};

export const Once: Story = {
	render: (args) => {
		const customVars: CustomCSSProperties = {
			'--border-beam-offset': args.borderOffset,
			'--border-beam-stroke-width': args.strokeWidth,
			'--border-beam-color': getStrokeColor(args.color),
			'--border-beam-duration': args.duration,
		};

		return (
			<div
				className={cn(
					'group relative whitespace-nowrap',
					'flex items-center justify-center',
					'rounded-sm border border-edge/10 bg-muted/20 dark:bg-muted/10',
					'h-24 w-48',
				)}
				style={customVars}
			>
				<div className="font-sans font-bold">Hello World!</div>

				<svg className="border-beam-svg pointer-events-none absolute">
					<rect
						className="border-beam-once"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
						rx={args.radius}
						pathLength="100"
						strokeDashoffset={args.strokeOffset}
					/>
				</svg>
			</div>
		);
	},
};

export const Multiple: Story = {
	render: (args) => {
		const customVars: CustomCSSProperties = {
			'--border-beam-offset': args.borderOffset,
			'--border-beam-stroke-width': args.strokeWidth,
			'--border-beam-color': getStrokeColor(args.color),
			'--border-beam-duration': args.duration,
		};

		return (
			<div
				className={cn(
					'group relative whitespace-nowrap',
					'flex items-center justify-center',
					'rounded-sm border border-edge/10 bg-muted/20 dark:bg-muted/10',
					'h-24 w-48',
				)}
				style={customVars}
			>
				<div className="font-sans font-bold">Hello World!</div>

				<svg className="border-beam-svg pointer-events-none absolute">
					<rect
						className="border-beam-multiple"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
						rx={args.radius}
						pathLength="100"
						strokeDashoffset={args.strokeOffset}
					/>
				</svg>
			</div>
		);
	},
};

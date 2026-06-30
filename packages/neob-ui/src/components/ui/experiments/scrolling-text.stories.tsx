import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

import { Marquee } from '../marquee/marquee';

import type { Meta, StoryObj } from '@storybook/react-vite';

interface CustomCSSProperties extends CSSProperties {
	[key: `--${string}`]: string | number;
}

const GAP_REM = 6;
const GAP_PX = GAP_REM * 16;
const SCROLL_SPEED = 60;

const marqueeStyle: CustomCSSProperties = { '--gap': `${GAP_REM}rem` };

/**
 * ScrollingText demonstrates conditional marquee scrolling: the text only
 * animates when it overflows its container on a single line. When it fits,
 * it renders as static text. Gradient fade edges mask the marquee at the
 * container borders.
 */
const meta = {
	title: 'Experiments/ScrollingText',
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ScrollingText({ text, className }: { readonly text: ReactNode; readonly className?: string }) {
	const measureRef = useRef<HTMLSpanElement>(null);
	const [hasOverflow, setHasOverflow] = useState(false);
	const [duration, setDuration] = useState('0s');

	useEffect(() => {
		const element = measureRef.current;
		if (!element) {
			return;
		}

		const measure = () => {
			const overflow = element.scrollWidth > element.clientWidth;
			setHasOverflow(overflow);
			if (overflow) {
				// Keep px/sec constant by scaling the duration to the scroll distance
				// (one track = text width + trailing gap) rather than using a fixed time.
				setDuration(`${(element.scrollWidth + GAP_PX) / SCROLL_SPEED}s`);
			}
		};

		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [text]);

	return (
		<div className={cn('relative overflow-hidden border-2 border-black bg-card p-2 shadow-cel-md', className)}>
			<span ref={measureRef} aria-hidden="true" className="invisible block h-0 overflow-hidden font-mono font-bold whitespace-nowrap">
				{text}
			</span>

			{hasOverflow ? (
				<>
					<div role="none" className="pointer-events-none absolute inset-y-0 left-2 z-10 w-2 bg-linear-to-r from-card to-transparent" />
					<div role="none" className="pointer-events-none absolute inset-y-0 right-2 z-10 w-2 bg-linear-to-l from-card to-transparent" />
					<Marquee duration={duration} style={marqueeStyle}>
						<span className="font-mono font-bold whitespace-nowrap">{text}</span>
					</Marquee>
				</>
			) : (
				<span className="block font-mono font-bold whitespace-nowrap">{text}</span>
			)}
		</div>
	);
}

export const Overflowing: Story = {
	render: () => (
		<div className="w-64">
			<ScrollingText text="Lorem ipsum dolor sit amet foo bar baz qux" />
		</div>
	),
};

export const Fits: Story = {
	render: () => (
		<div className="w-64">
			<ScrollingText text="Short text" />
		</div>
	),
};

export const Narrow: Story = {
	render: () => (
		<div className="w-40">
			<ScrollingText text="Resize me to toggle scrolling" />
		</div>
	),
};

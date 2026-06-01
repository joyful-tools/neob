import * as React from 'react';

import { cn } from '@/lib/utilities';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
	readonly children?: React.ReactNode;
	readonly pauseOnHover?: boolean;
	readonly vertical?: boolean;
	readonly reverse?: boolean;
	readonly duration?: string;
}

/**
 * Marquee component.
 * Performs a smooth, infinite horizontal or vertical scroll.
 */
export function Marquee({
	children,
	pauseOnHover = false,
	vertical = false,
	reverse = false,
	duration,
	className,
	style,
	...properties
}: MarqueeProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const trackRef = React.useRef<HTMLDivElement>(null);
	const [repeatCount, setRepeatCount] = React.useState(2);

	React.useEffect(() => {
		const container = containerRef.current;
		const track = trackRef.current;
		if (!container || !track) {
			return;
		}

		const handleResize = () => {
			const containerSize = vertical ? container.getBoundingClientRect().height : container.getBoundingClientRect().width;
			const trackSize = vertical ? track.getBoundingClientRect().height : track.getBoundingClientRect().width;

			if (trackSize > 0) {
				// We need enough copies to fill the container plus the translation distance (100% of one track size).
				// Math.ceil(containerSize / trackSize) + 1 is the theoretical minimum. We use it to ensure
				// the animation is always seamless without rendering excess elements.
				const needed = Math.ceil(containerSize / trackSize) + 1;
				setRepeatCount((current) => {
					const next = Math.max(2, needed);
					return current === next ? current : next;
				});
			}
		};

		handleResize();

		const observer = new ResizeObserver(() => {
			handleResize();
		});

		observer.observe(container);
		observer.observe(track);

		return () => {
			observer.disconnect();
		};
	}, [vertical]);

	const customStyle: React.CSSProperties = {
		...(duration ? { '--duration': duration } : {}),
		...style,
	};

	return (
		<div
			ref={containerRef}
			className={cn('group flex w-full overflow-hidden select-none', vertical ? 'h-full flex-col' : 'flex-row', className)}
			style={customStyle}
			{...properties}
		>
			{Array.from({ length: repeatCount }).map((_, i) => (
				<div
					key={i}
					ref={i === 0 ? trackRef : undefined}
					className={cn(
						'flex shrink-0 gap-(--gap,1rem)',
						vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
						pauseOnHover && 'group-hover:[animation-play-state:paused]',
						reverse && '[animation-direction:reverse]',
					)}
					style={{
						paddingRight: vertical ? undefined : 'var(--gap, 1rem)',
						paddingBottom: vertical ? 'var(--gap, 1rem)' : undefined,
					}}
				>
					{children}
				</div>
			))}
		</div>
	);
}
Marquee.displayName = 'Marquee';

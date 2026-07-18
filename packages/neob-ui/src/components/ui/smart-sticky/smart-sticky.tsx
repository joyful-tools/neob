import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

export interface SmartStickyProps extends HTMLAttributes<HTMLDivElement> {
	readonly sticky?: (props: { stuck: boolean }) => ReactNode;
	readonly onStickyChange?: (stuck: boolean) => void;
	readonly children?: ReactNode;
}

function debounceAnimationFrame<TArgs extends unknown[]>(callback: (...args: TArgs) => void) {
	let id: number | null = null;
	const run = (...args: TArgs) => {
		if (id !== null) {
			cancelAnimationFrame(id);
		}
		id = requestAnimationFrame(() => {
			id = null;
			callback(...args);
		});
	};
	const cancel = () => {
		if (id !== null) {
			cancelAnimationFrame(id);
			id = null;
		}
	};
	return { run, cancel };
}

/**
 * SmartSticky component.
 * Uses IntersectionObserver to detect when a sticky child element is stuck.
 */
export function SmartSticky({ sticky, onStickyChange, children, className, style, ...properties }: SmartStickyProps) {
	const [stuck, setStuck] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const stickyRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		onStickyChange?.(stuck);
	}, [stuck, onStickyChange]);

	useEffect(() => {
		const container = containerRef.current;
		const stickyElement = stickyRef.current;
		if (!container || !stickyElement) return;

		const scheduledUpdate = debounceAnimationFrame(([entry]: IntersectionObserverEntry[]) => {
			if (entry) {
				// When container scrolls, the stuck element moves inside the container bounds,
				// reaching an intersectionRatio of 1.0.
				setStuck(entry.intersectionRatio === 1);
			}
		});
		const observer = new IntersectionObserver(scheduledUpdate.run, {
			threshold: [1],
			root: container,
		});

		observer.observe(stickyElement);

		return () => {
			scheduledUpdate.cancel();
			observer.disconnect();
		};
	}, []);

	if (!sticky) {
		return null;
	}

	return (
		<div ref={containerRef} className={cn('relative', className)} style={{ paddingTop: '1px', ...style }} {...properties}>
			<div ref={stickyRef} className="sticky top-(--smartStickyTop,0px) z-10 -mt-0.5">
				{sticky({ stuck })}
			</div>
			{children}
		</div>
	);
}
SmartSticky.displayName = 'SmartSticky';

import { type HTMLAttributes, type Ref } from 'react';

import { usePerfectCursor } from '@/hooks/use-perfect-cursor';
import { cn } from '@/lib/utilities';

export interface CursorProperties extends HTMLAttributes<HTMLDivElement> {
	readonly ref?: Ref<HTMLDivElement>;
	readonly name: string;
	readonly color: string;
	readonly position: [number, number];
}

/**
 * Cursor represents a multiplayer cursor with a colored pointer and label tag, smoothed with perfect-cursors.
 */
export function Cursor({ name, color, position, className, style, ref, ...properties }: CursorProperties) {
	const transform = usePerfectCursor(position);

	return (
		<div
			ref={ref}
			className={cn(
				'pointer-events-none absolute -top-1 left-0 z-50 flex items-start transition-opacity duration-300 select-none',
				className,
			)}
			style={{
				transform,
				...style,
			}}
			{...properties}
		>
			<svg viewBox="0 0 24 24" className="size-6 drop-shadow-md" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path
					d="M8.13 19.99L3.14 5.01C2.75 3.85 3.85 2.75 5.01 3.14L19.99 8.13C21.3 8.56 21.35 10.4 20.07 10.91L14.12 13.29C13.74 13.44 13.44 13.74 13.29 14.12L10.91 20.07C10.4 21.35 8.56 21.3 8.13 19.99Z"
					fill={color}
					stroke="var(--edge)"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<div
				className="mt-4 -ml-1.5 rounded-md border-2 border-edge px-1.5 py-0.5 text-xs font-bold text-black shadow-md"
				style={{
					backgroundColor: color,
				}}
			>
				{name}
			</div>
		</div>
	);
}
Cursor.displayName = 'Cursor';

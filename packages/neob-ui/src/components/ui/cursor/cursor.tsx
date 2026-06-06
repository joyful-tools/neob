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
			<svg
				viewBox="0 0 24 24"
				className="size-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M22 10.2069L3 3L10.2069 22L13.4828 13.4828L22 10.2069Z"
					fill={color}
					stroke="black"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<div
				className="mt-3 ml-1 rounded-xs border-2 border-black px-1.5 py-0.5 text-xs font-bold text-black shadow-cel-sm"
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

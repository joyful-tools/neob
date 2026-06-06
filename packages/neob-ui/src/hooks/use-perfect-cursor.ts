import { PerfectCursor } from 'perfect-cursors';
import { useEffect, useState, useRef } from 'react';

/**
 * A React hook that interpolates cursor movements using perfect-cursors for multiplayer coordination.
 * It takes a target cursor position and returns a smoothly updating CSS translate property.
 *
 * @param position Tuple [x, y] of the current target position.
 * @returns A string representation of the CSS translate property.
 */
export function usePerfectCursor(position: [number, number]): string {
	const [transform, setTransform] = useState(() => `translate(${position[0]}px, ${position[1]}px)`);
	const pcRef = useRef<PerfectCursor | null>(null);

	useEffect(() => {
		const pc = new PerfectCursor(([x, y]) => {
			setTransform(`translate(${x}px, ${y}px)`);
		});
		pcRef.current = pc;

		return () => {
			pc.dispose();
		};
	}, []);

	// Update the perfect cursor target position when prop changes
	useEffect(() => {
		if (pcRef.current) {
			pcRef.current.addPoint(position);
		}
	}, [position]);

	return transform;
}

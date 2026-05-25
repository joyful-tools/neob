import { CaretUpDown } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

export interface NumericSliderProperties {
	readonly onChange: (deltaValue: number) => void;
	readonly className?: string;
}

export function NumericSlider({ onChange, className }: NumericSliderProperties) {
	const [pointerLockActive, setPointerLockActive] = React.useState(false);
	const [pointerId, setPointerId] = React.useState<number | null>(null);
	const targetReference = React.useRef<HTMLDivElement>(null);

	const handlePointerDown = React.useCallback(
		async (event: React.PointerEvent<HTMLDivElement>) => {
			if (pointerId !== null) return;

			const id = event.pointerId;
			setPointerId(id);

			const target = event.currentTarget;
			try {
				await target.requestPointerLock({
					unadjustedMovement: true,
				});
			} catch {
				try {
					await target.requestPointerLock();
				} catch (error) {
					console.error('Pointer lock failed:', error);
				}
			}
		},
		[pointerId],
	);

	React.useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			if (pointerLockActive) {
				const delta = -event.movementY / window.devicePixelRatio;
				onChange(delta);
			}
		};

		if (pointerId !== null) {
			document.addEventListener('pointermove', handlePointerMove);
		}

		return () => {
			document.removeEventListener('pointermove', handlePointerMove);
		};
	}, [pointerId, pointerLockActive, onChange]);

	React.useEffect(() => {
		const handlePointerLockChange = () => {
			if (document.pointerLockElement === targetReference.current) {
				setPointerLockActive(true);
			} else {
				setPointerLockActive(false);
				setPointerId(null);
			}
		};

		document.addEventListener('pointerlockchange', handlePointerLockChange);
		return () => {
			document.removeEventListener('pointerlockchange', handlePointerLockChange);
		};
	}, []);

	React.useEffect(() => {
		const handlePointerUp = (event: PointerEvent) => {
			if (pointerId === event.pointerId) {
				setPointerId(null);
				try {
					if (document.pointerLockElement === targetReference.current) {
						document.exitPointerLock();
					}
				} catch (error) {
					console.error('Exit pointer lock failed:', error);
				}
			}
		};

		if (pointerId !== null) {
			globalThis.addEventListener('pointerup', handlePointerUp);
			globalThis.addEventListener('pointercancel', handlePointerUp);
		}

		return () => {
			globalThis.removeEventListener('pointerup', handlePointerUp);
			globalThis.removeEventListener('pointercancel', handlePointerUp);
		};
	}, [pointerId]);

	return (
		<div
			ref={targetReference}
			onPointerDown={handlePointerDown}
			style={{ touchAction: 'none' }}
			className={cn(
				`
					flex size-8 cursor-ns-resize items-center justify-center text-black/40
					transition-all duration-75 select-none hover:scale-110 hover:text-black
					dark:text-white/40 dark:hover:text-white
				`,
				pointerLockActive && 'scale-110 text-orange dark:text-orange',
				className,
			)}
			title="Drag vertically to change value"
		>
			<CaretUpDown className="size-4.5" />
		</div>
	);
}

NumericSlider.displayName = 'NumericSlider';

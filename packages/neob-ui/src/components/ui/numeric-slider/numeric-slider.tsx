import { CaretUpDownIcon } from '@phosphor-icons/react';
import { KeyboardEvent, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useQueuedAction } from '@/hooks/use-queued-action';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';

export interface NumericSliderProperties {
	readonly value: number;
	readonly onInput: (value: number) => void;
	readonly action?: Action<[value: number]>;
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
	readonly largeStep?: number;
	readonly disabled?: boolean;
	readonly 'aria-label'?: string;
	readonly className?: string;
}

export function NumericSlider({
	value,
	onInput,
	action,
	min = Number.MIN_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
	step = 1,
	largeStep = 10,
	disabled = false,
	'aria-label': ariaLabel = 'Adjust value',
	className,
}: NumericSliderProperties) {
	const [pointerLockActive, setPointerLockActive] = useState(false);
	const [pointerId, setPointerId] = useState<number | null>(null);
	const targetReference = useRef<HTMLDivElement>(null);
	const dragValueReference = useRef(value);
	const { runAction, isPending } = useQueuedAction(action);
	const clampValue = useCallback((nextValue: number) => Math.min(max, Math.max(min, nextValue)), [max, min]);

	const handlePointerDown = useCallback(
		async (event: ReactPointerEvent<HTMLDivElement>) => {
			if (disabled || pointerId !== null) return;

			const id = event.pointerId;
			dragValueReference.current = value;
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
		[disabled, pointerId, value],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (disabled) return;
			const increment = event.shiftKey ? largeStep : step;
			let nextValue: number | undefined;
			switch (event.key) {
				case 'ArrowUp':
				case 'ArrowRight': {
					event.preventDefault();
					nextValue = clampValue(value + increment);
					break;
				}
				case 'ArrowDown':
				case 'ArrowLeft': {
					event.preventDefault();
					nextValue = clampValue(value - increment);
					break;
				}
				case 'Home': {
					event.preventDefault();
					nextValue = min;
					break;
				}
				case 'End': {
					event.preventDefault();
					nextValue = max;
					break;
				}
			}
			if (nextValue === undefined) return;
			onInput(nextValue);
			void runAction(nextValue).catch(() => {});
		},
		[clampValue, disabled, largeStep, max, min, onInput, runAction, step, value],
	);

	useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			if (pointerLockActive) {
				const delta = (-event.movementY / window.devicePixelRatio) * step;
				const nextValue = clampValue(dragValueReference.current + delta);
				dragValueReference.current = nextValue;
				onInput(nextValue);
			}
		};

		if (pointerId !== null) {
			document.addEventListener('pointermove', handlePointerMove);
		}

		return () => {
			document.removeEventListener('pointermove', handlePointerMove);
		};
	}, [clampValue, onInput, pointerId, pointerLockActive, step]);

	useEffect(() => {
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

	useEffect(() => {
		const handlePointerUp = (event: PointerEvent) => {
			if (pointerId === event.pointerId) {
				void runAction(dragValueReference.current).catch(() => {});
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
	}, [pointerId, runAction]);

	return (
		<div
			ref={targetReference}
			role="spinbutton"
			tabIndex={disabled ? -1 : 0}
			aria-label={ariaLabel}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			aria-disabled={disabled || undefined}
			aria-busy={isPending || undefined}
			data-pending={isPending ? '' : undefined}
			onPointerDown={handlePointerDown}
			onKeyDown={handleKeyDown}
			style={{ touchAction: 'none' }}
			className={cn(
				`flex size-8 cursor-ns-resize items-center justify-center text-black/40 transition-all duration-75 select-none hover:scale-110 hover:text-black dark:text-white/40 dark:hover:text-white`,
				pointerLockActive && 'scale-110 text-cyan dark:text-cyan-light',
				disabled && 'cursor-not-allowed opacity-50',
				className,
			)}
			title="Drag vertically to change value"
		>
			<CaretUpDownIcon className="size-4.5" />
		</div>
	);
}

NumericSlider.displayName = 'NumericSlider';

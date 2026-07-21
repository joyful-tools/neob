import { animate, motion, useMotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

interface RollingDigitsProperties {
	readonly value?: number;
	readonly separator?: boolean;
	readonly className?: string;
}

interface DigitProperties {
	readonly value: number;
}

/**
 * Digit component animates a single number character using vertical rolling transitions.
 */
function Digit({ value }: DigitProperties) {
	// Initialize with +10 decade offset to match Svelte's spring initialization of 10
	const animatedValue = useMotionValue(value + 10);
	const [currentVal, setCurrentVal] = useState(value + 10);

	// Synchronize currentVal with animatedValue
	useEffect(() => {
		return animatedValue.on('change', (latest) => {
			setCurrentVal(latest);
		});
	}, [animatedValue]);

	// Spring animation logic with rollover adjustments matching Svelte spring mechanics
	useEffect(() => {
		const current = animatedValue.get();
		let startVal = current;

		// Rollover adjustment if we exceed 10
		if (current - value > 10) {
			startVal = current - 10;
			animatedValue.set(startVal);
		}

		// Calculate shortest roll direction
		const counterClockwise = Math.abs(startVal - value) > 5;
		let targetVal = value;

		if (counterClockwise) {
			if (startVal > value) {
				targetVal = value + 10;
			} else {
				startVal = current + 10;
				animatedValue.set(startVal);
				targetVal = value;
			}
		}

		const controls = animate(animatedValue, targetVal, {
			type: 'spring',
			stiffness: 100,
			damping: 18,
		});

		return () => controls.stop();
	}, [value, animatedValue]);

	const baseValue = Math.floor(currentVal);
	const offset = currentVal - baseValue;
	const currentDigit = ((baseValue % 10) + 10) % 10;
	const nextDigit = (currentDigit + 1) % 10;

	return (
		<div className="relative inline-block overflow-hidden">
			{/* Static layout guide to reserve natural size without dynamic ResizeObservers */}
			<span className="invisible select-none" aria-hidden="true">
				0
			</span>
			<div
				className="absolute inset-0 flex flex-col items-center justify-center"
				style={{
					transform: `translate3d(0, ${100 * offset}%, 0)`,
				}}
			>
				{/* Top/Next digit wrapper */}
				<div className="absolute -top-full select-none" aria-hidden="true">
					{nextDigit}
				</div>
				{/* Current active digit */}
				<div className="absolute">{currentDigit}</div>
			</div>
		</div>
	);
}

/**
 * RollingDigits component animates number values with rolling odometer-style numbers.
 */
export function RollingDigits({ value = 0, separator = true, className }: RollingDigitsProperties) {
	const isNegative = value < 0;
	const absoluteValue = Math.abs(value);

	const innerRef = useRef<HTMLDivElement>(null);
	const outerWidth = useMotionValue<number | string>('auto');
	const outerHeight = useMotionValue<number | string>('auto');

	// Create digit entries array aligned from the right (reversing first then mapping)
	// to ensure stable digit position keys across length changes (e.g. 99 -> 100).
	const formattedStr = separator ? absoluteValue.toLocaleString() : absoluteValue.toString();
	// eslint-disable-next-line unicorn/no-array-reverse
	const reversedChars = [...formattedStr].reverse();
	const digits = reversedChars
		.map((char, index) => {
			const num = Number(char);
			const isNumber = !Number.isNaN(num) && char.trim() !== '';
			return {
				id: `${index}`, // Stable index key measured from the right
				isNumber,
				numValue: isNumber ? num : 0,
				strValue: char,
			};
		})
		// eslint-disable-next-line unicorn/no-array-reverse
		.reverse();

	// Smoothly scale container bounds during value transitions
	useEffect(() => {
		const element = innerRef.current;
		if (!element) return;

		const observer = new ResizeObserver((entries) => {
			if (!entries[0]) return;
			const { width, height } = entries[0].contentRect;

			// Animate container width and height springs
			animate(outerWidth, width, { type: 'spring', stiffness: 450, damping: 28 });
			animate(outerHeight, height, { type: 'spring', stiffness: 450, damping: 28 });
		});

		observer.observe(element);
		return () => observer.disconnect();
	}, [digits.length, outerWidth, outerHeight]);

	return (
		<>
			{/* Accessible content for assistive technologies */}
			<span className="sr-only">{value}</span>

			<div aria-hidden="true" className={cn('inline-block font-mono text-black dark:text-white', className)}>
				<motion.div
					style={{ width: outerWidth, height: outerHeight }}
					className="relative box-content overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_0.15em,black_calc(100%-0.15em),transparent),linear-gradient(to_right,transparent,black_0.15em,black_calc(100%-0.15em),transparent)] mask-intersect px-[0.2em]"
				>
					<div ref={innerRef} className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center text-center">
						{isNegative && <div className="px-0.5">-</div>}
						{digits.map((digit) => (
							<div key={digit.id} className="flex justify-center">
								{digit.isNumber ? <Digit value={digit.numValue} /> : <div className="px-0.5">{digit.strValue}</div>}
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</>
	);
}
RollingDigits.displayName = 'RollingDigits';

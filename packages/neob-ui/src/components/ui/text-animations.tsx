import { useEffect, useState } from 'react';

import { cn } from '@/lib/utilities';

interface TextAnimationProperties {
	readonly text: string;
	readonly className?: string;
}

interface TextScrambleProperties extends TextAnimationProperties {
	readonly speed?: number;
}

const RANDOM_CHARS = [
	...'!@#$%^&*()_+-=[]{}|;:,./<>?~\\', // Special characters
	...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // Alphanumeric
	...'¥€£¢©®™§¶≠≈∞±√∫∑∏πΩ∆∇µ∂', // Mathematical and currency symbols
	...'あいうえおかきくけこ', // Japanese characters for visual texture
];

function pickRandom<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * TextScramble starts with random scrambled glyphs and reveals the text character-by-character.
 */
export function TextScramble({ text, speed = 50, className }: TextScrambleProperties) {
	// Initialize scrambled text state lazily to avoid triggering synchronous setState in effect
	const [scrambledText, setScrambledText] = useState(() => {
		return [...text].map((char) => (/\s/u.test(char) ? char : pickRandom(RANDOM_CHARS))).join('');
	});

	const [prevText, setPrevText] = useState(text);

	// Adjust state during render when text prop changes to avoid cascading effects
	if (text !== prevText) {
		setPrevText(text);
		setScrambledText([...text].map((char) => (/\s/u.test(char) ? char : pickRandom(RANDOM_CHARS))).join(''));
	}

	useEffect(() => {
		let index = 0;
		const textChars = [...text];

		const interval = setInterval(() => {
			if (index < textChars.length) {
				const nextScrambled = textChars
					.map((char, i) => {
						// Keep correct characters up to current index
						if (i <= index) {
							return char;
						}
						// Keep whitespace intact
						if (/\s/u.test(char)) {
							return char;
						}
						// Randomize the rest
						return pickRandom(RANDOM_CHARS);
					})
					.join('');

				setScrambledText(nextScrambled);
				index += 1;
			} else {
				clearInterval(interval);
			}
		}, speed);

		return () => clearInterval(interval);
	}, [text, speed]);

	return (
		<>
			<span className="sr-only">{text}</span>
			<span aria-hidden="true" className={className}>
				{scrambledText}
			</span>
		</>
	);
}
TextScramble.displayName = 'TextScramble';

/**
 * TextShake applies a step-animation shaking effect individually to each letter.
 */
export function TextShake({ text, className }: TextAnimationProperties) {
	const letters = [...text];

	return (
		<>
			<span className="sr-only">{text}</span>
			<span aria-hidden="true" className={cn('inline-flex flex-wrap select-none', className)}>
				{letters.map((letter, index) => {
					// Use a deterministic pseudo-random formula based on index to remain pure and idempotent during render
					const hash = Math.abs(Math.sin(index + 1) * 10_000) % 1;
					const offset = `${hash * -1}s`;

					return (
						<span
							key={index}
							className="neo-shake whitespace-pre"
							style={{
								animationDelay: offset,
							}}
						>
							{letter}
						</span>
					);
				})}
			</span>
		</>
	);
}
TextShake.displayName = 'TextShake';

/**
 * TextSkew skews the entire text block back and forth smoothly.
 */
export function TextSkew({ text, className }: TextAnimationProperties) {
	return <span className={cn('neo-skew select-none', className)}>{text}</span>;
}
TextSkew.displayName = 'TextSkew';

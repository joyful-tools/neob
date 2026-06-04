import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

interface TypeWordsProperties {
	readonly text: string;
	readonly speed?: number;
	readonly className?: string;
	readonly onglyph?: (ref: HTMLDivElement | null) => void;
	readonly onstart?: (ref: HTMLDivElement | null) => void;
	readonly onfinish?: (ref: HTMLDivElement | null) => void;
}

/**
 * TypeWords component replicates a typewriter animation character-by-character.
 * Includes an invisible suffix tracking the remainder of the current word to avoid mid-word wrapping.
 */
export function TypeWords({ text, speed = 12, className, onglyph, onstart, onfinish }: TypeWordsProperties) {
	const elementRef = useRef<HTMLDivElement>(null);

	const [prevText, setPrevText] = useState(text);
	const [index, setIndex] = useState(text.length);
	const [oldText, setOldText] = useState(text);
	const [currentText, setCurrentText] = useState<string[]>([]);
	const [nextWhitespace, setNextWhitespace] = useState(0);

	const splitText = useMemo(() => [...text], [text]);

	// Reset state during render when text prop changes to avoid cascading effects.
	// We only reset if the new text is not a direct continuation of the previous text.
	if (text !== prevText) {
		setPrevText(text);
		if (!text.startsWith(prevText) || prevText === '') {
			setIndex(0);
			setOldText('');
			setCurrentText([]);
			setNextWhitespace(0);
		}
	}

	// Track callback functions in refs to avoid restarting effects on every parent render
	const onstartRef = useRef(onstart);
	const onglyphRef = useRef(onglyph);
	const onfinishRef = useRef(onfinish);

	useEffect(() => {
		onstartRef.current = onstart;
		onglyphRef.current = onglyph;
		onfinishRef.current = onfinish;
	});

	// Trigger onstart callback safely in an effect when text changes
	useEffect(() => {
		if (onstartRef.current) {
			onstartRef.current(elementRef.current);
		}
	}, [text]);

	// Trigger onfinish callback safely if already finished on mount
	useEffect(() => {
		if (index === splitText.length && onfinishRef.current) {
			onfinishRef.current(elementRef.current);
		}
	}, [splitText.length, index]);

	// Track latest state values via refs so interval doesn't clear/recreate on every character tick
	const indexRef = useRef(index);
	const oldTextRef = useRef(oldText);
	const currentTextRef = useRef(currentText);

	useEffect(() => {
		indexRef.current = index;
		oldTextRef.current = oldText;
		currentTextRef.current = currentText;
	});

	useEffect(() => {
		if (indexRef.current >= splitText.length) {
			return;
		}

		let lastCall = 0;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const triggerGlyph = () => {
			const currentCallback = onglyphRef.current;
			if (!currentCallback) return;
			const now = Date.now();
			const throttleMs = 50;

			if (now - lastCall >= throttleMs) {
				currentCallback(elementRef.current);
				lastCall = now;
			} else {
				if (timeoutId) clearTimeout(timeoutId);
				timeoutId = setTimeout(
					() => {
						currentCallback(elementRef.current);
						lastCall = Date.now();
					},
					throttleMs - (now - lastCall),
				);
			}
		};

		const interval = setInterval(() => {
			const currentIndex = indexRef.current;
			if (currentIndex >= splitText.length) {
				clearInterval(interval);
				return;
			}

			const glyph = splitText[currentIndex];
			const nextIndex = currentIndex + 1;

			const relativeIndex = splitText.slice(currentIndex).findIndex((c) => /\s/u.test(c));
			setNextWhitespace(relativeIndex);

			const current = currentTextRef.current;
			const nextCurrent = [...current, glyph];

			if (nextCurrent.length > 50 && /^\s*$/u.test(glyph)) {
				setOldText((old) => old + nextCurrent.join(''));
				setCurrentText([]);
			} else {
				setCurrentText(nextCurrent);
			}

			triggerGlyph();

			if (nextIndex >= splitText.length) {
				clearInterval(interval);
				setOldText((old) => old + (nextCurrent.length > 50 && /^\s*$/u.test(glyph) ? '' : nextCurrent.join('')));
				setCurrentText([]);
				if (onfinishRef.current) {
					onfinishRef.current(elementRef.current);
				}
			}

			setIndex(nextIndex);
		}, speed);

		return () => {
			clearInterval(interval);
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [splitText, speed]);

	// Calculate remaining word invisibly to reserve layout space and prevent word-wrap layout shifts
	// 'nextWhitespace' was computed in the interval before incrementing the index.
	// Therefore, the next space relative to the current character being processed is at:
	// index + nextWhitespace. The remaining characters of the word are up to: index + nextWhitespace - 1.
	const calculateRemainingWord = () => {
		if (nextWhitespace > 0) {
			return splitText.slice(index, index + nextWhitespace - 1).join('');
		}
		if (nextWhitespace === 0) {
			return '';
		}
		return splitText.slice(index).join('');
	};

	const remainingWord = calculateRemainingWord();

	return (
		<>
			{/* Screen reader content for accessibility */}
			<span className="sr-only">{text}</span>

			<div ref={elementRef} aria-hidden="true" style={{ wordBreak: 'break-word' }} className={cn('text-black dark:text-white', className)}>
				<span className="whitespace-pre-wrap">{oldText}</span>
				{currentText.map((glyph, i) => (
					<span key={i} className="appear whitespace-pre-wrap">
						{glyph}
					</span>
				))}
				<span className="invisible select-none">{remainingWord}</span>
			</div>
		</>
	);
}
TypeWords.displayName = 'TypeWords';

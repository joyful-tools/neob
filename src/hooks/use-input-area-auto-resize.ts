/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
/*
 * Adapted from https://github.com/d0x2f/svelte-textarea-autoresize
 *
 * MIT License
 * Copyright (c) 2019 István Pató
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { useCallback, useEffect, useRef } from 'react';

const SIZING_STYLE_KEYS = [
	'borderBottomWidth',
	'borderLeftWidth',
	'borderRightWidth',
	'borderTopWidth',
	'boxSizing',
	'fontFamily',
	'fontSize',
	'fontStretch',
	'fontStyle',
	'fontVariant',
	'fontWeight',
	'letterSpacing',
	'lineHeight',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'tabSize',
	'textIndent',
	'textRendering',
	'textTransform',
	'width',
	'scrollbarGutter',
] as const;

type SizingStyleKey = (typeof SIZING_STYLE_KEYS)[number];

interface SizingData {
	sizingStyle: Record<SizingStyleKey, string>;
	paddingSize: number;
	borderSize: number;
}

const HIDDEN_INPUT_AREA_STYLE: Record<string, string> = {
	'min-height': '0',
	'max-height': 'none',
	opacity: '0',
	visibility: 'hidden',
	overflow: 'hidden',
	position: 'absolute',
	top: '0',
	right: '0',
	'z-index': '-1000',
	'pointer-events': 'none',
};

function forceHiddenStyles(node: HTMLTextAreaElement) {
	for (const [key, value] of Object.entries(HIDDEN_INPUT_AREA_STYLE)) {
		node.style.setProperty(key, value, 'important');
	}
}

function pickSizingStyles(style: CSSStyleDeclaration): Record<SizingStyleKey, string> {
	const result = {} as Record<SizingStyleKey, string>;
	for (const key of SIZING_STYLE_KEYS) {
		result[key] = style.getPropertyValue(
			// Convert camelCase to kebab-case for getPropertyValue
			key.replaceAll(/([A-Z])/g, '-$1').toLowerCase(),
		);
	}
	return result;
}

function getSizingData(node: HTMLElement): SizingData | null {
	const style = getComputedStyle(node);

	const sizingStyle = pickSizingStyles(style);
	const { boxSizing } = sizingStyle;

	if (boxSizing === '') {
		return null;
	}

	const paddingSize = Number.parseFloat(sizingStyle.paddingBottom) + Number.parseFloat(sizingStyle.paddingTop);
	const borderSize = Number.parseFloat(sizingStyle.borderBottomWidth) + Number.parseFloat(sizingStyle.borderTopWidth);

	return { sizingStyle, paddingSize, borderSize };
}

function getHeight(node: HTMLTextAreaElement, sizingData: SizingData) {
	const height = node.scrollHeight;
	if (sizingData.sizingStyle.boxSizing === 'border-box') {
		return height + sizingData.borderSize;
	}
	return height - sizingData.paddingSize;
}

export interface UseInputAreaAutoResizeOptions {
	/** Maximum number of visible rows before scrolling. Defaults to Infinity. */
	maxRows?: number;
	/** Enable animated height transitions. Pass `true` for defaults or an object for customization. */
	animate?:
		| boolean
		| {
				duration?: number;
				easing?: string;
		  };
}

/**
 * React hook that auto-resizes a textarea element inside a container to fit its content.
 *
 * Returns a callback ref to attach to the container element.
 *
 * @example
 * ```tsx
 * const containerRef = useInputAreaAutoResize({ maxRows: 10 });
 * <div ref={containerRef}><textarea /></div>
 * ```
 */
export function useInputAreaAutoResize(options: UseInputAreaAutoResizeOptions = {}) {
	const { maxRows = Infinity, animate = false } = options;

	const containerRef = useRef<HTMLElement | null>(null);
	const hiddenTextareaRef = useRef<HTMLTextAreaElement | null>(null);
	const rafIdRef = useRef<number>(0);
	const isScrollingRef = useRef<boolean>(false);

	const resize = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const node = container.querySelector('textarea');
		if (!node) return;

		const sizingData = getSizingData(node);
		if (!sizingData) return;

		// Ensure hidden textarea exists
		let hiddenTextarea = hiddenTextareaRef.current;
		if (!hiddenTextarea) {
			hiddenTextarea = document.createElement('textarea');
			hiddenTextarea.tabIndex = -1;
			hiddenTextarea.ariaHidden = 'true';
			forceHiddenStyles(hiddenTextarea);
			hiddenTextareaRef.current = hiddenTextarea;
		}
		if (hiddenTextarea.parentNode === null) {
			document.body.append(hiddenTextarea);
		}

		hiddenTextarea.rows = node.rows;

		const { paddingSize, borderSize, sizingStyle } = sizingData;
		const { boxSizing } = sizingStyle;

		// Copy sizing styles to hidden textarea
		for (const [cssKey, cssValue] of Object.entries(sizingStyle)) {
			(hiddenTextarea.style as unknown as Record<string, string>)[cssKey] = cssValue;
		}

		forceHiddenStyles(hiddenTextarea);

		// Measure content height
		hiddenTextarea.value = node.value || node.placeholder || 'x';
		const height = getHeight(hiddenTextarea, sizingData);

		// Measure single row height
		hiddenTextarea.value = 'x';
		const rowHeight = hiddenTextarea.scrollHeight - paddingSize;

		let minHeight = rowHeight;
		if (boxSizing === 'border-box') {
			minHeight = minHeight + paddingSize + borderSize;
		}

		const contentHeight = Math.max(minHeight, height);

		// Calculate max height from maxRows
		hiddenTextarea.value = 'x';
		hiddenTextarea.rows = maxRows === Infinity ? node.rows : maxRows;
		const maxHeight = maxRows === Infinity ? Infinity : getHeight(hiddenTextarea, sizingData);

		const targetHeight = maxHeight === Infinity ? contentHeight : Math.min(contentHeight, maxHeight);
		const isScrolling = contentHeight > maxHeight;
		isScrollingRef.current = isScrolling;

		// Immediately lock scroll to top if not scrolling to prevent jumping during transitions
		if (!isScrolling) {
			node.scrollTop = 0;
		}

		// Skip if height hasn't changed meaningfully
		if (Math.abs(container.offsetHeight - targetHeight) < 1) {
			node.style.overflowY = isScrolling ? 'auto' : 'hidden';
			return;
		}

		if (!animate) {
			container.style.transition = '';
			container.style.setProperty('height', `${targetHeight}px`);
			node.style.overflowY = isScrolling ? 'auto' : 'hidden';
			return;
		}

		const { duration = 75, easing = 'ease-out' } = typeof animate === 'object' ? animate : {};

		// Set transition styles and height on container
		node.style.overflowY = 'hidden';
		container.style.transition = `height ${duration}ms ${easing}`;
		container.style.setProperty('height', `${targetHeight}px`);

		// Clean up previous transitionend listener if any
		if ((container as any)._cleanupTransition) {
			(container as any)._cleanupTransition();
		}

		const handleTransitionEnd = (e: TransitionEvent) => {
			if (e.propertyName === 'height') {
				node.style.overflowY = isScrolling ? 'auto' : 'hidden';
				if (!isScrolling) {
					node.scrollTop = 0;
				}
				container.style.transition = '';
				cleanupTransition();
			}
		};

		const cleanupTransition = () => {
			container.removeEventListener('transitionend', handleTransitionEnd);
			delete (container as any)._cleanupTransition;
		};

		(container as any)._cleanupTransition = cleanupTransition;
		container.addEventListener('transitionend', handleTransitionEnd);
	}, [maxRows, animate]);

	// Callback ref to attach to the container
	const callbackRef = useCallback(
		(node: HTMLElement | null) => {
			containerRef.current = node;
			if (node) {
				// Initial resize deferred
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = requestAnimationFrame(resize);
			}
		},
		[resize],
	);

	// Listen for input/change events and window resize
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const node = container.querySelector('textarea');
		if (!node) return;

		const handleDeferredResize = () => {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = requestAnimationFrame(resize);
		};

		const handleScroll = () => {
			if (!isScrollingRef.current) {
				node.scrollTop = 0;
			}
		};

		node.addEventListener('input', handleDeferredResize);
		node.addEventListener('change', handleDeferredResize);
		node.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleDeferredResize);

		// Run initial resize
		handleDeferredResize();

		return () => {
			node.removeEventListener('input', handleDeferredResize);
			node.removeEventListener('change', handleDeferredResize);
			node.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleDeferredResize);
			cancelAnimationFrame(rafIdRef.current);
			if ((container as any)._cleanupTransition) {
				(container as any)._cleanupTransition();
			}
			hiddenTextareaRef.current?.remove();
			hiddenTextareaRef.current = null;
		};
	}, [resize]);

	return callbackRef;
}

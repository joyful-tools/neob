import { CSSProperties, ReactNode, Ref, UIEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

export interface VirtualizedViewportProps<T> {
	/** Array of items to be virtualized. */
	readonly items: T[];
	/** Render function for each item in the viewport. */
	readonly renderItem: (item: T, index: number) => ReactNode;
	/** Estimated size (height) of an item. Defaults to 50. */
	readonly estimatedItemHeight?: number;
	/** Number of items to render outside the visible area. Defaults to 5. */
	readonly overscan?: number;
	/** Class name applied to the scrollable viewport container. */
	readonly className?: string;
	/** Inline styles applied to the scrollable viewport container. */
	readonly style?: CSSProperties;
	/** Class name applied to the inner items container wrapper. */
	readonly itemContainerClassName?: string;
	/** Class name applied to the top/bottom spacers (useful for styling/debugging). */
	readonly spacerClassName?: string;
	/** Inline styles applied to the top/bottom spacers. */
	readonly spacerStyle?: CSSProperties;
	/** Optional custom scroll event handler. */
	readonly onScroll?: (event: UIEvent<HTMLDivElement>) => void;
	/** Forwarded ref for the scrollable viewport element. */
	readonly viewportRef?: Ref<HTMLDivElement>;
	/** Optional function to get a unique key for each item. If not provided, defaults to item.id or item.key, falling back to index. */
	readonly getItemKey?: (item: T, index: number) => string | number;
	/** Tab index of the scroll container. Defaults to 0 for accessibility. */
	readonly tabIndex?: number;
	/** Accessible label for the focusable scroll region. */
	readonly 'aria-label'?: string;
	/** Optional callback fired when the rendered or visible item ranges change. */
	readonly onRangeChange?: (range: { startIndex: number; endIndex: number; firstVisibleIndex: number; lastVisibleIndex: number }) => void;
}

/**
 * Binary search to find the item index spanning the target scroll offset.
 * Clamps coordinates to guarantee safe index returns even on rapid scroll overshoots.
 */
export function findIndex(offsets: number[], target: number): number {
	if (offsets.length <= 1) return 0;
	if (target <= 0) return 0;
	const lastIndex = offsets.length - 2;
	if (target >= (offsets.at(-1) ?? 0)) return lastIndex;

	let low = 0;
	let high = lastIndex;
	while (low <= high) {
		const mid = (low + high) >> 1;
		const start = offsets[mid] ?? 0;
		const end = offsets[mid + 1] ?? 0;
		if (target >= start && target < end) {
			return mid;
		}
		if (target < start) {
			high = mid - 1;
		} else {
			low = mid + 1;
		}
	}
	return 0;
}

/**
 * Computes cumulative item offsets where offsets[i] is the top of item i.
 * Safeguards against NaN or negative height values.
 */
export function computeOffsets(sizes: number[]): number[] {
	const arr: number[] = Array.from({ length: sizes.length + 1 }, () => 0);
	arr[0] = 0;
	for (const [i, size] of sizes.entries()) {
		const safeSize = typeof size === 'number' && !Number.isNaN(size) && size > 0 ? size : 0;
		arr[i + 1] = (arr[i] ?? 0) + safeSize;
	}
	return arr;
}

/**
 * Computes sticky offset (always <= 0) based on viewport and content height.
 */
export function calculateStickyOffset(viewportHeight: number, contentHeight: number): number {
	return Math.min(0, viewportHeight - contentHeight);
}

/**
 * Determines visible items and applies overscan buffer ranges.
 */
export function calculateRenderRange(
	offsets: number[],
	scrollTop: number,
	viewportHeight: number,
	itemsLength: number,
	overscan: number,
): {
	startIndex: number;
	endIndex: number;
	firstVisibleIndex: number;
	lastVisibleIndex: number;
} {
	if (itemsLength === 0) {
		return { startIndex: 0, endIndex: -1, firstVisibleIndex: 0, lastVisibleIndex: -1 };
	}

	const firstVisibleIndex = Math.min(itemsLength - 1, Math.max(0, findIndex(offsets, scrollTop)));
	const lastVisibleIndex = Math.min(itemsLength - 1, Math.max(0, findIndex(offsets, scrollTop + viewportHeight)));

	const startIndex = Math.max(0, firstVisibleIndex - overscan);
	const endIndex = Math.min(itemsLength - 1, lastVisibleIndex + overscan);

	return { startIndex, endIndex, firstVisibleIndex, lastVisibleIndex };
}

/**
 * Calculates the adjusted scroll position to maintain anchor stability.
 */
export function calculateAdjustedScrollTop(
	anchorOffset: number,
	newIndex: number,
	offsets: number[],
	scrollHeight: number,
	clientHeight: number,
): number {
	const newOffset = offsets[newIndex];
	if (newOffset === undefined) return 0;
	const newScrollTop = newOffset - anchorOffset;
	const maxScroll = scrollHeight - clientHeight;
	return Math.min(maxScroll, Math.max(0, newScrollTop));
}

/**
 * Fallback helper to retrieve a unique key from an item object if possible.
 */
function getItemKeyDefault<T>(item: T, index: number): string | number {
	if (item && typeof item === 'object') {
		if ('id' in item && (typeof item.id === 'string' || typeof item.id === 'number')) {
			return item.id;
		}
		if ('key' in item && (typeof item.key === 'string' || typeof item.key === 'number')) {
			return item.key;
		}
	}
	return index;
}

export function VirtualizedViewport<T>({
	items,
	renderItem,
	estimatedItemHeight = 50,
	overscan = 5,
	className,
	style,
	itemContainerClassName,
	spacerClassName,
	spacerStyle,
	onScroll,
	viewportRef,
	getItemKey,
	tabIndex = 0,
	'aria-label': ariaLabel = 'Scrollable content',
	onRangeChange,
}: VirtualizedViewportProps<T>) {
	const localViewportRef = useRef<HTMLDivElement | null>(null);
	const setViewportRef = useCallback(
		(node: HTMLDivElement | null) => {
			localViewportRef.current = node;
			if (viewportRef) {
				if (typeof viewportRef === 'function') {
					viewportRef(node);
				} else {
					Object.assign(viewportRef, { current: node });
				}
			}
		},
		[viewportRef],
	);

	const [sizeMap, setSizeMap] = useState<Map<string | number, number>>(() => new Map());
	const [viewportHeight, setViewportHeight] = useState(0);
	const [scrollTop, setScrollTop] = useState(0);
	const scrollRafIdRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (scrollRafIdRef.current !== null) {
				cancelAnimationFrame(scrollRafIdRef.current);
			}
		};
	}, []);

	const itemsRef = useRef(items);
	const getItemKeyRef = useRef(getItemKey || ((item: T, idx: number) => getItemKeyDefault(item, idx)));

	useLayoutEffect(() => {
		itemsRef.current = items;
		getItemKeyRef.current = getItemKey || ((item: T, idx: number) => getItemKeyDefault(item, idx));
	}, [items, getItemKey]);

	// Render-sync scroll anchoring tracking (updated only in layout effect to avoid render-phase ref updates)
	const prevItemsRef = useRef(items);
	const prevOffsetsRef = useRef<number[]>([]);
	const anchorRef = useRef<{ key: string | number; offset: number } | null>(null);

	const sizes = useMemo(() => {
		const getK = getItemKey || getItemKeyDefault;
		return items.map((item, index) => {
			const key = String(getK(item, index));
			return sizeMap.get(key) ?? estimatedItemHeight;
		});
	}, [items, sizeMap, estimatedItemHeight, getItemKey]);

	const offsets = useMemo(() => computeOffsets(sizes), [sizes]);
	const totalHeight = offsets.at(-1) ?? 0;

	// Maintain stable refs of offsets to decouple ResizeObserver updates from scroll renders
	const offsetsRef = useRef(offsets);
	const sizesLengthRef = useRef(sizes.length);

	useLayoutEffect(() => {
		offsetsRef.current = offsets;
		sizesLengthRef.current = sizes.length;
	}, [offsets, sizes.length]);

	const resizeObserverRef = useRef<ResizeObserver | null>(null);
	const elementsRef = useRef<Map<string | number, HTMLDivElement>>(new Map());
	const pendingSizesRef = useRef<Map<string | number, number>>(new Map());
	const rafIdRef = useRef<number | null>(null);

	const updateAnchor = useCallback((scrollTopVal: number) => {
		const currentOffsets = offsetsRef.current;
		const currentSizesLength = sizesLengthRef.current;
		if (currentSizesLength === 0) return;

		const anchorIndex = Math.min(currentSizesLength - 1, findIndex(currentOffsets, scrollTopVal));
		const item = itemsRef.current[anchorIndex];
		if (!item) return;
		const key = getItemKeyRef.current(item, anchorIndex);
		const anchorOffset = (currentOffsets[anchorIndex] ?? 0) - scrollTopVal;
		anchorRef.current = { key, offset: anchorOffset };
	}, []);

	const { startIndex, endIndex, firstVisibleIndex, lastVisibleIndex } = useMemo(
		() => calculateRenderRange(offsets, scrollTop, viewportHeight, items.length, overscan),
		[offsets, scrollTop, viewportHeight, items.length, overscan],
	);

	// Range Callback Trigger (safely tracks ref to avoid triggers on callback changes)
	const onRangeChangeRef = useRef(onRangeChange);
	useLayoutEffect(() => {
		onRangeChangeRef.current = onRangeChange;
	}, [onRangeChange]);

	useEffect(() => {
		if (onRangeChangeRef.current) {
			onRangeChangeRef.current({
				startIndex,
				endIndex,
				firstVisibleIndex,
				lastVisibleIndex,
			});
		}
	}, [startIndex, endIndex, firstVisibleIndex, lastVisibleIndex]);

	const preHeight = offsets[startIndex] ?? 0;
	const contentHeight = (offsets[endIndex + 1] ?? 0) - preHeight;
	const postHeight = Math.max(0, totalHeight - (offsets[endIndex + 1] ?? 0));
	const stickyOffset = useMemo(() => calculateStickyOffset(viewportHeight, contentHeight), [viewportHeight, contentHeight]);

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			const currentScrollTop = localViewportRef.current?.scrollTop ?? 0;

			// Stable anchor update before re-arranging DOM heights, avoiding overwrite of active anchoring
			if (anchorRef.current === null) {
				updateAnchor(currentScrollTop);
			}

			// Queue size measurements
			for (const entry of entries) {
				if (!(entry.target instanceof HTMLElement)) continue;
				const keyAttr = entry.target.dataset.key;
				if (keyAttr === undefined) continue;

				const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height;
				if (height > 0 && !Number.isNaN(height)) {
					pendingSizesRef.current.set(keyAttr, height);
				}
			}

			// Flush updates on animation frame to prevent layout thrashing
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(() => {
					rafIdRef.current = null;
					const pending = pendingSizesRef.current;
					if (pending.size === 0) return;

					setSizeMap((prevMap) => {
						let changed = false;
						const nextMap = new Map(prevMap);
						for (const [key, height] of pending.entries()) {
							const prevHeight = nextMap.get(key);
							if (prevHeight === undefined || Math.abs(prevHeight - height) > 0.5) {
								nextMap.set(key, height);
								changed = true;
							}
						}
						pending.clear();
						return changed ? nextMap : prevMap;
					});
				});
			}
		});

		resizeObserverRef.current = observer;

		for (const el of elementsRef.current.values()) {
			observer.observe(el);
		}

		return () => {
			observer.disconnect();
			resizeObserverRef.current = null;
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [items.length, updateAnchor]);

	// Viewport resize observer
	useEffect(() => {
		const viewport = localViewportRef.current;
		if (!viewport) return;

		const observer = new ResizeObserver((entries) => {
			if (entries[0]) {
				const height = entries[0].contentRect.height;
				setViewportHeight(height);
			}
		});

		observer.observe(viewport);
		return () => observer.disconnect();
	}, []);

	// Scroll Anchoring Application (Synchronized via layout effects to avoid render side-effects)
	useLayoutEffect(() => {
		const viewport = localViewportRef.current;
		if (!viewport) return;

		const currentScrollTop = viewport.scrollTop;

		// Case 1: Items list updated/prepended
		if (items !== prevItemsRef.current) {
			const oldItems = prevItemsRef.current;
			const oldOffsets = prevOffsetsRef.current;

			if (oldItems.length > 0 && oldOffsets.length > 0 && currentScrollTop > 0) {
				const anchorIndex = Math.min(oldItems.length - 1, findIndex(oldOffsets, currentScrollTop));
				const item = oldItems[anchorIndex];
				if (item !== undefined) {
					const key = getItemKey ? getItemKey(item, anchorIndex) : getItemKeyDefault(item, anchorIndex);
					const anchorOffset = (oldOffsets[anchorIndex] ?? 0) - currentScrollTop;

					const newIndex = items.findIndex((it, idx) => {
						const getK = getItemKey || getItemKeyDefault;
						return getK(it, idx) === key;
					});

					if (newIndex !== -1) {
						const targetScroll = calculateAdjustedScrollTop(anchorOffset, newIndex, offsets, viewport.scrollHeight, viewport.clientHeight);

						if (Math.abs(viewport.scrollTop - targetScroll) > 0.5) {
							viewport.scrollTop = targetScroll;
							setScrollTop(targetScroll);
						}
					}
				}
			}
			prevItemsRef.current = items;
			prevOffsetsRef.current = offsets;
			anchorRef.current = null;
			return;
		}

		// Case 2: Size measurements adjusted via ResizeObserver
		const anchor = anchorRef.current;
		if (anchor && currentScrollTop > 0) {
			const newIndex = items.findIndex((item, idx) => {
				const getK = getItemKey || getItemKeyDefault;
				return getK(item, idx) === anchor.key;
			});

			if (newIndex !== -1) {
				const targetScroll = calculateAdjustedScrollTop(anchor.offset, newIndex, offsets, viewport.scrollHeight, viewport.clientHeight);

				if (Math.abs(viewport.scrollTop - targetScroll) > 0.5) {
					viewport.scrollTop = targetScroll;
					setScrollTop(targetScroll);
				}
			}
			anchorRef.current = null;
		}

		prevOffsetsRef.current = offsets;
	}, [items, offsets, getItemKey]);

	const handleScroll = (event: UIEvent<HTMLDivElement>) => {
		const nextScroll = event.currentTarget.scrollTop;
		if (scrollRafIdRef.current !== null) {
			cancelAnimationFrame(scrollRafIdRef.current);
		}
		scrollRafIdRef.current = requestAnimationFrame(() => {
			scrollRafIdRef.current = null;
			setScrollTop(nextScroll);
		});
		// Invalidate any captured anchor so size measurements re-anchor from the
		// up-to-date scroll position instead of a stale offset captured earlier.
		anchorRef.current = null;

		if (onScroll) {
			onScroll(event);
		}
	};

	const handleItemRef = (el: HTMLDivElement | null, key: string | number) => {
		if (el) {
			el.dataset.key = String(key);
			elementsRef.current.set(key, el);
			resizeObserverRef.current?.observe(el);
		} else {
			const existing = elementsRef.current.get(key);
			if (existing) {
				resizeObserverRef.current?.unobserve(existing);
				elementsRef.current.delete(key);
			}
		}
	};
	const renderedItems = useMemo(() => {
		const result: ReactNode[] = [];
		const getK = getItemKey || getItemKeyDefault;
		for (let i = startIndex; i <= endIndex; i++) {
			const item = items[i];
			if (item === undefined) continue;

			const key = getK(item, i);

			result.push(
				<div key={key} ref={(el) => handleItemRef(el, key)}>
					{renderItem(item, i)}
				</div>,
			);
		}
		return result;
	}, [items, startIndex, endIndex, renderItem, getItemKey]);

	return (
		<div
			ref={setViewportRef}
			className={cn('relative size-full overflow-y-auto', className)}
			style={style}
			onScroll={handleScroll}
			tabIndex={tabIndex}
			role="region"
			aria-label={ariaLabel}
		>
			<div style={{ height: totalHeight, position: 'relative', width: '100%' }}>
				{/* Spacer Top */}
				{preHeight > 0 && <div className={cn('w-full', spacerClassName)} style={{ height: preHeight, ...spacerStyle }} />}

				{/* Sticky Content Container */}
				<div
					style={{
						position: 'sticky',
						top: stickyOffset,
						bottom: stickyOffset,
						height: contentHeight,
						width: '100%',
					}}
				>
					<div className={itemContainerClassName}>{renderedItems}</div>
				</div>

				{/* Spacer Bottom */}
				{postHeight > 0 && <div className={cn('w-full', spacerClassName)} style={{ height: postHeight, ...spacerStyle }} />}
			</div>
		</div>
	);
}

VirtualizedViewport.displayName = 'VirtualizedViewport';

import { Ref, RefCallback, useCallback } from 'react';

export type EdgeFadeAxis = 'x' | 'y' | 'both';

export interface UseEdgeFadeOptions<T extends HTMLElement> {
	readonly axis?: EdgeFadeAxis;
	readonly enabled?: boolean;
	readonly ref?: Ref<T>;
}

/** Tracks hidden scroll edges without rerendering the scrolling content. */
export function useEdgeFade<T extends HTMLElement>({ axis = 'y', enabled = true, ref }: UseEdgeFadeOptions<T> = {}): RefCallback<T> {
	return useCallback(
		(element: T | null) => {
			const cleanupRef = typeof ref === 'function' ? ref(element) : undefined;
			if (ref && typeof ref !== 'function') {
				Object.assign(ref, { current: element });
			}
			if (!element) return;
			const releaseRef = () => {
				if (typeof cleanupRef === 'function') {
					cleanupRef();
				} else if (typeof ref === 'function') {
					ref(null);
				} else if (ref) {
					Object.assign(ref, { current: null });
				}
			};
			if (!enabled) return releaseRef;

			const edgeProperties = ['top', 'bottom', 'left', 'right'].map((edge) => {
				const property = `--edge-fade-${edge}`;
				return { property, value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) };
			});
			const updateEdge = (edge: 'top' | 'bottom' | 'left' | 'right', distance: number) => {
				const property = `--edge-fade-${edge}`;
				const value = `min(var(--edge-fade-size), 50%, ${distance}px)`;
				// The observer also watches consumer style changes, so avoid scheduling ourselves indefinitely.
				if (element.style.getPropertyValue(property) !== value) {
					element.style.setProperty(property, value);
				}
				element.toggleAttribute(`data-edge-fade-${edge}`, distance > 0);
			};
			let frame: number | undefined;
			const update = () => {
				frame = undefined;
				const verticalOverflow = axis !== 'x' && element.clientHeight > 0 ? Math.max(0, element.scrollHeight - element.clientHeight) : 0;
				const horizontalOverflow = axis !== 'y' && element.clientWidth > 0 ? Math.max(0, element.scrollWidth - element.clientWidth) : 0;
				const rtl = horizontalOverflow > 0 && getComputedStyle(element).direction === 'rtl';
				const topOffset = Math.min(verticalOverflow, Math.max(0, element.scrollTop));
				const leftOffset = Math.min(horizontalOverflow, Math.max(0, rtl ? -element.scrollLeft : element.scrollLeft));

				updateEdge('top', topOffset);
				updateEdge('bottom', verticalOverflow - topOffset);
				updateEdge('left', rtl ? horizontalOverflow - leftOffset : leftOffset);
				updateEdge('right', rtl ? leftOffset : horizontalOverflow - leftOffset);
			};
			const scheduleUpdate = () => {
				if (frame !== undefined) return;
				frame = requestAnimationFrame(update);
			};

			const resizeObserver = new ResizeObserver(scheduleUpdate);
			resizeObserver.observe(element);
			const observedChildren = new Set<Element>();
			const observeContent = () => {
				for (const child of observedChildren) {
					if (child.parentElement === element) continue;
					resizeObserver.unobserve(child);
					observedChildren.delete(child);
				}
				for (const child of element.children) {
					if (observedChildren.has(child)) continue;
					resizeObserver.observe(child);
					observedChildren.add(child);
				}
			};
			const mutationObserver = new MutationObserver(() => {
				observeContent();
				scheduleUpdate();
			});
			mutationObserver.observe(element, {
				childList: true,
				subtree: true,
				characterData: true,
				attributes: true,
				// Edge attributes do not affect scroll geometry.
				attributeFilter: ['class', 'style', 'hidden', 'dir'],
			});
			element.addEventListener('scroll', scheduleUpdate, { passive: true });
			element.addEventListener('load', scheduleUpdate, true);
			observeContent();
			update();

			return () => {
				resizeObserver.disconnect();
				mutationObserver.disconnect();
				element.removeEventListener('scroll', scheduleUpdate);
				element.removeEventListener('load', scheduleUpdate, true);
				if (frame !== undefined) cancelAnimationFrame(frame);
				for (const edge of ['top', 'bottom', 'left', 'right']) {
					element.removeAttribute(`data-edge-fade-${edge}`);
				}
				for (const { property, value, priority } of edgeProperties) {
					if (value) {
						element.style.setProperty(property, value, priority);
					} else {
						element.style.removeProperty(property);
					}
				}
				releaseRef();
			};
		},
		[axis, enabled, ref],
	);
}

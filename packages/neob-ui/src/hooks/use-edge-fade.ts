import { Ref, RefCallback, useCallback } from 'react';

export type EdgeFadeAxis = 'x' | 'y' | 'both';

export interface UseEdgeFadeOptions<T extends HTMLElement> {
	readonly axis?: EdgeFadeAxis;
	readonly enabled?: boolean;
	readonly ref?: Ref<T>;
}

const EDGE_THRESHOLD = 4;

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

			let frame: number | undefined;
			const update = () => {
				frame = undefined;
				const verticalOverflow = axis !== 'x' && element.clientHeight > 0 && element.scrollHeight - element.clientHeight > EDGE_THRESHOLD;
				const horizontalOverflow = axis !== 'y' && element.clientWidth > 0 && element.scrollWidth - element.clientWidth > EDGE_THRESHOLD;
				const rtl = horizontalOverflow && getComputedStyle(element).direction === 'rtl';
				const leftOffset = Math.abs(element.scrollLeft);
				const horizontalStart = leftOffset > EDGE_THRESHOLD;
				const horizontalEnd = element.scrollWidth - element.clientWidth - leftOffset > EDGE_THRESHOLD;

				element.toggleAttribute('data-edge-fade-top', verticalOverflow && element.scrollTop > EDGE_THRESHOLD);
				element.toggleAttribute(
					'data-edge-fade-bottom',
					verticalOverflow && element.scrollHeight - element.clientHeight - element.scrollTop > EDGE_THRESHOLD,
				);
				element.toggleAttribute('data-edge-fade-left', horizontalOverflow && (rtl ? horizontalEnd : horizontalStart));
				element.toggleAttribute('data-edge-fade-right', horizontalOverflow && (rtl ? horizontalStart : horizontalEnd));
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
				// Exclude our data attributes so edge updates cannot schedule themselves.
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
				releaseRef();
			};
		},
		[axis, enabled, ref],
	);
}

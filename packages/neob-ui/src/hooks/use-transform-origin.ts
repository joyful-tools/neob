import { Ref, useCallback, useLayoutEffect, useRef } from 'react';

/**
 * A React hook that calculates and applies a dynamic transform-origin on a popup/floating element
 * based on its position relative to an anchor/trigger element. This corrects the animation origin
 * for any collision-induced shifts or custom offsets, ensuring it "grows" from the anchor.
 *
 * @param anchorElement The DOM element of the anchor/trigger.
 * @param forwardedRef An optional forwarded ref to merge with the internal popup ref.
 * @returns A callback ref to be attached to the popup/floating element.
 */
export function useTransformOrigin<T extends HTMLElement>(anchorElement: HTMLElement | null, forwardedRef?: Ref<T> | null) {
	const popupRef = useRef<T | null>(null);

	useLayoutEffect(() => {
		if (!anchorElement) return;

		const popup = popupRef.current;
		if (!popup) return;

		const updateOrigin = () => {
			const popupRect = popup.getBoundingClientRect();
			const anchorRect = anchorElement.getBoundingClientRect();
			const side = popup.dataset.side || 'bottom';

			let origin = '50% 50%';

			switch (side) {
				case 'top': {
					const xOffset = anchorRect.left + anchorRect.width / 2 - popupRect.left;
					origin = `${xOffset}px 100%`;

					break;
				}
				case 'bottom': {
					const xOffset = anchorRect.left + anchorRect.width / 2 - popupRect.left;
					origin = `${xOffset}px 0%`;

					break;
				}
				case 'left': {
					const yOffset = anchorRect.top + anchorRect.height / 2 - popupRect.top;
					origin = `100% ${yOffset}px`;

					break;
				}
				case 'right': {
					const yOffset = anchorRect.top + anchorRect.height / 2 - popupRect.top;
					origin = `0% ${yOffset}px`;

					break;
				}
				// No default
			}

			popup.style.transformOrigin = origin;
		};

		updateOrigin();

		// Observe data-side on popup and style changes on its parent (the Floating UI Positioner)
		const observer = new MutationObserver(updateOrigin);
		observer.observe(popup, { attributes: true, attributeFilter: ['data-side'] });

		if (popup.parentElement) {
			observer.observe(popup.parentElement, { attributes: true, attributeFilter: ['style'] });
		}

		window.addEventListener('resize', updateOrigin);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', updateOrigin);
		};
	}, [anchorElement]);

	const forwardedRefRef = useRef(forwardedRef);
	useLayoutEffect(() => {
		forwardedRefRef.current = forwardedRef;
	}, [forwardedRef]);

	const mergedRef = useCallback((node: T | null) => {
		popupRef.current = node;
		const currentForwardedRef = forwardedRefRef.current;
		if (currentForwardedRef) {
			if (typeof currentForwardedRef === 'function') {
				currentForwardedRef(node);
			} else {
				Object.assign(currentForwardedRef, { current: node });
			}
		}
	}, []);

	return mergedRef;
}

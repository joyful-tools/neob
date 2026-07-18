import { useCallback, useEffect } from 'react';

let lastInteractionWasTouch = false;
let subscriberCount = 0;

const handleTouchStart = () => {
	lastInteractionWasTouch = true;
};

const handlePointerMove = (event: PointerEvent) => {
	if (event.pointerType !== 'touch') {
		lastInteractionWasTouch = false;
	}
};

function subscribe() {
	if (subscriberCount === 0) {
		document.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
		document.addEventListener('pointermove', handlePointerMove, { passive: true });
	}
	subscriberCount += 1;

	return () => {
		subscriberCount -= 1;
		if (subscriberCount === 0) {
			document.removeEventListener('touchstart', handleTouchStart, { capture: true });
			document.removeEventListener('pointermove', handlePointerMove);
		}
	};
}

export function useLastInteractionWasTouch(): () => boolean {
	useEffect(() => subscribe(), []);
	return useCallback(() => lastInteractionWasTouch, []);
}

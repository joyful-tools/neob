import { useEffect, useState } from 'react';

export function useToastViewport(): number {
	const [bottomInset, setBottomInset] = useState(0);

	useEffect(() => {
		const viewport = globalThis.window?.visualViewport;
		if (!viewport) return;

		let frame: number | undefined;
		const update = () => {
			frame = undefined;
			// Zooming also shrinks the visual viewport, but must not lift notifications.
			if (viewport.scale !== 1) return;
			setBottomInset(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop));
		};
		const scheduleUpdate = () => {
			if (frame !== undefined) return;
			frame = requestAnimationFrame(update);
		};

		viewport.addEventListener('resize', scheduleUpdate);
		viewport.addEventListener('scroll', scheduleUpdate);
		window.addEventListener('resize', scheduleUpdate);
		update();
		return () => {
			viewport.removeEventListener('resize', scheduleUpdate);
			viewport.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			if (frame !== undefined) cancelAnimationFrame(frame);
		};
	}, []);

	return bottomInset;
}

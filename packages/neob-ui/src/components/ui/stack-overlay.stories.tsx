import { XCircleIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * StackOverlay showcases complex multi-dialog overlay stacking interactions.
 *
 * ### General Usage
 * ```tsx
 * // Check story file for implementation details
 * ```
 */
const meta = {
	title: 'Experiments/StackOverlay',
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function useStackOverlay() {
	const [dismissed, setDismissed] = useState(false);

	const overlayRef = useRef<HTMLDivElement>(null);
	const dimmerRef = useRef<HTMLDivElement>(null);
	const percentageTextRef = useRef<HTMLDivElement>(null);
	const overlayTopTextRef = useRef<HTMLDivElement>(null);
	const minTopTextRef = useRef<HTMLDivElement>(null);
	const isFixedTextRef = useRef<HTMLDivElement>(null);

	const prevScrollYRef = useRef(0);
	const prevScrollDirectionRef = useRef<'up' | 'down'>('down');
	const currentOverlayTopRef = useRef(0);
	const overlayHeightRef = useRef(384);
	const percentageRef = useRef(0);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!dismissed && e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				setDismissed(true);
			}
		};
		globalThis.addEventListener('keydown', handleKeyDown, { capture: true });
		return () => globalThis.removeEventListener('keydown', handleKeyDown, { capture: true });
	}, [dismissed]);

	useEffect(() => {
		if (dismissed) return;

		const overlay = overlayRef.current;
		if (!overlay) return;

		const updateLayout = () => {
			const currentScrollY = window.scrollY;
			const innerHeight = window.innerHeight;
			const overlayHeight = overlayHeightRef.current;
			const minOverlayTop = innerHeight * 1.618;
			const overlayWhitespace = (innerHeight - overlayHeight) / 2;

			const direction = currentScrollY > prevScrollYRef.current ? 'down' : 'up';

			if (direction === 'up' && prevScrollDirectionRef.current === 'down') {
				currentOverlayTopRef.current = Math.max(currentOverlayTopRef.current, currentScrollY + overlayWhitespace);
			} else if (
				direction === 'down' &&
				prevScrollDirectionRef.current === 'up' &&
				currentOverlayTopRef.current - overlayWhitespace > currentScrollY + innerHeight
			) {
				currentOverlayTopRef.current = currentScrollY + innerHeight + overlayWhitespace;
			}

			prevScrollYRef.current = currentScrollY;
			prevScrollDirectionRef.current = direction;

			const overlayTop = Math.max(minOverlayTop, currentOverlayTopRef.current);
			const isFixed = currentScrollY > overlayTop - overlayWhitespace;
			const percentage = Math.max(0, Math.min(1, (currentScrollY + innerHeight - overlayTop) / ((innerHeight + overlayHeight) / 2)));
			percentageRef.current = percentage;

			overlay.style.position = isFixed ? 'fixed' : 'absolute';
			overlay.style.top = isFixed ? `${overlayWhitespace}px` : `${overlayTop}px`;

			const dimmer = dimmerRef.current;
			if (dimmer) {
				dimmer.style.opacity = (percentage * 0.4).toString();
				dimmer.style.pointerEvents = percentage > 0 ? 'auto' : 'none';
			}

			if (percentageTextRef.current) {
				percentageTextRef.current.textContent = `Percentage: ${Math.trunc(percentage * 100)}%`;
			}
			if (overlayTopTextRef.current) {
				overlayTopTextRef.current.textContent = `Overlay Top: ${overlayTop.toFixed(1)}px`;
			}
			if (minTopTextRef.current) {
				minTopTextRef.current.textContent = `Min Top: ${minOverlayTop.toFixed(1)}px`;
			}
			if (isFixedTextRef.current) {
				isFixedTextRef.current.textContent = `Is Fixed: ${isFixed ? 'YES' : 'NO'}`;
			}
		};

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target instanceof HTMLElement) {
					overlayHeightRef.current = entry.target.offsetHeight;
					updateLayout();
				}
			}
		});
		resizeObserver.observe(overlay);

		const handleScroll = () => {
			updateLayout();
		};

		const handleResize = () => {
			updateLayout();
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleResize);

		// Run once to initialize
		updateLayout();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
			resizeObserver.disconnect();
		};
	}, [dismissed]);

	const handleDimmerClick = () => {
		if (percentageRef.current === 1) {
			setDismissed(true);
		}
	};

	return {
		dismissed,
		setDismissed,
		overlayRef,
		dimmerRef,
		percentageTextRef,
		overlayTopTextRef,
		minTopTextRef,
		isFixedTextRef,
		handleDimmerClick,
	};
}

function StackOverlayDemo() {
	const {
		dismissed,
		setDismissed,
		overlayRef,
		dimmerRef,
		percentageTextRef,
		overlayTopTextRef,
		minTopTextRef,
		isFixedTextRef,
		handleDimmerClick,
	} = useStackOverlay();

	const initialMinOverlayTop = globalThis.window === undefined ? 0 : window.innerHeight * 1.618;

	return (
		<div className="relative min-h-[250vh]">
			<div className="fixed top-4 right-4 z-20 flex flex-col gap-1 rounded-sm border-2 border-black bg-white p-2 font-mono text-xs text-black shadow-sm dark:bg-zinc dark:text-white">
				<div ref={percentageTextRef}>Percentage: 0%</div>
				<div ref={overlayTopTextRef}>Overlay Top: 0.0px</div>
				<div ref={minTopTextRef}>Min Top: 0.0px</div>
				<div ref={isFixedTextRef}>Is Fixed: NO</div>
			</div>

			<div className="container flex flex-col gap-5 p-6 font-sans">
				{Array.from({ length: 30 }).map((_, i) => (
					<p key={i} className="leading-relaxed text-zinc dark:text-white/80">
						Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
						aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
						takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
						tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
						rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
					</p>
				))}
			</div>

			<AnimatePresence>
				{!dismissed && (
					<>
						<motion.div
							ref={dimmerRef}
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.12 }}
							className="fixed inset-0 z-10 cursor-pointer bg-black"
							style={{ opacity: 0 }}
							onClick={handleDimmerClick}
						/>
						<motion.div
							ref={overlayRef}
							initial={{ opacity: 0, scale: 1.08 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 1.08 }}
							transition={{ type: 'spring', stiffness: 550, damping: 28 }}
							className="absolute left-1/2 z-10 flex h-96 w-64 -translate-x-1/2 flex-col rounded-xl border-4 border-black bg-white shadow-xl dark:bg-zinc"
							style={{
								top: `${initialMinOverlayTop}px`,
							}}
						>
							<div className="absolute top-2 right-2">
								<button
									type="button"
									className="cursor-pointer p-1 text-black transition-transform hover:scale-105 active:scale-95 dark:text-white"
									aria-label="Close overlay"
									onClick={() => setDismissed(true)}
								>
									<XCircleIcon size={24} weight="bold" />
								</button>
							</div>
							<div className="flex flex-1 flex-col items-center justify-center p-6 text-center font-bold">
								<div className="mb-2 text-xl text-black dark:text-white">Stack Overlay</div>
								<div className="text-sm font-normal text-zinc/70 dark:text-white/70">
									Scroll down to see the background dim and lock this panel in the center.
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}

export const Default: Story = {
	render: () => <StackOverlayDemo />,
};

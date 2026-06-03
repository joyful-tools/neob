import { useEffect, useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * StackHeader shows headers used in complex dialogue/modal overlays.
 *
 * ### General Usage
 * ```tsx
 * // Check story file for implementation details
 * ```
 */
const meta = {
	title: 'Experiments/StackHeader',
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function useScrollHeader() {
	const headerRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	const headerOffsetRef = useRef(0);
	const prevScrollYRef = useRef(0);
	const prevScrollDirectionRef = useRef<'up' | 'down'>('down');
	const headerHeightRef = useRef(73);

	useEffect(() => {
		const header = headerRef.current;
		if (!header) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target instanceof HTMLElement) {
					headerHeightRef.current = entry.target.offsetHeight;
				}
			}
		});
		resizeObserver.observe(header);

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const direction = currentScrollY > prevScrollYRef.current ? 'down' : 'up';
			const headerHeight = headerHeightRef.current;
			let headerOffset = headerOffsetRef.current;

			if (currentScrollY <= 0) {
				headerOffset = 0;
			} else if (direction === 'up' && prevScrollDirectionRef.current === 'down') {
				headerOffset = Math.max(headerOffset, currentScrollY - headerHeight);
			} else if (direction === 'down' && prevScrollDirectionRef.current === 'up') {
				headerOffset = Math.min(headerOffset, currentScrollY);
			}

			headerOffsetRef.current = headerOffset;
			prevScrollYRef.current = currentScrollY;
			prevScrollDirectionRef.current = direction;

			let position: 'fixed' | 'absolute' = 'absolute';
			let top = `${headerOffset}px`;

			if (currentScrollY <= 0) {
				position = 'fixed';
				top = '0px';
			} else if (direction === 'down' && headerOffset + headerHeight < currentScrollY) {
				position = 'fixed';
				top = `-${headerHeight}px`;
			} else if (direction === 'up' && headerOffset > currentScrollY) {
				position = 'fixed';
				top = '0px';
			}

			header.style.position = position;
			header.style.top = top;

			const textElement = textRef.current;
			if (textElement) {
				const visiblePx = Math.max(0, Math.min(headerHeight, headerOffset + headerHeight - currentScrollY));
				textElement.textContent = `Header Visible: ${visiblePx}px | Direction: ${direction.toUpperCase()}`;
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			resizeObserver.disconnect();
		};
	}, []);

	return { headerRef, textRef };
}

function StackHeaderDemo() {
	const { headerRef, textRef } = useScrollHeader();

	return (
		<div>
			<div
				ref={headerRef}
				className="z-10 flex h-[73px] w-full flex-col items-center justify-center border-4 border-black bg-orange shadow-sm dark:bg-orange-dark"
				style={{
					position: 'absolute',
					top: '0px',
				}}
			>
				<div ref={textRef} className="flex flex-1 items-center justify-center font-mono text-sm font-bold text-black dark:text-white">
					Header Visible: 73px | Direction: DOWN
				</div>
			</div>

			<div style={{ height: '73px' }} />

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
		</div>
	);
}

export const Default: Story = {
	render: () => <StackHeaderDemo />,
};

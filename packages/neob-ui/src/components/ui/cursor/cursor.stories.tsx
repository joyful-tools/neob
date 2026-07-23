import { useEffect, useRef, useState } from 'react';

import { Cursor } from './cursor';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Cursor renders a user's cursor for collaborative pages.
 * The positions are interpolated smoothly using `perfect-cursors`.
 */
const meta = {
	title: 'Component/Cursor',
	component: Cursor,
	parameters: {
		layout: 'centered',
	},
	args: {
		name: 'Demo',
		color: 'var(--color-blue)',
		position: [150, 80],
	},
} satisfies Meta<typeof Cursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="relative h-48 w-96 overflow-hidden rounded-lg border-2 border-edge bg-white shadow-cel-inset-sm dark:bg-zinc">
			<Cursor name="Demo" color="var(--color-blue)" position={[150, 80]} />
		</div>
	),
};

export const Multiple: Story = {
	render: () => (
		<div className="relative h-64 w-125 overflow-hidden rounded-lg border-2 border-edge bg-white shadow-cel-inset-sm dark:bg-zinc">
			<Cursor name="Alice" color="var(--color-blue)" position={[50, 40]} />
			<Cursor name="Bob" color="var(--color-red)" position={[180, 150]} />
			<Cursor name="Charlie" color="var(--color-green)" position={[320, 90]} />
		</div>
	),
};

function InteractiveCursorContainer() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [targetPosition, setTargetPosition] = useState<[number, number]>([150, 100]);
	const lastMousePosition = useRef<[number, number]>([150, 100]);

	// Keep track of the user's mouse position inside the container
	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			lastMousePosition.current = [event.clientX - rect.left, event.clientY - rect.top];
		}
	};

	// Periodically update the collaborator's target position to match the user's mouse position.
	// This showcases perfect-cursors interpolating between sparse/delayed updates.
	useEffect(() => {
		const interval = setInterval(() => {
			setTargetPosition(lastMousePosition.current);
		}, 300);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			ref={containerRef}
			onMouseMove={handleMouseMove}
			className="relative h-64 w-125 overflow-hidden rounded-lg border-2 border-edge bg-white shadow-cel-inset-sm dark:bg-zinc"
		>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-sm font-bold text-muted-foreground select-none">
				Move pointer here
			</div>
			{/* Collaborator cursor that updates target position every 1s */}
			<Cursor name="Collaborator" color="var(--color-purple)" position={targetPosition} />
		</div>
	);
}

export const Interactive: Story = {
	render: () => <InteractiveCursorContainer />,
};

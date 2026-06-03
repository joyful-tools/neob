import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { NumericSlider } from './numeric-slider';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * NumericSlider is a slider widget for selecting numeric ranges or levels.
 *
 * ### General Usage
 * ```tsx
 * import { NumericSlider } from 'neob';
 *
 * <NumericSlider min={0} max={100} value={value} onChange={setValue} />
 * ```
 */
const meta = {
	title: 'Inputs/NumericSlider',
	component: NumericSlider,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof NumericSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointerLockLifecycle: Story = {
	args: {
		onChange: () => {},
	},
	render: (args) => {
		const [value, setValue] = useState(100);
		return (
			<div className="flex flex-col items-center gap-4">
				<NumericSlider
					{...args}
					onChange={(delta) => {
						action('numeric-slider-change')(delta);
						setValue((previous) => Math.round((previous + delta) * 100) / 100);
					}}
				/>
				<div className="rounded-lg border-2 border-black bg-muted px-3 py-1.5 font-mono text-sm font-bold dark:border-white dark:bg-zinc">
					Current Value: {value}
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const slider = canvas.getByTitle('Drag vertically to change value');
		const originalPointerLockDescriptor = Object.getOwnPropertyDescriptor(document, 'pointerLockElement');
		const originalRequestPointerLockDescriptor = Object.getOwnPropertyDescriptor(slider, 'requestPointerLock');
		const originalExitPointerLock = document.exitPointerLock.bind(document);
		const originalConsoleError = console.error;
		let pointerLockElement: Element | null = null;
		let requestCallCount = 0;
		let exitCallCount = 0;
		const consoleErrors: unknown[][] = [];

		Object.defineProperty(document, 'pointerLockElement', {
			configurable: true,
			get: () => pointerLockElement,
		});

		console.error = (...arguments_) => {
			consoleErrors.push(arguments_);
		};

		Object.defineProperty(slider, 'requestPointerLock', {
			configurable: true,
			value: async (options?: PointerLockOptions) => {
				requestCallCount += 1;
				if (requestCallCount === 1 && options && 'unadjustedMovement' in options) {
					throw new Error('unadjusted pointer lock unsupported');
				}
				pointerLockElement = slider;
				document.dispatchEvent(new Event('pointerlockchange'));
			},
		});

		document.exitPointerLock = () => {
			exitCallCount += 1;
			if (exitCallCount === 1) {
				throw new Error('pointer lock release failed');
			}
			pointerLockElement = null;
			document.dispatchEvent(new Event('pointerlockchange'));
		};

		try {
			await userEvent.pointer([{ target: slider, keys: '[MouseLeft>]' }]);

			await waitFor(() => {
				expect(requestCallCount).toBe(2);
			});

			await waitFor(() => {
				expect(slider).toHaveClass('text-orange');
			});

			document.dispatchEvent(new PointerEvent('pointermove', { movementY: -12 }));
			await waitFor(() => {
				expect(canvas.getByText(/Current Value:/i)).toHaveTextContent('Current Value: 112');
			});

			globalThis.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
			await waitFor(() => {
				expect(consoleErrors).toHaveLength(1);
				expect(String(consoleErrors[0]?.[0])).toContain('Exit pointer lock failed:');
			});

			pointerLockElement = null;
			document.dispatchEvent(new Event('pointerlockchange'));
			await waitFor(() => {
				expect(slider).not.toHaveClass('text-orange');
			});

			await userEvent.pointer([{ target: slider, keys: '[MouseLeft>]' }]);
			await waitFor(() => {
				expect(requestCallCount).toBe(3);
			});

			globalThis.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1 }));
			await waitFor(() => {
				expect(exitCallCount).toBe(2);
				expect(slider).not.toHaveClass('text-orange');
			});
		} finally {
			console.error = originalConsoleError;
			if (originalRequestPointerLockDescriptor) {
				Object.defineProperty(slider, 'requestPointerLock', originalRequestPointerLockDescriptor);
			} else {
				Object.defineProperty(slider, 'requestPointerLock', {
					configurable: true,
					value: Element.prototype.requestPointerLock,
				});
			}
			document.exitPointerLock = originalExitPointerLock;
			if (originalPointerLockDescriptor) {
				Object.defineProperty(document, 'pointerLockElement', originalPointerLockDescriptor);
			} else {
				Object.defineProperty(document, 'pointerLockElement', {
					configurable: true,
					get: () => null,
				});
			}
		}
	}),
};

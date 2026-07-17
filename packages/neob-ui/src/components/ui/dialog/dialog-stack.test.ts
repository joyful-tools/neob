import { describe, expect, it, vi } from 'vitest';

import { createDialogStackStore } from './dialog-stack';

describe('createDialogStackStore', () => {
	it('isolates stores and closes only the top dialog', () => {
		const firstStore = createDialogStackStore();
		const secondStore = createDialogStackStore();
		const closeFirst = vi.fn();
		const closeTop = vi.fn();

		const unregisterFirst = firstStore.register(1, closeFirst);
		const unregisterTop = firstStore.register(2, closeTop);

		expect(firstStore.getSnapshot()).toBe(2);
		expect(secondStore.getSnapshot()).toBe(0);

		firstStore.closeTop();
		expect(closeTop).toHaveBeenCalledOnce();
		expect(closeFirst).not.toHaveBeenCalled();

		unregisterTop();
		unregisterFirst();
		expect(firstStore.getSnapshot()).toBe(0);
	});
});

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
		expect(firstStore.getTopDialogId()).toBe(2);
		expect(secondStore.getSnapshot()).toBe(0);

		firstStore.closeTop();
		expect(closeTop).toHaveBeenCalledOnce();
		expect(closeFirst).not.toHaveBeenCalled();

		unregisterTop();
		expect(firstStore.getTopDialogId()).toBe(1);
		unregisterFirst();
		expect(firstStore.getSnapshot()).toBe(0);
	});

	it('uses registration order instead of dialog creation order', () => {
		const store = createDialogStackStore();
		const closeOlder = vi.fn();
		const closeNewer = vi.fn();
		const unregisterNewer = store.register(2, closeNewer);
		const unregisterOlder = store.register(1, closeOlder);

		store.closeTop();
		expect(closeOlder).toHaveBeenCalledOnce();
		expect(closeNewer).not.toHaveBeenCalled();

		unregisterOlder();
		unregisterNewer();
	});

	it('restores the previous dialog when the top dialog unregisters', () => {
		const store = createDialogStackStore();
		const closeFirst = vi.fn();
		const closeSecond = vi.fn();
		const unregisterFirst = store.register(1, closeFirst);
		const unregisterSecond = store.register(2, closeSecond);

		expect(store.getTopDialogId()).toBe(2);

		unregisterSecond();
		expect(store.getTopDialogId()).toBe(1);

		unregisterFirst();
	});

	it('does not dismiss a lower dialog through a protected top dialog', () => {
		const store = createDialogStackStore();
		const closeLower = vi.fn();
		const protectedClose = vi.fn();
		const unregisterLower = store.register(1, closeLower);
		const unregisterProtected = store.register(2, protectedClose);

		store.closeTop();
		expect(protectedClose).toHaveBeenCalledOnce();
		expect(closeLower).not.toHaveBeenCalled();

		unregisterProtected();
		unregisterLower();
	});
});

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

	it('stops counting the last dialog as open before its exit completes', () => {
		const store = createDialogStackStore();
		const unregister = store.register(1, vi.fn());

		store.setOpen(1, false);

		expect(store.getSnapshot()).toBe(0);
		expect(store.getTopDialogId()).toBe(1);

		unregister();
		expect(store.getTopDialogId()).toBeUndefined();
	});

	it('keeps the backdrop open while a lower dialog remains open', () => {
		const store = createDialogStackStore();
		const unregisterFirst = store.register(1, vi.fn());
		const unregisterSecond = store.register(2, vi.fn());

		store.setOpen(2, false);

		expect(store.getSnapshot()).toBe(1);
		expect(store.getTopDialogId()).toBe(2);

		unregisterSecond();
		expect(store.getSnapshot()).toBe(1);
		expect(store.getTopDialogId()).toBe(1);

		unregisterFirst();
	});

	it('restores backdrop presence when a closing dialog reopens', () => {
		const store = createDialogStackStore();
		const unregister = store.register(1, vi.fn());

		store.setOpen(1, false);
		store.setOpen(1, true);

		expect(store.getSnapshot()).toBe(1);
		expect(store.getTopDialogId()).toBe(1);

		unregister();
	});

	it('does not dismiss through a top dialog that is still exiting', () => {
		const store = createDialogStackStore();
		const closeFirst = vi.fn();
		const closeSecond = vi.fn();
		const unregisterFirst = store.register(1, closeFirst);
		const unregisterSecond = store.register(2, closeSecond);

		store.setOpen(2, false);
		store.closeTop();

		expect(closeSecond).not.toHaveBeenCalled();
		expect(closeFirst).not.toHaveBeenCalled();

		unregisterSecond();
		store.closeTop();
		expect(closeFirst).toHaveBeenCalledOnce();

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

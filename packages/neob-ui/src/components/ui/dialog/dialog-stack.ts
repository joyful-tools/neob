import { createContext, createElement, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

type DialogStackListener = () => void;

export interface DialogStackStore {
	readonly subscribe: (listener: DialogStackListener) => () => void;
	readonly getSnapshot: () => number;
	readonly register: (dialogId: number, onClose: () => void) => () => void;
	readonly closeTop: () => void;
}

export function createDialogStackStore(): DialogStackStore {
	const listeners = new Set<DialogStackListener>();
	const openDialogIds = new Set<number>();
	const closeCallbacks = new Map<number, () => void>();

	const emit = () => {
		for (const listener of listeners) {
			listener();
		}
	};

	return {
		subscribe: (listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		getSnapshot: () => openDialogIds.size,
		register: (dialogId, onClose) => {
			openDialogIds.add(dialogId);
			closeCallbacks.set(dialogId, onClose);
			emit();
			return () => {
				if (openDialogIds.delete(dialogId)) {
					closeCallbacks.delete(dialogId);
					emit();
				}
			};
		},
		closeTop: () => {
			if (openDialogIds.size === 0) return;
			const topId = Math.max(...openDialogIds);
			closeCallbacks.get(topId)?.();
		},
	};
}

const defaultDialogStackStore = createDialogStackStore();
const DialogStackContext = createContext<DialogStackStore>(defaultDialogStackStore);
let nextDialogId = 0;

export function DialogStackProvider({ children }: { readonly children: ReactNode }) {
	const store = useMemo(() => createDialogStackStore(), []);
	return createElement(DialogStackContext.Provider, { value: store }, children);
}

export function useDialogStackStore(): DialogStackStore {
	return useContext(DialogStackContext);
}

export function subscribeDialogStack(listener: DialogStackListener): () => void {
	return defaultDialogStackStore.subscribe(listener);
}

export function getDialogStackSnapshot(): number {
	return defaultDialogStackStore.getSnapshot();
}

/**
 * Closes the most recently opened dialog that has a registered close callback.
 * Called by the global backdrop on click.
 */
export function closeTopDialog(): void {
	defaultDialogStackStore.closeTop();
}

/**
 * Registers an open dialog with the global stack while `open` is true.
 *
 * The shared backdrop is visible whenever at least one dialog is open,
 * so dialog-to-dialog or menu-to-dialog handoffs share the same single
 * DOM element and never flicker.
 *
 * Pass `onClose` to make the dialog dismissible via a backdrop click.
 * Omit it (e.g. for AlertDialog / ConfirmDialog) to keep it non-dismissible.
 */
export function useDialogStackPresence(open: boolean, onClose?: () => void): void {
	const store = useDialogStackStore();
	const [dialogId] = useState(() => {
		const resolvedDialogId = nextDialogId;
		nextDialogId += 1;
		return resolvedDialogId;
	});

	// Keep the callback ref current without re-running the effect on every render.
	const onCloseReference = useRef(onClose);
	useEffect(() => {
		onCloseReference.current = onClose;
	});

	useEffect(() => {
		if (!open) {
			return;
		}

		return store.register(dialogId, () => onCloseReference.current?.());
	}, [open, dialogId, store]);
}

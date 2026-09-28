import {
	createContext,
	createElement,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from 'react';

type DialogStackListener = () => void;

export interface DialogStackStore {
	readonly subscribe: (listener: DialogStackListener) => () => void;
	readonly getSnapshot: () => number;
	readonly getTopDialogId: () => number | undefined;
	readonly register: (dialogId: number, onClose: () => void) => () => void;
	readonly setOpen: (dialogId: number, open: boolean) => void;
	readonly closeTop: () => void;
}

export function createDialogStackStore(): DialogStackStore {
	const listeners = new Set<DialogStackListener>();
	const presentDialogIds: number[] = [];
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
		getTopDialogId: () => presentDialogIds.at(-1),
		register: (dialogId, onClose) => {
			const existingIndex = presentDialogIds.indexOf(dialogId);
			if (existingIndex !== -1) {
				presentDialogIds.splice(existingIndex, 1);
			}
			presentDialogIds.push(dialogId);
			openDialogIds.add(dialogId);
			closeCallbacks.set(dialogId, onClose);
			emit();
			return () => {
				const index = presentDialogIds.indexOf(dialogId);
				if (index !== -1) {
					presentDialogIds.splice(index, 1);
					openDialogIds.delete(dialogId);
					closeCallbacks.delete(dialogId);
					emit();
				}
			};
		},
		setOpen: (dialogId, open) => {
			if (!presentDialogIds.includes(dialogId) || openDialogIds.has(dialogId) === open) return;

			if (open) {
				openDialogIds.add(dialogId);
			} else {
				openDialogIds.delete(dialogId);
			}
			emit();
		},
		closeTop: () => {
			const topId = presentDialogIds.at(-1);
			if (topId === undefined || !openDialogIds.has(topId)) return;
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
 *
 * A closing top dialog remains present until its exit animation completes,
 * keeping lower dialogs hidden until the top layer has fully left the screen.
 * It stops counting as open immediately so the backdrop can exit alongside the
 * last dialog rather than waiting for the panel animation to finish.
 */
export function useDialogStackPresence(open: boolean, onClose?: () => void): { isTop: boolean; onExitComplete: () => void } {
	const store = useDialogStackStore();
	const [dialogId] = useState(() => {
		const resolvedDialogId = nextDialogId;
		nextDialogId += 1;
		return resolvedDialogId;
	});
	const unregisterReference = useRef<() => void>(undefined);
	const registeredReference = useRef(false);
	const topDialogId = useSyncExternalStore(store.subscribe, store.getTopDialogId, store.getTopDialogId);
	const isTop = topDialogId === dialogId;

	// Keep the callback ref current without re-running the effect on every render.
	const onCloseReference = useRef(onClose);
	useEffect(() => {
		onCloseReference.current = onClose;
	});

	const unregister = useCallback(() => {
		unregisterReference.current?.();
		unregisterReference.current = undefined;
		registeredReference.current = false;
	}, []);

	useLayoutEffect(() => {
		if (open && !registeredReference.current) {
			unregisterReference.current = store.register(dialogId, () => onCloseReference.current?.());
			registeredReference.current = true;
			return;
		}

		if (!open && !isTop) {
			unregister();
			return;
		}

		if (registeredReference.current) {
			store.setOpen(dialogId, open);
		}
	}, [dialogId, isTop, open, store, unregister]);

	useLayoutEffect(() => unregister, [unregister]);

	const onExitComplete = useCallback(() => {
		if (!open) {
			unregister();
		}
	}, [open, unregister]);

	return { isTop, onExitComplete };
}

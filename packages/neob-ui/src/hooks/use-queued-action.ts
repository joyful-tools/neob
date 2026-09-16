import { useActionState, useCallback, useTransition } from 'react';

import type { Action } from '@/lib/actions';

export interface QueuedActionState<Arguments extends unknown[]> {
	readonly runAction: (...arguments_: Arguments) => Promise<void>;
	readonly isPending: boolean;
}

interface QueuedActionPayload<Arguments extends unknown[]> {
	readonly arguments: Arguments;
	readonly resolve: () => void;
	readonly reject: (reason: unknown) => void;
}

export function useQueuedAction<Arguments extends unknown[]>(action: Action<Arguments> | undefined): QueuedActionState<Arguments> {
	const [, dispatchAction, isPending] = useActionState((_previousState: null, payload: QueuedActionPayload<Arguments>) => {
		try {
			const result = action?.(...payload.arguments);
			if (result) {
				return result.then(
					() => {
						payload.resolve();
						return null;
					},
					(error: unknown) => {
						payload.reject(error);
						throw error;
					},
				);
			}
			payload.resolve();
			return null;
		} catch (error) {
			payload.reject(error);
			throw error;
		}
	}, null);
	const [, startTransition] = useTransition();

	const runAction = useCallback(
		(...arguments_: Arguments) => {
			return new Promise<void>((resolve, reject) => {
				startTransition(() => {
					dispatchAction({ arguments: arguments_, resolve, reject });
				});
			});
		},
		[dispatchAction, startTransition],
	);

	return { runAction, isPending };
}

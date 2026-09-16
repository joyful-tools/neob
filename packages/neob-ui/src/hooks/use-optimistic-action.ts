import { useActionState, useCallback, useOptimistic, useTransition } from 'react';

import type { Action } from '@/lib/actions';

interface OptimisticActionPayload<Value, Details extends unknown[]> {
	readonly value: Value;
	readonly details: Details;
}

interface CommittedActionState<Value> {
	readonly value: Value | undefined;
}

export interface UseOptimisticActionOptions<Value, Details extends unknown[]> {
	readonly value: Value | undefined;
	readonly defaultValue: Value | undefined;
	readonly action: Action<[value: Value, ...details: Details]> | undefined;
}

export interface OptimisticActionState<Value, Details extends unknown[]> {
	readonly optimisticValue: Value | undefined;
	readonly runAction: Action<[value: Value, ...details: Details]>;
	readonly isPending: boolean;
}

export function useOptimisticAction<Value, Details extends unknown[]>({
	value,
	defaultValue,
	action,
}: UseOptimisticActionOptions<Value, Details>): OptimisticActionState<Value, Details> {
	const [committedState, dispatchAction, isPending] = useActionState(
		(_previousState: CommittedActionState<Value>, payload: OptimisticActionPayload<Value, Details>) => {
			const result = action?.(payload.value, ...payload.details);
			if (result) {
				return result.then(() => ({ value: payload.value }));
			}
			return { value: payload.value };
		},
		{ value: defaultValue },
	);
	const canonicalValue = value === undefined ? committedState.value : value;
	const [optimisticValue, setOptimisticValue] = useOptimistic(
		canonicalValue,
		(_currentValue: Value | undefined, payload: OptimisticActionPayload<Value, Details>) => payload.value,
	);
	const [, startTransition] = useTransition();

	const runAction = useCallback(
		(nextValue: Value, ...details: Details) => {
			const payload = { value: nextValue, details };
			startTransition(() => {
				setOptimisticValue(payload);
				dispatchAction(payload);
			});
		},
		[dispatchAction, setOptimisticValue, startTransition],
	);

	return { optimisticValue, runAction, isPending };
}

export type Action<Arguments extends unknown[] = []> = (...arguments_: Arguments) => void | Promise<void>;

export function afterAction(result: void | Promise<void>, onSuccess: () => void): void | Promise<void> {
	if (result) {
		return result.then(onSuccess);
	}
	onSuccess();
}

/**
 * Utilities for guarding and toggling Storybook interactions
 * to make Storybook interactions user-controlled and accessibility-friendly.
 *
 * Inspired by the approach described in:
 * https://github.blog/engineering/user-experience/how-to-make-storybook-interactions-respect-user-motion-preferences/
 */

export const INTERACTION_STORAGE_KEY = 'disableInteractions';

export const STORYBOOK_INTERACTIONS_FORCE_ENABLE = 'storybook-force-enable-interactions';

function getStoredInteractionPreference() {
	if (globalThis.window === undefined) return null;
	return globalThis.window.localStorage.getItem(INTERACTION_STORAGE_KEY);
}

export function shouldInteractionPlay() {
	if (globalThis.window === undefined) return true;
	if (globalThis.window.sessionStorage.getItem(STORYBOOK_INTERACTIONS_FORCE_ENABLE) === 'true') return true;

	const disableInteractions = getStoredInteractionPreference();
	// Disabled by default for human users (returns false when disableInteractions is null)
	return disableInteractions === 'false';
}

export function guardPlay<TContext>(play: (context: TContext) => Promise<void> | void) {
	return async (context: TContext) => {
		if (!shouldInteractionPlay()) return;
		await play(context);
	};
}

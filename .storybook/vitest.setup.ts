import '@storybook/addon-vitest/internal/setup-file';

import { INTERACTION_STORAGE_KEY, STORYBOOK_INTERACTIONS_FORCE_ENABLE } from '../packages/neob-ui/src/lib/storybook-interactions';

const originalMatchMedia = globalThis.window.matchMedia.bind(globalThis.window);

globalThis.window.localStorage.setItem(INTERACTION_STORAGE_KEY, 'false');
globalThis.window.sessionStorage.setItem(STORYBOOK_INTERACTIONS_FORCE_ENABLE, 'true');
Object.defineProperty(globalThis.navigator, 'clipboard', {
	configurable: true,
	value: {
		writeText: async () => {},
	},
});

globalThis.window.matchMedia = (query: string) => {
	if (query === '(prefers-reduced-motion: reduce)') {
		return {
			matches: true,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		};
	}

	return originalMatchMedia(query);
};

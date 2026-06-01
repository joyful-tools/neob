import { PlayIcon, StopIcon } from '@storybook/icons';
import { useCallback, useState } from 'react';
import { IconButton } from 'storybook/internal/components';

import { INTERACTION_STORAGE_KEY } from '../src/lib/storybook-interactions';

export const ADDON_ID = 'toggle-interaction';
export const TOOL_ID = `${ADDON_ID}/tool`;

function getInitialDisableInteractions() {
	const storedPreference = globalThis.window.localStorage.getItem(INTERACTION_STORAGE_KEY);
	if (storedPreference !== null) return storedPreference === 'true';

	// Default is disabled for human users
	return true;
}

export function InteractionToggle() {
	const [disableInteractions, setDisableInteractions] = useState(getInitialDisableInteractions);

	const toggleInteractions = useCallback(() => {
		const nextValue = !disableInteractions;
		globalThis.window.localStorage.setItem(INTERACTION_STORAGE_KEY, `${nextValue}`);
		setDisableInteractions(nextValue);
		globalThis.window.location.reload();
	}, [disableInteractions]);

	return (
		<IconButton
			aria-label="Disable Interactions"
			onClick={toggleInteractions}
			defaultChecked={disableInteractions}
			aria-pressed={disableInteractions}
		>
			{disableInteractions ? <PlayIcon /> : <StopIcon />}
			Interactions
		</IconButton>
	);
}

import * as React from 'react';
import { addons, types } from 'storybook/manager-api';

import { ADDON_ID, InteractionToggle, TOOL_ID } from './interaction-toggle';

addons.register(ADDON_ID, () => {
	addons.add(TOOL_ID, {
		title: 'toggle interaction',
		type: types.TOOL,
		match: ({ viewMode, tabId }) => viewMode === 'story' && !tabId,
		render: () => <InteractionToggle />,
	});
});

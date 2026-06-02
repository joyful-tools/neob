import { Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { MotionGlobalConfig } from 'motion/react';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';

import type { Preview } from '@storybook/react-vite';

import '../packages/ui/src/index.css';
import './storybook.css';

if (
	globalThis.window !== undefined &&
	(/StorybookTestRunner/i.test(globalThis.navigator.userAgent) || '__vitest_browser__' in globalThis.window)
) {
	MotionGlobalConfig.skipAnimations = true;
}

const preview: Preview = {
	parameters: {
		backgrounds: {
			disable: true,
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'error',
		},
		docs: {
			page: () => (
				<>
					<Title />
					<Subtitle />
					<Description />
					<Primary />
					<Stories includePrimary={false} />
				</>
			),
		},
		layout: 'fullscreen',
		options: {
			storySort: {
				order: ['*', 'Experiments'],
			},
		},
	},
	globalTypes: {
		theme: {
			description: 'Global theme for components',
			defaultValue: 'light',
			toolbar: {
				title: 'Theme',
				icon: 'circlehollow',
				items: [
					{ value: 'light', icon: 'circlehollow', title: 'Light' },
					{ value: 'dark', icon: 'circle', title: 'Dark' },
				],
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme || 'light';

			useEffect(() => {
				const htmlElement = document.documentElement;
				htmlElement.classList.toggle('dark', theme === 'dark');
			}, [theme]);

			return (
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			);
		},
	],
};

export default preview;

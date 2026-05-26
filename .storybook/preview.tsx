import type { Preview } from '@storybook/react-vite';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '../src/index.css';

const preview: Preview = {
	parameters: {
		backgrounds: {
			default: 'light',
			values: [
				{
					name: 'light',
					value: '#ffffff',
				},
				{
					name: 'dark',
					value: '#121212',
				},
			],
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: 'fullscreen',
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
				showName: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme || 'light';

			React.useEffect(() => {
				const htmlElement = document.documentElement;
				htmlElement.classList.toggle('dark', theme === 'dark');
			}, [theme]);

			const isCentered = context.parameters.layout === 'centered';

			return (
				<MemoryRouter>
					<div
						className={`bg-background text-foreground min-h-screen p-8 transition-colors duration-200 ${
							isCentered ? 'flex items-center justify-center' : ''
						}`}
					>
						<Story />
					</div>
				</MemoryRouter>
			);
		},
	],
};

export default preview;

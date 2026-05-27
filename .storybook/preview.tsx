import type { Preview } from '@storybook/react-vite';
import * as React from 'react';
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { MemoryRouter } from 'react-router-dom';
import '../src/index.css';

const preview: Preview = {
	parameters: {
		backgrounds: {
			default: 'light',
			values: [
				{
					name: 'light',
					value: '#faf7f2',
				},
				{
					name: 'dark',
					value: '#1b1b1b',
				},
			],
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
					<Controls />
					<Stories includePrimary={false} />
				</>
			),
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
			const isDocs = context.viewMode === 'docs';

			return (
				<MemoryRouter>
					<div
						className={`bg-background text-foreground transition-colors duration-200 ${
							isDocs ? 'p-4' : 'min-h-screen p-8'
						} ${isCentered ? 'flex items-center justify-center' : ''}`}
					>
						<Story />
					</div>
				</MemoryRouter>
			);
		},
	],
};

export default preview;

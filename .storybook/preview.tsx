import { Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

function PreviewFrame({
	children,
	theme,
	isCentered,
	isDocs,
}: {
	children: React.ReactNode;
	theme: string;
	isCentered: boolean;
	isDocs: boolean;
}) {
	React.useEffect(() => {
		const htmlElement = document.documentElement;
		htmlElement.classList.toggle('dark', theme === 'dark');
	}, [theme]);

	return (
		<MemoryRouter>
			<div
				className={`bg-background text-foreground transition-colors duration-200 ${isDocs ? 'p-4' : 'min-h-screen p-8'} ${isCentered ? 'flex items-center justify-center' : ''}`}
			>
				{children}
			</div>
		</MemoryRouter>
	);
}

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
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme || 'light';

			const isCentered = context.parameters.layout === 'centered';
			const isDocs = context.viewMode === 'docs';

			return (
				<PreviewFrame theme={theme} isCentered={isCentered} isDocs={isDocs}>
					<Story />
				</PreviewFrame>
			);
		},
	],
};

export default preview;

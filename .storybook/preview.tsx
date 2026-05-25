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
	decorators: [
		(Story, context) => {
			const selectedBackground = context.globals.backgrounds?.value;

			React.useEffect(() => {
				const htmlElement = document.documentElement;
				// Synchronize dark class based on the selected Storybook background color
				if (selectedBackground === '#121212') {
					htmlElement.classList.add('dark');
					document.body.style.backgroundColor = '#121212';
					document.body.style.color = '#ffffff';
				} else {
					htmlElement.classList.remove('dark');
					document.body.style.backgroundColor = '#ffffff';
					document.body.style.color = '#000000';
				}
			}, [selectedBackground]);

			const isCentered = context.parameters.layout === 'centered';

			return (
				<MemoryRouter>
					<div
						className={`p-8 min-h-screen bg-background text-foreground transition-colors duration-200 ${
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

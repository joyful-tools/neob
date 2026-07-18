import { Description, DocsContainer, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { MotionGlobalConfig } from 'motion/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useEffect } from 'storybook/preview-api';
import { themes } from 'storybook/theming';

import type { Preview } from '@storybook/react-vite';

import '../packages/neob-ui/src/index.css';
import './storybook.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemedContainer = ({ children, context }: any) => {
	const globals = context?.store?.userGlobals?.globals || context?.globals;
	const isDark = globals?.theme === 'dark';
	const theme = isDark ? themes.dark : themes.light;

	React.useEffect(() => {
		const htmlElement = document.documentElement;
		htmlElement.classList.toggle('dark', isDark);
	}, [isDark]);

	return (
		<DocsContainer context={context} theme={theme}>
			{children}
		</DocsContainer>
	);
};

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
			config: {
				rules: [{ id: 'aria-hidden-focus', enabled: false }],
			},
		},
		docs: {
			container: ThemedContainer,
			components: {
				h1: ({ children }: React.ComponentProps<'h1'>) => (
					<h1 className="mt-8 mb-4 font-display text-4xl font-black text-foreground">{children}</h1>
				),
				h2: ({ children }: React.ComponentProps<'h2'>) => (
					<h2 className="mt-6 mb-3 font-display text-2xl font-bold text-foreground">{children}</h2>
				),
				h3: ({ children }: React.ComponentProps<'h3'>) => (
					<h3 className="mt-4 mb-2 font-display text-xl font-bold text-foreground">{children}</h3>
				),
				p: ({ children }: React.ComponentProps<'p'>) => <p className="my-4 font-sans text-base/relaxed text-foreground/90">{children}</p>,
				a: ({ children, href, ...props }: React.ComponentProps<'a'>) => (
					<a href={href} className="font-medium text-orange hover:underline" {...props}>
						{children}
					</a>
				),
				ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="my-4 list-disc pl-6 text-foreground/90">{children}</ul>,
				ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="my-4 list-decimal pl-6 text-foreground/90">{children}</ol>,
				li: ({ children }: React.ComponentProps<'li'>) => <li className="my-1">{children}</li>,
				code: ({ children }: React.ComponentProps<'code'>) => (
					<code className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{children}</code>
				),
				table: ({ children }: React.ComponentProps<'table'>) => (
					<table className="my-6 w-full border-collapse border-2 border-black">{children}</table>
				),
				thead: ({ children }: React.ComponentProps<'thead'>) => <thead className="bg-black text-white">{children}</thead>,
				tbody: ({ children }: React.ComponentProps<'tbody'>) => <tbody>{children}</tbody>,
				tr: ({ children }: React.ComponentProps<'tr'>) => <tr className="border-b border-border">{children}</tr>,
				th: ({ children }: React.ComponentProps<'th'>) => (
					<th className="px-4 py-2 text-left font-display text-sm font-black text-white uppercase">{children}</th>
				),
				td: ({ children }: React.ComponentProps<'td'>) => <td className="border-r border-border px-4 py-2 text-foreground">{children}</td>,
			},
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

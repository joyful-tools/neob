import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-vitest'],
	framework: {
		name: '@storybook/react-vite',
		options: {
			builder: {
				viteConfigPath: 'packages/ui/vite.config.ts',
			},
		},
	},
};
export default config;

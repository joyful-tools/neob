import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
	viteConfig,
	defineConfig({
		plugins: [
			storybookTest({
				configDir: path.join(rootDirectory, '.storybook'),
				storybookScript: 'bun run storybook --ci',
			}),
		],
		test: {
			name: 'storybook',
			browser: {
				enabled: true,
				provider: 'playwright',
				headless: true,
				instances: [{ browser: 'chromium' }],
			},
			setupFiles: ['./.storybook/vitest.setup.ts'],
		},
	}),
);

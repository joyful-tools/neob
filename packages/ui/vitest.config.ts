import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
	viteConfig,
	defineConfig({
		plugins: [
			storybookTest({
				configDir: path.resolve(rootDirectory, '../../.storybook'),
				storybookScript: 'bun run storybook --ci',
			}),
		],
		test: {
			name: 'storybook',
			browser: {
				enabled: true,
				provider: playwright(),
				headless: true,
				instances: [{ browser: 'chromium' }],
			},
			setupFiles: [path.resolve(rootDirectory, '../../.storybook/vitest.setup.ts')],
			coverage: {
				provider: 'v8',
				reporter: ['text', 'html', 'lcov', 'json-summary'],
				reportsDirectory: path.resolve(rootDirectory, '../../coverage/storybook'),
				exclude: ['dist/**', 'storybook-static/**', '**/*.stories.*', '.storybook/**', 'src/lib/storybook-interactions.ts'],
			},
		},
	}),
);

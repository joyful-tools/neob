import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import packageJson from './package.json' with { type: 'json' };
import { publicComponentEntries } from './public-api';

const componentsDir = path.resolve(__dirname, 'src/components/ui');
const externalDependencies = [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)];

const entryPoints: Record<string, string> = {
	index: path.resolve(__dirname, 'src/index.ts'),
};

for (const entry of publicComponentEntries) {
	entryPoints[entry] = path.resolve(componentsDir, entry, 'index.ts');
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		react(),
		dts({
			insertTypesEntry: true,
			tsconfigPath: './tsconfig.json',
			include: ['src'],
			exclude: ['src/**/*.stories.tsx', 'src/**/*.test.ts'],
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		lib: {
			entry: entryPoints,
			name: 'neob',
			formats: ['es', 'cjs'],
			fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: {
			external: (id) => externalDependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`)),
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react/jsx-runtime': 'jsxRuntime',
				},
				assetFileNames: (assetInfo) => {
					if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'index.css';
					return assetInfo.name || '';
				},
			},
		},
		sourcemap: true,
		minify: true,
	},
});

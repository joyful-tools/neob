import fs from 'node:fs';
import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// Find only source component TSX files dynamically (excluding stories and tests)
const componentsDir = path.resolve(__dirname, 'src/components/ui');
const componentFiles = fs
	.readdirSync(componentsDir)
	.filter((file) => file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && !file.endsWith('.test.tsx'));

const entryPoints: Record<string, string> = {
	index: path.resolve(__dirname, 'src/index.ts'),
};

for (const file of componentFiles) {
	const name = path.basename(file, '.tsx');
	entryPoints[name] = path.resolve(componentsDir, file);
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		react(),
		dts({
			insertTypesEntry: true,
			tsconfigPath: './tsconfig.json',
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
			external: ['react', 'react-dom', 'react/jsx-runtime'],
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

import fs from 'node:fs';
import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// Find component directories dynamically and register their index.ts as entry points
const componentsDir = path.resolve(__dirname, 'src/components/ui');
const dirs = fs.readdirSync(componentsDir).filter((file) => {
	const fullPath = path.join(componentsDir, file);
	return fs.statSync(fullPath).isDirectory() && file !== 'experiments';
});

const entryPoints: Record<string, string> = {
	index: path.resolve(__dirname, 'src/index.ts'),
};

for (const dir of dirs) {
	const indexPath = path.resolve(componentsDir, dir, 'index.ts');
	if (fs.existsSync(indexPath)) {
		entryPoints[dir] = indexPath;
	}
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

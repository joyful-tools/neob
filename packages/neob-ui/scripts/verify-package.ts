import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { publicComponentEntries } from '../public-api';

const cjsRequire = createRequire(import.meta.url);
const packageRoot = path.resolve(import.meta.dirname, '..');
const distDirectory = path.join(packageRoot, 'dist');
const requiredEntries = ['index', ...publicComponentEntries];

async function verifyPackage(): Promise<void> {
	for (const entry of requiredEntries) {
		if (entry !== 'index') {
			const sourceEntry = path.join(packageRoot, 'src', 'components', 'ui', entry, 'index.ts');
			if (!existsSync(sourceEntry)) {
				throw new Error(`Missing source entry declared by public API manifest: ${sourceEntry}`);
			}
		}

		for (const extension of ['js', 'cjs', 'd.ts']) {
			const outputPath = path.join(distDirectory, `${entry}.${extension}`);
			if (!existsSync(outputPath)) {
				throw new Error(`Missing package output: ${outputPath}`);
			}
		}

		await import(pathToFileURL(path.join(distDirectory, `${entry}.js`)).href);
		cjsRequire(path.join(distDirectory, `${entry}.cjs`));
	}

	if (!existsSync(path.join(distDirectory, 'index.css'))) {
		throw new Error('Missing package stylesheet: dist/index.css');
	}
}

await verifyPackage();

export default {
	'*.{ts,tsx}': () => ['bun run typecheck'],
	'*.{js,mjs,cjs,jsx,ts,tsx}': (stagedFiles) => [`prettier --check ${stagedFiles.join(' ')}`, `eslint ${stagedFiles.join(' ')}`],
	'*.{json,jsonc,css,html}': (stagedFiles) => `prettier --check ${stagedFiles.join(' ')}`,
	'*.md': (stagedFiles) => `prettier --check ${stagedFiles.join(' ')}`,
};

export default {
	'*.{ts,tsx}': () => ['bun run typecheck'],
	'*.{js,mjs,cjs,jsx,ts,tsx}': (stagedFiles) => [`prettier --write ${stagedFiles.join(' ')}`, `eslint --fix ${stagedFiles.join(' ')}`],
	'*.{json,jsonc,css,html}': (stagedFiles) => `prettier --write ${stagedFiles.join(' ')}`,
	'*.md': (stagedFiles) => `prettier --write ${stagedFiles.join(' ')}`,
};

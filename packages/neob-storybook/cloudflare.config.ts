import { defineConfig } from 'cf/config';

export default defineConfig({
	worker: {
		name: 'neob-storybook',
		compatibilityDate: '2026-05-26',
		workersDev: false,
		previewUrls: true,
		observability: {
			issues: {
				enabled: true,
			},
		},
		assets: {
			notFoundHandling: 'single-page-application',
		},
		domains: ['neob.joyful.tools'],
	},
});

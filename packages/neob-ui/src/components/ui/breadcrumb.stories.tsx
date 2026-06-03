import { FolderIcon, HouseIcon, FileTextIcon } from '@phosphor-icons/react';
import { expect, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Breadcrumb } from './breadcrumb';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Breadcrumb is a hierarchy path indicator with copying features.
 *
 * ### General Usage
 * ```tsx
 * import { Breadcrumb } from 'neob';
 *
 * <Breadcrumb value="/projects/neob/components">
 *   <Breadcrumb.Link href="/projects">Projects</Breadcrumb.Link>
 *   <Breadcrumb.Separator />
 *   <Breadcrumb.Link href="/projects/neob">neob</Breadcrumb.Link>
 *   <Breadcrumb.Separator />
 *   <Breadcrumb.Current>Components</Breadcrumb.Current>
 *   <Breadcrumb.Clipboard />
 * </Breadcrumb>
 * ```
 */
const meta = {
	title: 'Navigation/Breadcrumb',
	component: Breadcrumb,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: null,
	},
	render: () => (
		<div className="w-full max-w-3xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
			<Breadcrumb>
				<Breadcrumb.Link href="/" icon={<HouseIcon className="size-4" weight="fill" />}>
					Home
				</Breadcrumb.Link>
				<Breadcrumb.Separator />
				<Breadcrumb.Link href="/docs" icon={<FolderIcon className="size-4" weight="fill" />}>
					Docs
				</Breadcrumb.Link>
				<Breadcrumb.Separator />
				<Breadcrumb.Link href="/docs/components">Components</Breadcrumb.Link>
				<Breadcrumb.Separator />
				<Breadcrumb.Current icon={<FileTextIcon className="size-4" weight="fill" />}>Breadcrumb</Breadcrumb.Current>
				<Breadcrumb.Clipboard text="/docs/components/breadcrumb" />
			</Breadcrumb>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('link', { name: 'Home' })).toBeInTheDocument();
		await expect(canvas.getAllByText('Breadcrumb').length).toBeGreaterThan(0);
	}),
};

export const LoadingCurrent: Story = {
	args: {
		children: null,
	},
	render: () => (
		<div className="w-full max-w-xl rounded-xl border border-black/10 bg-card p-4 dark:border-white/10">
			<Breadcrumb size="sm">
				<Breadcrumb.Link href="/workspace">Workspace</Breadcrumb.Link>
				<Breadcrumb.Separator />
				<Breadcrumb.Link href="/workspace/projects">Projects</Breadcrumb.Link>
				<Breadcrumb.Separator />
				<Breadcrumb.Current loading>Loading current page</Breadcrumb.Current>
			</Breadcrumb>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('link', { name: 'Workspace' })).toBeInTheDocument();
		await expect(canvas.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
	}),
};

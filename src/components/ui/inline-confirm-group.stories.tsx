import * as React from 'react';
import { useState } from 'react';

import { InlineConfirmGroup } from './inline-confirm-group';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/InlineConfirmGroup',
	component: InlineConfirmGroup,
	parameters: {
		layout: 'centered',
	},
	args: {
		itemName: 'Item',
		onConfirm: () => {},
	},
} satisfies Meta<typeof InlineConfirmGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

interface FileItem {
	id: string;
	name: string;
	size: string;
}

const RealWorldList = () => {
	const [files, setFiles] = useState<FileItem[]>([
		{ id: '1', name: 'package.json', size: '2.4 KB' },
		{ id: '2', name: 'vite.config.ts', size: '1.2 KB' },
		{ id: '3', name: 'index.css', size: '12 KB' },
		{ id: '4', name: 'README.md', size: '4.5 KB' },
	]);
	const [deletingIds, setDeletingIds] = useState<string[]>([]);

	const handleDelete = async (id: string) => {
		setDeletingIds((previous) => [...previous, id]);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setFiles((previous) => previous.filter((file) => file.id !== id));
		setDeletingIds((previous) => previous.filter((deletingId) => deletingId !== id));
	};

	return (
		<div className="w-[450px] rounded-xl border-4 border-black bg-white p-6 text-black shadow-brutal dark:bg-zinc dark:text-white">
			<h3 className="mb-4 border-b-2 border-black pb-2 font-display text-lg font-bold">Project Directory Files</h3>
			<p className="mb-4 text-xs text-muted-foreground">
				Click the ghost trash icon, then confirm by clicking the trash again (the cancel button will spawn directly under your mouse).
			</p>
			<ul className="space-y-3">
				{files.map((file) => (
					<li key={file.id} className="flex items-center justify-between rounded-lg border-2 border-black bg-zinc/5 p-3">
						<div>
							<p className="font-mono text-sm font-bold">{file.name}</p>
							<p className="text-xs text-black/60 dark:text-white/60">{file.size}</p>
						</div>
						<div className="flex items-center gap-2">
							<InlineConfirmGroup
								itemName={file.name}
								onConfirm={() => void handleDelete(file.id)}
								isLoading={deletingIds.includes(file.id)}
							/>
						</div>
					</li>
				))}
				{files.length === 0 && <p className="py-4 text-center text-sm font-bold text-black/60 dark:text-white/60">No files remaining.</p>}
			</ul>
		</div>
	);
};

export const Default: Story = {
	render: () => <RealWorldList />,
};

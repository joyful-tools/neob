import * as React from 'react';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { InlineConfirmGroup } from './inline-confirm-group';

import type { Meta, StoryObj } from '@storybook/react-vite';

type InlineConfirmGroupStoryProperties = {
	initialFiles: FileItem[];
};

const meta = {
	title: 'Inputs/InlineConfirmGroup',
	component: InlineConfirmGroup,
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof InlineConfirmGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

interface FileItem {
	id: string;
	name: string;
	size: string;
}

const RealWorldList = ({ initialFiles }: InlineConfirmGroupStoryProperties) => {
	const [files, setFiles] = useState<FileItem[]>(initialFiles);
	const [deletingIds, setDeletingIds] = useState<string[]>([]);

	const handleDelete = async (id: string) => {
		action('inline-confirm-delete')(id);
		setDeletingIds((previous) => [...previous, id]);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setFiles((previous) => previous.filter((file) => file.id !== id));
		setDeletingIds((previous) => previous.filter((deletingId) => deletingId !== id));
	};

	return (
		<div className="w-[450px] rounded-xl border-4 border-black bg-white p-6 text-black shadow-cel-md dark:bg-zinc dark:text-white">
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

export const Default = {
	args: {
		initialFiles: [
			{ id: '1', name: 'package.json', size: '2.4 KB' },
			{ id: '2', name: 'vite.config.ts', size: '1.2 KB' },
			{ id: '3', name: 'index.css', size: '12 KB' },
			{ id: '4', name: 'README.md', size: '4.5 KB' },
		],
	},
	render: (args: InlineConfirmGroupStoryProperties) => <RealWorldList {...args} />,
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvas.getAllByRole('button');
		await userEvent.click(buttons[0]);
		await expect(canvas.getAllByRole('button').length).toBeGreaterThan(1);
	}),
};

export const KeyboardAndOutsideCancel: Story = {
	args: {
		itemName: 'package.json',
		onConfirm: () => {},
	},
	render: () => {
		const [cancelCount, setCancelCount] = React.useState(0);
		return (
			<div className="flex min-h-40 items-start justify-start p-8">
				<div className="flex flex-col gap-4">
					<InlineConfirmGroup
						itemName="package.json"
						onConfirm={() => {
							action('inline-confirm-keyboard-confirm')();
						}}
						onCancel={() => {
							action('inline-confirm-keyboard-cancel')();
							setCancelCount((previous) => previous + 1);
						}}
					/>
					<p className="font-mono text-sm font-bold">Cancel Count: {cancelCount}</p>
					<button type="button" className="rounded-md border-2 border-black px-3 py-2 font-bold">
						Outside Target
					</button>
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Delete package.json' }));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'Cancel delete package.json' })).toHaveFocus();
		});

		await userEvent.keyboard('{ArrowRight}');
		await expect(canvas.getByRole('button', { name: 'Confirm delete package.json' })).toHaveFocus();

		await userEvent.keyboard('{Tab}');
		await expect(canvas.getByRole('button', { name: 'Cancel delete package.json' })).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(canvas.queryByRole('group', { name: 'Delete confirmation for package.json' })).not.toBeInTheDocument();
			expect(canvas.getByText('Cancel Count: 1')).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Delete package.json' }));
		await waitFor(() => {
			expect(canvas.getByRole('group', { name: 'Delete confirmation for package.json' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Outside Target' }));
		await waitFor(() => {
			expect(canvas.queryByRole('group', { name: 'Delete confirmation for package.json' })).not.toBeInTheDocument();
			expect(canvas.getByText('Cancel Count: 2')).toBeInTheDocument();
		});
	}),
};

export const ConfirmAndLoadingState: Story = {
	args: {
		itemName: 'README.md',
		onConfirm: () => {},
	},
	render: () => {
		const [confirmed, setConfirmed] = React.useState(false);
		return (
			<div className="flex flex-col gap-6 p-8">
				<div className="flex items-center gap-4">
					<InlineConfirmGroup
						itemName="README.md"
						onConfirm={() => {
							action('inline-confirm-confirm')();
							setConfirmed(true);
						}}
						onCancel={() => {
							action('inline-confirm-loading-cancel')();
						}}
					/>
					<p className="font-mono text-sm font-bold">Confirmed: {confirmed ? 'yes' : 'no'}</p>
				</div>
				<div className="flex items-center gap-4">
					<InlineConfirmGroup
						itemName="locked-file.txt"
						isLoading
						onConfirm={() => {
							action('inline-confirm-loading-confirm')();
						}}
					/>
					<p className="font-mono text-sm font-bold">Loading Delete Control</p>
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Delete README.md' }));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'Confirm delete README.md' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Confirm delete README.md' }));
		await waitFor(() => {
			expect(canvas.getByText('Confirmed: yes')).toBeInTheDocument();
			expect(canvas.queryByRole('button', { name: 'Confirm delete README.md' })).not.toBeInTheDocument();
		});

		const loadingDeleteButton = canvas.getByRole('button', { name: 'Delete locked-file.txt' });
		await expect(loadingDeleteButton).toBeDisabled();
		await expect(canvas.queryByRole('group', { name: 'Delete confirmation for locked-file.txt' })).not.toBeInTheDocument();
	}),
};

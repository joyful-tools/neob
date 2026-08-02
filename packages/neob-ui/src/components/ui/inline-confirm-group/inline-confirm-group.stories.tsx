import { ArchiveIcon, DownloadSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import { ReactElement, useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { InlineConfirmGroup, InlineConfirmGroupIntent } from './inline-confirm-group';

import type { Meta } from '@storybook/react-vite';

type InlineConfirmGroupStoryProperties = {
	initialFiles: FileItem[];
};

/**
 * InlineConfirmGroup provides an inline action confirmation panel inside normal content blocks.
 *
 * ### Usage
 * ```tsx
 * import { InlineConfirmGroup, Button } from '@joyful-tools/neob';
 *
 * <InlineConfirmGroup onConfirm={handleConfirm} onCancel={handleCancel}>
 *   <Button>Confirm Delete</Button>
 * </InlineConfirmGroup>
 * ```
 */
const meta = {
	title: 'Inputs/InlineConfirmGroup',
	component: InlineConfirmGroup,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof InlineConfirmGroup>;

export default meta;

type FileAction = 'delete' | 'archive' | 'download';

interface FileActionOption {
	kind: FileAction;
}

interface FileItem {
	id: string;
	name: string;
	size: string;
	actions: FileActionOption[];
}

function getActionProperties(kind: FileAction): {
	actionLabel: string;
	actionIcon: ReactElement<{ className?: string }>;
	intent: InlineConfirmGroupIntent;
} {
	switch (kind) {
		case 'archive': {
			return {
				actionLabel: 'Archive',
				actionIcon: <ArchiveIcon />,
				intent: 'info',
			};
		}
		case 'download': {
			return {
				actionLabel: 'Download',
				actionIcon: <DownloadSimpleIcon />,
				intent: 'success',
			};
		}
		default: {
			return {
				actionLabel: 'Delete',
				actionIcon: <TrashIcon />,
				intent: 'danger',
			};
		}
	}
}

const RealWorldList = ({ initialFiles }: InlineConfirmGroupStoryProperties) => {
	const [files, setFiles] = useState<FileItem[]>(initialFiles);
	const [loadingActionIds, setLoadingActionIds] = useState<string[]>([]);

	const handleAction = async (id: string, kind: FileAction) => {
		const actionId = `${id}-${kind}`;
		action('inline-confirm-action')({ id, kind });
		setLoadingActionIds((previous) => [...previous, actionId]);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		if (kind !== 'download') {
			setFiles((previous) => previous.filter((file) => file.id !== id));
		}
		setLoadingActionIds((previous) => previous.filter((loadingId) => loadingId !== actionId));
	};

	return (
		<div className="w-112.5 rounded-xl border-4 border-edge bg-white p-6 text-black shadow-cel-md dark:bg-zinc dark:text-white">
			<h3 className="mb-4 border-b-2 border-edge pb-2 font-display text-lg font-bold">Project Directory Files</h3>
			<p className="mb-4 text-xs text-muted-foreground">
				Each file supports delete, while only some files also expose archive or download actions.
			</p>
			<ul className="space-y-3">
				{files.map((file) => (
					<li key={file.id} className="flex items-center justify-between rounded-lg border-2 border-edge bg-zinc/5 p-3">
						<div>
							<p className="font-mono text-sm font-bold">{file.name}</p>
							<p className="text-xs text-black/60 dark:text-white/60">{file.size}</p>
						</div>
						<div className="flex items-center gap-2">
							{file.actions.map((fileAction) => {
								const actionProperties = getActionProperties(fileAction.kind);
								const actionId = `${file.id}-${fileAction.kind}`;

								return (
									<InlineConfirmGroup
										key={actionId}
										itemName={file.name}
										actionLabel={actionProperties.actionLabel}
										actionIcon={actionProperties.actionIcon}
										intent={actionProperties.intent}
										onConfirm={() => void handleAction(file.id, fileAction.kind)}
										isLoading={loadingActionIds.includes(actionId)}
									/>
								);
							})}
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
			{
				id: '1',
				name: 'package.json',
				size: '2.4 KB',
				actions: [{ kind: 'download' }, { kind: 'delete' }],
			},
			{
				id: '2',
				name: 'release-notes.md',
				size: '1.2 KB',
				actions: [{ kind: 'download' }, { kind: 'delete' }],
			},
			{
				id: '3',
				name: 'invoices.csv',
				size: '12 KB',
				actions: [{ kind: 'download' }, { kind: 'archive' }],
			},
			{
				id: '4',
				name: 'README.md',
				size: '4.5 KB',
				actions: [{ kind: 'download' }, { kind: 'delete' }],
			},
		],
	},
	render: (args: InlineConfirmGroupStoryProperties) => <RealWorldList {...args} />,
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Archive invoices.csv' }));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'Cancel archive invoices.csv' })).toHaveFocus();
		});

		await userEvent.keyboard('{ArrowRight}');
		await expect(canvas.getByRole('button', { name: 'Confirm archive invoices.csv' })).toHaveFocus();

		await userEvent.keyboard('{Tab}');
		await expect(canvas.getByRole('button', { name: 'Cancel archive invoices.csv' })).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(canvas.queryByRole('group', { name: 'Archive confirmation for invoices.csv' })).not.toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Archive invoices.csv' }));
		await waitFor(() => {
			expect(canvas.getByRole('group', { name: 'Archive confirmation for invoices.csv' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByText('Project Directory Files'));
		await waitFor(() => {
			expect(canvas.queryByRole('group', { name: 'Archive confirmation for invoices.csv' })).not.toBeInTheDocument();
		});
	}),
};

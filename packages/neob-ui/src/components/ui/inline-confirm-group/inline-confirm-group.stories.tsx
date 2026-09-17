import { ArchiveIcon, DownloadSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import { ReactElement, useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { guardPlay } from '@/lib/storybook-interactions';

import { InlineConfirmGroup } from './inline-confirm-group';

import type { InlineConfirmGroupIntent, InlineConfirmGroupProperties } from './inline-confirm-group';
import type { Meta } from '@storybook/react-vite';

type InlineConfirmGroupStoryProperties = Pick<InlineConfirmGroupProperties, 'variant' | 'color' | 'size'> & {
	initialFiles: FileItem[];
};

/**
 * InlineConfirmGroup provides an inline action confirmation panel inside normal content blocks.
 *
 * ### Usage
 * ```tsx
 * import { InlineConfirmGroup, Button } from '@joyful-tools/neob';
 *
 * <InlineConfirmGroup action={handleConfirm} onCancel={handleCancel}>
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
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'danger', 'subtle', 'ghost', 'link', 'dark-default', 'dark-subtle', 'dark-ghost'],
		},
		color: {
			control: 'select',
			options: ['cyan', 'gold', 'zinc', 'coral', 'blue', 'purple', 'pink', 'yellow', 'red', 'green'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'xl', 'icon'],
		},
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
		default: {
			return {
				actionLabel: 'Delete',
				actionIcon: <TrashIcon />,
				intent: 'danger',
			};
		}
	}
}

function handleDownload(id: string) {
	action('download-file')({ id });
}

const RealWorldList = ({ initialFiles, variant, color, size }: InlineConfirmGroupStoryProperties) => {
	const [files, setFiles] = useState<FileItem[]>(initialFiles);
	const [pendingActionIds, setPendingActionIds] = useState<Set<string>>(() => new Set<string>());

	const removeFile = (id: string) => {
		setFiles((previous) => previous.filter((file) => file.id !== id));
	};

	const handleArchive = (id: string) => {
		action('archive-file')({ id });
		removeFile(id);
	};

	const handleDelete = async (id: string, actionId: string) => {
		action('delete-file')({ id });
		setPendingActionIds((previous) => new Set(previous).add(actionId));
		await new Promise((resolve) => setTimeout(resolve, 1500));
		removeFile(id);
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
								const actionId = `${file.id}-${fileAction.kind}`;
								if (fileAction.kind === 'download') {
									return (
										<Button
											key={actionId}
											type="button"
											variant={variant}
											color={color}
											size={size}
											action={() => handleDownload(file.id)}
											aria-label={`Download ${file.name}`}
										>
											<DownloadSimpleIcon className="size-5" />
										</Button>
									);
								}

								const actionProperties = getActionProperties(fileAction.kind);
								const isPending = pendingActionIds.has(actionId);

								return (
									<div
										key={actionId}
										role={isPending ? 'status' : undefined}
										aria-label={isPending ? `Delete ${file.name} in progress` : undefined}
										className="inline-flex"
									>
										<div className="inline-flex" inert={isPending ? true : undefined}>
											<InlineConfirmGroup
												itemName={file.name}
												actionLabel={actionProperties.actionLabel}
												actionIcon={isPending ? <Spinner size="sm" /> : actionProperties.actionIcon}
												intent={actionProperties.intent}
												variant={variant}
												color={color}
												size={size}
												action={fileAction.kind === 'archive' ? () => handleArchive(file.id) : () => void handleDelete(file.id, actionId)}
											/>
										</div>
									</div>
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
		variant: 'ghost',
		size: 'icon',
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

		await userEvent.click(canvas.getByRole('button', { name: 'Download invoices.csv' }));
		await expect(canvas.queryByRole('group', { name: 'Download confirmation for invoices.csv' })).not.toBeInTheDocument();

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
			expect(canvas.getByRole('button', { name: 'Archive invoices.csv' })).toBeVisible();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Delete package.json' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Cancel delete package.json' }));
		const restoredTrigger = canvas.getByRole('button', { name: 'Delete package.json' });
		const restoredTriggerContainer = restoredTrigger.parentElement;
		if (!restoredTriggerContainer) throw new Error('Expected the restored trigger to have a motion container.');
		await waitFor(() => {
			expect(restoredTrigger).toBeVisible();
			expect(getComputedStyle(restoredTriggerContainer).opacity).toBe('1');
		});
		await new Promise((resolve) => setTimeout(resolve, 500));
		await expect(restoredTrigger).toBeVisible();

		await userEvent.click(canvas.getByRole('button', { name: 'Archive invoices.csv' }));
		await waitFor(() => {
			expect(canvas.getByRole('group', { name: 'Archive confirmation for invoices.csv' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByText('Project Directory Files'));
		await waitFor(() => {
			expect(canvas.queryByRole('group', { name: 'Archive confirmation for invoices.csv' })).not.toBeInTheDocument();
			expect(canvas.getByRole('button', { name: 'Archive invoices.csv' })).toBeVisible();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Archive invoices.csv' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Confirm archive invoices.csv' }));
		await waitFor(() => {
			expect(canvas.queryByText('invoices.csv')).not.toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Delete release-notes.md' }));
		const deleteConfirmation = canvas.getByRole('group', { name: 'Delete confirmation for release-notes.md' });
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		const deleteConfirmationStyle = getComputedStyle(deleteConfirmation);
		await expect(deleteConfirmationStyle.opacity).toBe('1');
		await expect(deleteConfirmationStyle.borderTopLeftRadius).toBe('8px');
		await userEvent.click(canvas.getByRole('button', { name: 'Confirm delete release-notes.md' }));
		await waitFor(() => {
			expect(canvas.queryByRole('group', { name: 'Delete confirmation for release-notes.md' })).not.toBeInTheDocument();
			expect(canvas.getByRole('status', { name: 'Delete release-notes.md in progress' })).toBeVisible();
		});
		await waitFor(
			() => {
				expect(canvas.queryByText('release-notes.md')).not.toBeInTheDocument();
			},
			{ timeout: 2500 },
		);
	}),
};

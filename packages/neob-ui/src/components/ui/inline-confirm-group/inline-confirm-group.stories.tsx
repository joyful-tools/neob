import { ArchiveIcon, DownloadSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import { ReactElement, useState } from 'react';
import { action } from 'storybook/actions';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { guardPlay } from '@/lib/storybook-interactions';

import { InlineConfirmGroup } from './inline-confirm-group';

import type { InlineConfirmGroupIntent, InlineConfirmGroupProperties } from './inline-confirm-group';
import type { Meta } from '@storybook/react-vite';

type InlineConfirmGroupStoryProperties = Pick<InlineConfirmGroupProperties, 'variant' | 'color' | 'size' | 'direction'> & {
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
		direction: {
			control: 'select',
			options: ['left', 'right'],
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

const RealWorldList = ({ initialFiles, variant, color, size, direction }: InlineConfirmGroupStoryProperties) => {
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
												direction={direction}
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
		direction: 'left',
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
		const body = within(canvasElement.ownerDocument.body);

		await userEvent.click(canvas.getByRole('button', { name: 'Download invoices.csv' }));
		await expect(body.queryByRole('group', { name: 'Download confirmation for invoices.csv' })).not.toBeInTheDocument();

		const archiveTrigger = canvas.getByRole('button', { name: 'Archive invoices.csv' });
		const archiveTriggerBounds = archiveTrigger.getBoundingClientRect();
		fireEvent.click(archiveTrigger);
		const archiveConfirmation = body.getByRole('group', { name: 'Archive confirmation for invoices.csv' });
		expect(canvasElement.contains(archiveConfirmation)).toBe(false);
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		const archiveMorphBounds = archiveConfirmation.getBoundingClientRect();
		expect(Math.abs(archiveMorphBounds.right - archiveTriggerBounds.right)).toBeLessThan(1);
		await waitFor(() => {
			expect(archiveConfirmation.style.transform).not.toBe('');
			expect(archiveConfirmation).not.toHaveAttribute('data-opening');
			expect(body.getByRole('button', { name: 'Cancel archive invoices.csv' })).toHaveFocus();
		});
		expect(archiveConfirmation.style.backgroundColor).not.toBe('');
		expect(archiveConfirmation.style.borderTopColor).toBe('');
		expect(archiveConfirmation.style.boxShadow).toBe('');
		const archiveMorphBorder = archiveConfirmation.querySelector<HTMLElement>('[data-morph-border]');
		if (!archiveMorphBorder) throw new Error('Expected the confirmation morph border.');
		const archiveSurfaceBorder = archiveConfirmation.querySelector<HTMLElement>('[data-surface-border]');
		if (!archiveSurfaceBorder) throw new Error('Expected the confirmation surface border.');
		expect(getComputedStyle(archiveMorphBorder).borderTopWidth).toBe('0px');
		expect(getComputedStyle(archiveMorphBorder).borderRightWidth).toBe('0px');
		expect(getComputedStyle(archiveMorphBorder).borderBottomWidth).toBe('0px');
		expect(getComputedStyle(archiveMorphBorder).borderLeftWidth).toBe('0px');
		expect(getComputedStyle(archiveMorphBorder).borderTopColor).toBe('rgba(0, 0, 0, 0)');
		expect(getComputedStyle(archiveSurfaceBorder).opacity).toBe('1');
		const cancelArchiveBounds = body.getByRole('button', { name: 'Cancel archive invoices.csv' }).getBoundingClientRect();
		const confirmArchiveBounds = body.getByRole('button', { name: 'Confirm archive invoices.csv' }).getBoundingClientRect();
		expect(
			Math.abs(cancelArchiveBounds.left + cancelArchiveBounds.width / 2 - (archiveTriggerBounds.left + archiveTriggerBounds.width / 2)),
		).toBeLessThan(2);
		expect(confirmArchiveBounds.right).toBeLessThanOrEqual(archiveTriggerBounds.left + 1);

		await userEvent.keyboard('{ArrowRight}');
		await expect(body.getByRole('button', { name: 'Confirm archive invoices.csv' })).toHaveFocus();

		await userEvent.keyboard('{Tab}');
		await expect(body.getByRole('button', { name: 'Cancel archive invoices.csv' })).toHaveFocus();

		fireEvent.keyDown(archiveConfirmation, { key: 'Escape' });
		expect(archiveConfirmation).toHaveAttribute('data-closing', '');
		expect(getComputedStyle(archiveTrigger).visibility).toBe('hidden');
		await waitFor(() => {
			expect(body.queryByRole('group', { name: 'Archive confirmation for invoices.csv' })).not.toBeInTheDocument();
			expect(canvas.getByRole('button', { name: 'Archive invoices.csv' })).toHaveFocus();
			expect(getComputedStyle(archiveTrigger).visibility).toBe('visible');
		});

		const deleteTrigger = canvas.getByRole('button', { name: 'Delete package.json' });
		const deleteTriggerBounds = deleteTrigger.getBoundingClientRect();
		fireEvent.click(deleteTrigger);
		const packageDeleteConfirmation = body.getByRole('group', { name: 'Delete confirmation for package.json' });
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		const deleteMorphBounds = packageDeleteConfirmation.getBoundingClientRect();
		expect(Math.abs(deleteMorphBounds.right - deleteTriggerBounds.right)).toBeLessThan(1);
		await userEvent.click(body.getByRole('button', { name: 'Cancel delete package.json' }));
		const restoredTrigger = await canvas.findByRole('button', { name: 'Delete package.json' }, { timeout: 2500 });
		await waitFor(() => {
			expect(restoredTrigger).toBeVisible();
			expect(restoredTrigger).toHaveFocus();
		});
		await new Promise((resolve) => setTimeout(resolve, 500));
		await expect(restoredTrigger).toBeVisible();

		await userEvent.click(canvas.getByRole('button', { name: 'Archive invoices.csv' }));
		await waitFor(() => {
			expect(body.getByRole('group', { name: 'Archive confirmation for invoices.csv' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByText('Project Directory Files'));
		await waitFor(() => {
			expect(body.queryByRole('group', { name: 'Archive confirmation for invoices.csv' })).not.toBeInTheDocument();
			expect(canvas.getByRole('button', { name: 'Archive invoices.csv' })).toBeVisible();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Archive invoices.csv' }));
		await userEvent.click(body.getByRole('button', { name: 'Confirm archive invoices.csv' }));
		await waitFor(() => {
			expect(canvas.queryByText('invoices.csv')).not.toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Delete release-notes.md' }));
		const deleteConfirmation = body.getByRole('group', { name: 'Delete confirmation for release-notes.md' });
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		const deleteConfirmationStyle = getComputedStyle(deleteConfirmation);
		await expect(deleteConfirmationStyle.opacity).toBe('1');
		await expect(deleteConfirmationStyle.borderTopLeftRadius).toBe('8px');
		await userEvent.click(body.getByRole('button', { name: 'Confirm delete release-notes.md' }));
		await waitFor(() => {
			expect(body.queryByRole('group', { name: 'Delete confirmation for release-notes.md' })).not.toBeInTheDocument();
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

export const Directions = {
	render: () => (
		<div className="flex items-center gap-24">
			<InlineConfirmGroup itemName="left item" direction="left" action={() => {}} />
			<InlineConfirmGroup itemName="right item" direction="right" action={() => {}} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);

		for (const direction of ['left', 'right']) {
			const trigger = canvas.getByRole('button', { name: `Delete ${direction} item` });
			const triggerBounds = trigger.getBoundingClientRect();
			fireEvent.click(trigger);
			const confirmation = body.getByRole('group', { name: `Delete confirmation for ${direction} item` });
			await waitFor(() => expect(confirmation).not.toHaveAttribute('data-opening'));

			await waitFor(() => {
				const cancelBounds = body.getByRole('button', { name: `Cancel delete ${direction} item` }).getBoundingClientRect();
				const confirmBounds = body.getByRole('button', { name: `Confirm delete ${direction} item` }).getBoundingClientRect();
				expect(Math.abs(cancelBounds.left + cancelBounds.width / 2 - (triggerBounds.left + triggerBounds.width / 2))).toBeLessThan(2);
				if (direction === 'left') {
					expect(confirmBounds.right).toBeLessThanOrEqual(triggerBounds.left + 1);
				} else {
					expect(confirmBounds.left).toBeGreaterThanOrEqual(triggerBounds.right - 1);
				}
			});

			fireEvent.keyDown(confirmation, { key: 'Escape' });
			await waitFor(() => expect(body.queryByRole('group', { name: `Delete confirmation for ${direction} item` })).not.toBeInTheDocument());
		}
	}),
};

export const TriggerStyles = {
	render: () => (
		<div className="flex items-center gap-6">
			<InlineConfirmGroup itemName="ghost item" variant="ghost" action={() => {}} />
			<InlineConfirmGroup itemName="filled item" variant="default" action={() => {}} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);

		for (const { itemName, shouldFade } of [
			{ itemName: 'ghost item', shouldFade: true },
			{ itemName: 'filled item', shouldFade: false },
		]) {
			fireEvent.click(canvas.getByRole('button', { name: `Delete ${itemName}` }));
			const confirmation = body.getByRole('group', { name: `Delete confirmation for ${itemName}` });
			await waitFor(() => expect(confirmation).not.toHaveAttribute('data-opening'));
			const surfaceBorder = confirmation.querySelector<HTMLElement>('[data-surface-border]');
			if (!surfaceBorder) throw new Error('Expected the confirmation surface border.');
			if (shouldFade) {
				expect(surfaceBorder).toHaveAttribute('data-surface-transition', 'fade');
			} else {
				expect(surfaceBorder).not.toHaveAttribute('data-surface-transition');
			}

			fireEvent.keyDown(confirmation, { key: 'Escape' });
			await waitFor(() => expect(body.queryByRole('group', { name: `Delete confirmation for ${itemName}` })).not.toBeInTheDocument());
		}
	}),
};

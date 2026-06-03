import { Archive, DownloadSimple, Trash } from '@phosphor-icons/react';
import { ReactElement, useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { InlineConfirmGroup, InlineConfirmGroupIntent } from './inline-confirm-group';

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
				actionIcon: <Archive />,
				intent: 'info',
			};
		}
		case 'download': {
			return {
				actionLabel: 'Download',
				actionIcon: <DownloadSimple />,
				intent: 'success',
			};
		}
		default: {
			return {
				actionLabel: 'Delete',
				actionIcon: <Trash />,
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
		<div className="w-[450px] rounded-xl border-4 border-black bg-white p-6 text-black shadow-cel-md dark:bg-zinc dark:text-white">
			<h3 className="mb-4 border-b-2 border-black pb-2 font-display text-lg font-bold">Project Directory Files</h3>
			<p className="mb-4 text-xs text-muted-foreground">
				Each file supports delete, while only some files also expose archive or download actions.
			</p>
			<ul className="space-y-3">
				{files.map((file) => (
					<li key={file.id} className="flex items-center justify-between rounded-lg border-2 border-black bg-zinc/5 p-3">
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
		const [cancelCount, setCancelCount] = useState(0);
		return (
			<div className="flex min-h-40 items-start justify-start p-8">
				<div className="flex flex-col gap-4">
					<InlineConfirmGroup
						itemName="package.json"
						actionLabel="Archive"
						actionIcon={<Archive />}
						intent="info"
						direction="right"
						onConfirm={() => {
							action('inline-confirm-keyboard-confirm')();
						}}
						onCancel={() => {
							action('inline-confirm-keyboard-cancel')();
							setCancelCount((previous) => previous + 1);
						}}
					/>
					<p className="font-mono text-sm font-bold">Cancel Count: {cancelCount}</p>
					<Button type="button">Outside Target</Button>
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Archive package.json' }));
		await waitFor(() => {
			expect(canvas.getByRole('button', { name: 'Cancel archive package.json' })).toHaveFocus();
		});

		await userEvent.keyboard('{ArrowRight}');
		await expect(canvas.getByRole('button', { name: 'Confirm archive package.json' })).toHaveFocus();

		await userEvent.keyboard('{Tab}');
		await expect(canvas.getByRole('button', { name: 'Cancel archive package.json' })).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(canvas.queryByRole('group', { name: 'Archive confirmation for package.json' })).not.toBeInTheDocument();
			expect(canvas.getByText('Cancel Count: 1')).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Archive package.json' }));
		await waitFor(() => {
			expect(canvas.getByRole('group', { name: 'Archive confirmation for package.json' })).toBeInTheDocument();
		});

		await userEvent.click(canvas.getByRole('button', { name: 'Outside Target' }));
		await waitFor(() => {
			expect(canvas.queryByRole('group', { name: 'Archive confirmation for package.json' })).not.toBeInTheDocument();
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
		const [confirmed, setConfirmed] = useState(false);
		return (
			<div className="flex flex-col gap-6 p-8">
				<div className="flex items-center gap-4">
					<InlineConfirmGroup
						itemName="README.md"
						actionLabel="Delete"
						actionIcon={<Trash />}
						intent="danger"
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
						actionLabel="Delete"
						actionIcon={<Trash />}
						intent="danger"
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

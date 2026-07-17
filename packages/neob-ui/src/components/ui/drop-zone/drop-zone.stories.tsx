import { PlusIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, fireEvent, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { DropZone, type DropZoneResult } from './drop-zone';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * DropZone is an interactive area for file dragging, dropping, and validation.
 *
 * ### Usage
 * ```tsx
 * import { DropZone } from '@joyful-tools/neob';
 *
 * <DropZone onDrop={handleFiles} accept={{ 'image/*': ['.png', '.jpg'] }}>
 *   <p>Drag images here or click to select</p>
 * </DropZone>
 * ```
 */
const meta = {
	title: 'Inputs/DropZone',
	component: DropZone,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

class MockFileList implements FileList {
	readonly [index: number]: File;
	readonly length: number;
	private readonly files: File[];

	constructor(files: File[]) {
		this.files = files;
		this.length = files.length;
		for (const [i, file] of files.entries()) {
			Object.defineProperty(this, i, {
				value: file,
				writable: false,
				configurable: false,
				enumerable: true,
			});
		}
	}

	item(index: number): File | null {
		return this[index] || null;
	}

	[Symbol.iterator](): ArrayIterator<File> {
		return this.files[Symbol.iterator]();
	}
}

function createMockDataTransfer(files: File[]): DataTransfer {
	const dataTransfer = new DataTransfer();

	Object.defineProperty(dataTransfer, 'files', {
		value: new MockFileList(files),
		configurable: true,
	});

	const items = files.map((file) => ({
		kind: 'file',
		type: file.type,
		getAsFile: () => file,
	}));

	const itemsObj: Record<string, unknown> = {
		length: items.length,
		add: () => {},
		clear: () => {},
		remove: () => {},
	};
	for (const [i, item] of items.entries()) {
		itemsObj[i] = item;
	}

	Object.defineProperty(dataTransfer, 'items', {
		value: itemsObj,
		configurable: true,
	});

	Object.defineProperty(dataTransfer, 'types', {
		value: ['Files'],
		configurable: true,
	});

	return dataTransfer;
}

export const Default: Story = {
	render: () => {
		const [results, setResults] = useState<DropZoneResult | null>(null);

		return (
			<div className="flex w-112.5 flex-col gap-4">
				<DropZone
					accept={['image/*']}
					onFileDrop={(res) => {
						setResults(res);
						action('onFileDrop')(res);
					}}
				>
					{({ openFilePicker }) => (
						<div className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-black bg-white p-12 text-black select-none dark:border-black dark:bg-zinc dark:text-white">
							<UploadSimpleIcon className="mb-2 size-10 text-orange" />
							<span className="mb-4 text-center font-sans text-sm font-bold">Drag images here to upload or</span>
							<Button type="button" variant="accent" size="sm" onClick={openFilePicker}>
								<PlusIcon className="size-4" />
								<span>Select File</span>
							</Button>
						</div>
					)}
				</DropZone>

				{results && (
					<div className="max-h-40 overflow-auto rounded-xl border-2 border-black bg-muted/20 p-3 font-mono text-xs">
						<div>Accepted: {results.acceptedFiles.map((f) => f.name).join(', ') || 'none'}</div>
						<div className="text-red-dark dark:text-red">
							Rejected: {results.rejectedFiles.map((f) => `${f.file.name} (${f.code})`).join(', ') || 'none'}
						</div>
					</div>
				)}
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const dropzone = canvas.getByTestId('dropzone-container');
		expect(dropzone).toBeInTheDocument();

		const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
		const dataTransfer = createMockDataTransfer([file]);

		fireEvent.dragEnter(dropzone, {
			dataTransfer,
		});
		await new Promise((resolve) => setTimeout(resolve, 100));

		const bodyCanvas = within(canvasElement.ownerDocument.body);
		const dropOverlay = bodyCanvas.queryByText('Drop files here');
		expect(dropOverlay).toBeInTheDocument();

		fireEvent.drop(dropOverlay!, {
			dataTransfer,
		});

		await new Promise((resolve) => setTimeout(resolve, 300));

		const output = canvas.getByText(/Accepted: test-image.png/i);
		expect(output).toBeInTheDocument();

		const rejectedOutput = canvas.getByText(/Rejected: none/i);
		expect(rejectedOutput).toBeInTheDocument();
	}),
};

export const InvalidFileRejection: Story = {
	render: () => {
		const [results, setResults] = useState<DropZoneResult | null>(null);

		return (
			<div className="flex w-112.5 flex-col gap-4">
				<DropZone
					accept={['.png']}
					minSize={100}
					maxSize={1000}
					onFileDrop={(res) => {
						setResults(res);
					}}
				>
					{({ openFilePicker }) => (
						<div className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-black bg-white p-12 text-black select-none dark:bg-zinc dark:text-white">
							<UploadSimpleIcon className="mb-2 size-10 text-orange" />
							<span className="mb-4 text-center font-sans text-sm font-bold">Drag file here (Requires PNG, size: 100B - 1KB)</span>
							<Button type="button" variant="accent" size="sm" onClick={openFilePicker}>
								<PlusIcon className="size-4" />
								<span>Select File</span>
							</Button>
						</div>
					)}
				</DropZone>

				{results && (
					<div className="max-h-40 overflow-auto rounded-xl border-2 border-black bg-muted/20 p-3 font-mono text-xs">
						<div>Accepted: {results.acceptedFiles.map((f) => f.name).join(', ') || 'none'}</div>
						<div className="text-red-dark dark:text-red">
							Rejected: {results.rejectedFiles.map((f) => `${f.file.name} (${f.code})`).join(', ') || 'none'}
						</div>
					</div>
				)}
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const dropzone = canvas.getByTestId('dropzone-container');

		const invalidTypeFile = new File(['small'], 'doc.txt', { type: 'text/plain' });
		const dataTransferInvalid = createMockDataTransfer([invalidTypeFile]);

		fireEvent.dragEnter(dropzone, {
			dataTransfer: dataTransferInvalid,
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		let overlay = within(canvasElement.ownerDocument.body).getByText('Drop files here');
		fireEvent.drop(overlay, {
			dataTransfer: dataTransferInvalid,
		});
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(canvas.getByText(/Rejected: doc.txt \(file-invalid-type\)/i)).toBeInTheDocument();

		const tooSmallFile = new File(['small'], 'pic.png', { type: 'image/png' });
		const dataTransferTooSmall = createMockDataTransfer([tooSmallFile]);

		fireEvent.dragEnter(dropzone, {
			dataTransfer: dataTransferTooSmall,
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		overlay = within(canvasElement.ownerDocument.body).getByText('Drop files here');
		fireEvent.drop(overlay, {
			dataTransfer: dataTransferTooSmall,
		});
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(canvas.getByText(/Rejected: pic.png \(file-too-small\)/i)).toBeInTheDocument();
	}),
};

export const FullPageDropZone: Story = {
	render: () => {
		const [results, setResults] = useState<DropZoneResult | null>(null);

		return (
			<div className="flex w-112.5 flex-col gap-4">
				<DropZone
					fullscreen={true}
					accept={['image/*']}
					onFileDrop={(res) => {
						setResults(res);
						action('onFileDrop')(res);
					}}
				>
					{({ openFilePicker }) => (
						<div className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-black bg-white p-12 text-black select-none dark:border-black dark:bg-zinc dark:text-white">
							<UploadSimpleIcon className="mb-2 size-10 text-orange" />
							<span className="mb-4 text-center font-sans text-sm font-bold">Drag files anywhere on the page</span>
							<Button type="button" variant="accent" size="sm" onClick={openFilePicker}>
								<PlusIcon className="size-4" />
								<span>Select File</span>
							</Button>
						</div>
					)}
				</DropZone>

				{results && (
					<div className="max-h-40 overflow-auto rounded-xl border-2 border-black bg-muted/20 p-3 font-mono text-xs">
						<div>Accepted: {results.acceptedFiles.map((f) => f.name).join(', ') || 'none'}</div>
						<div className="text-red-dark dark:text-red">
							Rejected: {results.rejectedFiles.map((f) => `${f.file.name} (${f.code})`).join(', ') || 'none'}
						</div>
					</div>
				)}
			</div>
		);
	},
};

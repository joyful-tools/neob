import { FileArrowDown } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import {
	ChangeEvent,
	DragEvent as ReactDragEvent,
	HTMLAttributes,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utilities';

const FILE_INVALID_TYPE = 'file-invalid-type';
const FILE_TOO_LARGE = 'file-too-large';
const FILE_TOO_SMALL = 'file-too-small';

export type FileRejectionCode = typeof FILE_INVALID_TYPE | typeof FILE_TOO_LARGE | typeof FILE_TOO_SMALL;

export interface FileRejection {
	file: File;
	code: FileRejectionCode;
	message: string;
}

export interface DropZoneResult {
	acceptedFiles: File[];
	rejectedFiles: FileRejection[];
}

export interface ValidationOptions {
	minSize?: number;
	maxSize?: number;
	acceptedFileTypes?: string[];
}

export function validateFileType(file: File, acceptedFileTypes: string[]): FileRejection | undefined {
	if (!acceptedFileTypes || acceptedFileTypes.length === 0) {
		return undefined;
	}

	const fileName = file.name.trim();
	const mimeType = file.type.trim().toLowerCase();

	if (mimeType === '') {
		// Fallback for file extensions if mime type is missing
		for (const type of acceptedFileTypes) {
			const validType = type.trim().toLowerCase();
			if (validType.startsWith('.') && fileName.toLowerCase().endsWith(validType)) {
				return undefined;
			}
		}
		return {
			file,
			code: FILE_INVALID_TYPE,
			message: `File has an invalid type (${fileName})`,
		};
	}

	const baseMimeType = mimeType.replace(/\/.*$/u, '');

	for (const type of acceptedFileTypes) {
		const validType = type.trim().toLowerCase();
		if (validType.charAt(0) === '.') {
			if (fileName.toLowerCase().endsWith(validType)) {
				return undefined;
			}
		} else if (/\/\*$/u.test(validType)) {
			if (baseMimeType === validType.replace(/\/.*$/u, '')) {
				return undefined;
			}
		} else if (mimeType === validType) {
			return undefined;
		}
	}

	return {
		file,
		code: FILE_INVALID_TYPE,
		message: `File has an invalid type (${fileName})`,
	};
}

export function validateFileSize(file: File, minSize: number, maxSize: number): FileRejection | undefined {
	const fileSize = file.size;
	if (fileSize < minSize) {
		return {
			file,
			code: FILE_TOO_SMALL,
			message: `File is too small (minimum size is ${minSize} bytes)`,
		};
	}
	if (fileSize > maxSize) {
		return {
			file,
			code: FILE_TOO_LARGE,
			message: `File is too large (maximum size is ${maxSize} bytes)`,
		};
	}
	return undefined;
}

export function validateFiles(files: FileList, options: ValidationOptions): DropZoneResult {
	const { minSize = 0, maxSize = Infinity, acceptedFileTypes = [] } = options;

	const acceptedFiles: File[] = [];
	const rejectedFiles: FileRejection[] = [];

	for (let i = 0; i < files.length; i++) {
		const file = files.item(i);
		if (!file) continue;

		const rejection = validateFileType(file, acceptedFileTypes);
		if (rejection) {
			rejectedFiles.push(rejection);
			continue;
		}

		const sizeRejection = validateFileSize(file, minSize, maxSize);
		if (sizeRejection) {
			rejectedFiles.push(sizeRejection);
			continue;
		}

		acceptedFiles.push(file);
	}

	return {
		acceptedFiles,
		rejectedFiles,
	};
}

export function isDragEventWithFiles(event: ReactDragEvent | DragEvent): boolean {
	if ('dataTransfer' in event && event.dataTransfer) {
		return Array.prototype.some.call(event.dataTransfer.types, (type) => type === 'Files' || type === 'application/x-moz-file');
	}
	return false;
}

export interface DropZoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	readonly children?: (props: { dragging: boolean; openFilePicker: () => void }) => ReactNode;
	readonly info?: ReactNode;
	readonly fullscreen?: boolean | string | HTMLElement;
	readonly accept?: string[];
	readonly multiple?: boolean;
	readonly name?: string;
	readonly minSize?: number;
	readonly maxSize?: number;
	readonly onFileDrop?: (result: DropZoneResult) => void;
}

/**
 * DropZone component.
 * Allows file drag and drop with validation and polished overlays.
 */
export function DropZone({
	children,
	info,
	fullscreen = false,
	accept,
	multiple = false,
	name,
	minSize = 0,
	maxSize = Infinity,
	onFileDrop,
	className,
	...properties
}: DropZoneProps) {
	const [dragging, setDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropZoneRef = useRef<HTMLDivElement>(null);
	const dropOverlayRef = useRef<HTMLDivElement>(null);

	const fullscreenElement = useMemo(() => {
		if (globalThis.window === undefined) return null;
		if (fullscreen === false) return null;
		if (fullscreen === true) return document.body;
		if (typeof fullscreen === 'string') {
			const element = document.querySelector(fullscreen);
			if (!(element instanceof HTMLElement)) {
				throw new TypeError(`[DropZone] Unable to find element with selector: ${fullscreen}`);
			}
			return element;
		}
		return fullscreen;
	}, [fullscreen]);

	const openFilePicker = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleInputChange = useCallback(
		(evt: ChangeEvent<HTMLInputElement>) => {
			const { files } = evt.target;
			if (!files || files.length === 0) return;

			onFileDrop?.(
				validateFiles(files, {
					acceptedFileTypes: accept,
					minSize,
					maxSize,
				}),
			);
		},
		[accept, minSize, maxSize, onFileDrop],
	);

	const handleDragEnter = useCallback((event: ReactDragEvent<HTMLDivElement> | DragEvent) => {
		if (!isDragEventWithFiles(event)) return;
		setDragging(true);
	}, []);

	const handleDragLeave = useCallback((event: DragEvent) => {
		if (
			event.relatedTarget === null ||
			(event.relatedTarget instanceof Node &&
				!(dropZoneRef.current?.contains(event.relatedTarget) || dropOverlayRef.current?.contains(event.relatedTarget)))
		) {
			setDragging(false);
		}
	}, []);

	const handleDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
		if (!isDragEventWithFiles(event)) return;
		event.preventDefault();
		try {
			event.dataTransfer.dropEffect = 'copy';
		} catch {
			// ignore
		}
	}, []);

	const handleDrop = useCallback(
		(event: ReactDragEvent<HTMLDivElement>) => {
			setDragging(false);
			if (!isDragEventWithFiles(event)) return;
			event.preventDefault();

			const { dataTransfer } = event;
			if (!dataTransfer) return;

			onFileDrop?.(
				validateFiles(dataTransfer.files, {
					acceptedFileTypes: accept,
					minSize,
					maxSize,
				}),
			);
		},
		[accept, minSize, maxSize, onFileDrop],
	);

	useEffect(() => {
		globalThis.addEventListener('dragleave', handleDragLeave);
		return () => {
			globalThis.removeEventListener('dragleave', handleDragLeave);
		};
	}, [handleDragLeave]);

	useEffect(() => {
		if (!fullscreenElement) return;

		const handleFullscreenDragEnter = (event: DragEvent) => {
			if (!isDragEventWithFiles(event)) return;
			setDragging(true);
		};

		fullscreenElement.addEventListener('dragenter', handleFullscreenDragEnter);
		return () => {
			fullscreenElement.removeEventListener('dragenter', handleFullscreenDragEnter);
		};
	}, [fullscreenElement]);

	const overlay = (
		<AnimatePresence>
			{dragging && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.1, ease: 'easeOut' }}
					ref={dropOverlayRef}
					className={cn(
						'absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 rounded-2xl border-4 border-dashed border-black bg-black/35 p-6 text-white backdrop-blur-xs',
						fullscreenElement && 'fixed inset-0 m-4 border-8',
					)}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<div className="animate-bounce">
						<FileArrowDown className="size-16" />
					</div>
					{info || <div className="font-sans text-xl font-bold">Drop files here</div>}
				</motion.div>
			)}
		</AnimatePresence>
	);

	if (!children) {
		return null;
	}

	return (
		<div
			ref={dropZoneRef}
			data-testid="dropzone-container"
			className={cn('relative', className)}
			onDragEnter={handleDragEnter}
			{...properties}
		>
			<input
				ref={fileInputRef}
				name={name}
				type="file"
				accept={accept?.join(',')}
				multiple={multiple}
				autoComplete="off"
				onChange={handleInputChange}
				tabIndex={-1}
				className="hidden"
			/>
			{fullscreenElement ? createPortal(overlay, fullscreenElement) : overlay}
			{/* eslint-disable-next-line react-hooks/refs */}
			{children({ dragging, openFilePicker })}
		</div>
	);
}
DropZone.displayName = 'DropZone';

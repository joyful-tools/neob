import { useCallback, useEffect, useRef, useState, AriaAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

import { cn } from '@/lib/utilities';

export interface ResizablePanelProperties {
	children?: ReactNode;
	direction?: 'horizontal' | 'vertical';
	defaultSize?: number;
	minSize?: number;
	maxSize?: number;
	onSizeChange?: (size: number) => void;
	className?: string;
	handlePosition?: 'start' | 'end';
}

export function ResizablePanel({
	children,
	direction = 'horizontal',
	defaultSize = 200,
	minSize = 100,
	maxSize = 800,
	onSizeChange,
	className,
	handlePosition = 'end',
}: ResizablePanelProperties) {
	const [size, setSize] = useState(defaultSize);
	const [isResizing, setIsResizing] = useState(false);
	const [isHandleHovered, setIsHandleHovered] = useState(false);
	const panelReference = useRef<HTMLDivElement>(null);
	const startPositionReference = useRef(0);
	const startSizeReference = useRef(0);

	const handleMouseDown = useCallback(
		(event: ReactMouseEvent) => {
			event.preventDefault();
			setIsResizing(true);
			startPositionReference.current = direction === 'horizontal' ? event.clientX : event.clientY;
			startSizeReference.current = size;
		},
		[direction, size],
	);

	useEffect(() => {
		if (!isResizing) return;

		const handleMouseMove = (event: MouseEvent) => {
			const currentPosition = direction === 'horizontal' ? event.clientX : event.clientY;
			const delta = currentPosition - startPositionReference.current;

			// Invert delta if handle is at start
			const adjustedDelta = handlePosition === 'start' ? -delta : delta;

			const newSize = Math.min(maxSize, Math.max(minSize, startSizeReference.current + adjustedDelta));
			setSize(newSize);
			onSizeChange?.(newSize);
		};

		const handleMouseUp = () => {
			setIsResizing(false);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isResizing, direction, minSize, maxSize, onSizeChange, handlePosition]);

	// Prevent text selection during resize
	useEffect(() => {
		if (isResizing) {
			document.body.style.userSelect = 'none';
			document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
		} else {
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
		}

		return () => {
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
		};
	}, [isResizing, direction]);

	const isHorizontal = direction === 'horizontal';
	const sizeStyle = isHorizontal ? { width: size } : { height: size };

	const handleOrientation: AriaAttributes['aria-orientation'] = isHorizontal ? 'vertical' : 'horizontal';

	const handleProperties = {
		role: 'separator' as const,
		'aria-orientation': handleOrientation,
		'aria-valuemin': minSize,
		'aria-valuemax': maxSize,
		'aria-valuenow': size,
		'aria-label': isHorizontal ? 'Resize panel width' : 'Resize panel height',
	};

	const handleStateClasses = isResizing || isHandleHovered ? 'bg-orange' : 'bg-black';

	function renderHandle() {
		return (
			<div className={cn('group relative shrink-0', isHorizontal ? 'w-0 cursor-col-resize' : 'h-0 cursor-row-resize')}>
				<div
					className={cn(
						'absolute z-10 transition-[width,height,background-color] duration-100 ease-out',
						handleStateClasses,
						isHorizontal
							? isResizing || isHandleHovered
								? 'top-0 left-1/2 h-full w-1 -translate-x-1/2 cursor-col-resize'
								: 'top-0 left-1/2 h-full w-0.5 -translate-x-1/2 cursor-col-resize'
							: isResizing || isHandleHovered
								? 'top-1/2 left-0 h-1 w-full -translate-y-1/2 cursor-row-resize'
								: 'top-1/2 left-0 h-0.5 w-full -translate-y-1/2 cursor-row-resize',
					)}
				/>
				<div
					className={cn(
						'absolute z-20 -translate-1/2 bg-transparent',
						isHorizontal ? 'top-1/2 left-1/2 h-full w-4 cursor-col-resize' : 'top-1/2 left-1/2 h-4 w-full cursor-row-resize',
					)}
					onMouseDown={handleMouseDown}
					onMouseEnter={() => setIsHandleHovered(true)}
					onMouseLeave={() => setIsHandleHovered(false)}
					{...handleProperties}
				/>
			</div>
		);
	}

	return (
		<div ref={panelReference} className={cn('relative flex shrink-0', isHorizontal ? 'flex-row' : 'flex-col', className)} style={sizeStyle}>
			{handlePosition === 'start' && renderHandle()}
			<div className="flex-1 overflow-hidden">{children}</div>
			{handlePosition === 'end' && renderHandle()}
		</div>
	);
}

import { XIcon } from '@phosphor-icons/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { toast as sonnerToast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';

interface ToastOptions {
	description?: string;
	action?: { label: string; action: Action };
}

type ToastVariant = 'custom' | 'success' | 'error' | 'info' | 'warning';

const toastStyles: Record<ToastVariant, { background: string; description: string }> = {
	custom: { background: 'bg-white dark:bg-zinc', description: 'text-muted-foreground' },
	success: { background: 'bg-green-light dark:bg-green-dark', description: 'text-green-darkest dark:text-green-lightest' },
	error: { background: 'bg-red-light dark:bg-red-dark', description: 'text-red-darkest dark:text-red-lightest' },
	info: { background: 'bg-blue-light dark:bg-blue-dark', description: 'text-blue-darkest dark:text-blue-lightest' },
	warning: { background: 'bg-yellow-light dark:bg-yellow-dark', description: 'text-yellow-darkest dark:text-yellow-lightest' },
};

interface ToastContentProperties {
	id: number | string;
	title: string;
	variant: ToastVariant;
	options?: ToastOptions;
}

function getIntrinsicWidth(element: HTMLElement) {
	const { width, maxWidth } = element.style;
	element.style.width = 'max-content';
	element.style.maxWidth = 'none';
	const intrinsicWidth = element.offsetWidth;
	element.style.width = width;
	element.style.maxWidth = maxWidth;
	return intrinsicWidth;
}

function ToastContent({ id, title, variant, options }: ToastContentProperties) {
	const contentRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const actionRef = useRef<HTMLButtonElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const [actionFits, setActionFits] = useState(false);
	const inlineAction = Boolean(actionFits && options?.action && !options.description);

	useLayoutEffect(() => {
		const content = contentRef.current;
		const heading = titleRef.current;
		const action = actionRef.current;
		const close = closeRef.current;
		if (!content || !heading || !action || !close || options?.description) return;

		// Only the action changes rows; the close button always stays in the header.
		const updateLayout = () => {
			const contentStyles = getComputedStyle(content);
			const closeStyles = getComputedStyle(close);
			const availableWidth =
				content.clientWidth - Number.parseFloat(contentStyles.paddingLeft) - Number.parseFloat(contentStyles.paddingRight);
			const closeWidth = close.offsetWidth + Number.parseFloat(closeStyles.marginLeft) + Number.parseFloat(closeStyles.marginRight);
			const requiredWidth =
				getIntrinsicWidth(heading) + getIntrinsicWidth(action) + closeWidth + Number.parseFloat(contentStyles.columnGap) * 2;
			setActionFits(requiredWidth <= availableWidth);
		};
		const observer = new ResizeObserver(updateLayout);
		observer.observe(content);
		observer.observe(action);
		document.fonts.addEventListener('loadingdone', updateLayout);
		updateLayout();
		return () => {
			observer.disconnect();
			document.fonts.removeEventListener('loadingdone', updateLayout);
		};
	}, [title, options?.action?.label, options?.description]);

	const actionButton = options?.action && (
		<Button
			ref={actionRef}
			variant="default"
			size="sm"
			className="h-auto min-h-8 max-w-full wrap-anywhere whitespace-normal"
			action={options.action.action}
		>
			{options.action.label}
		</Button>
	);
	const closeButton = (
		<Button
			ref={closeRef}
			aria-label="Close notification"
			variant="ghost"
			size="icon"
			className="col-start-3 row-start-1 -m-2 shrink-0 self-start"
			action={() => {
				sonnerToast.dismiss(id);
			}}
		>
			<XIcon className="size-4" />
		</Button>
	);

	return (
		<div
			ref={contentRef}
			className={cn(
				'grid w-full grid-cols-[minmax(0,1fr)_auto_1.5rem] items-start gap-x-4 rounded-lg border-2 border-edge p-4 font-sans shadow-sm select-none',
				toastStyles[variant].background,
			)}
		>
			<h3
				ref={titleRef}
				className={cn(
					'col-start-1 row-start-1 min-w-0 text-base/snug font-bold wrap-anywhere text-black dark:text-white',
					!inlineAction && 'col-span-2',
				)}
			>
				{title}
			</h3>
			{closeButton}
			{options?.description && (
				<p className={cn('col-span-3 mt-1 text-sm/snug wrap-anywhere', toastStyles[variant].description)}>{options.description}</p>
			)}
			{actionButton && (
				<div className={cn('flex min-w-0 justify-end', inlineAction ? 'col-start-2 row-start-1 -mt-1' : 'col-span-3 mt-3')}>
					{actionButton}
				</div>
			)}
		</div>
	);
}
ToastContent.displayName = 'ToastContent';

function createToast(variant: ToastVariant) {
	return (title: string, options?: ToastOptions) => {
		sonnerToast.custom((id) => <ToastContent id={id} title={title} variant={variant} options={options} />);
	};
}

export const toast = {
	custom: createToast('custom'),
	success: createToast('success'),
	error: createToast('error'),
	info: createToast('info'),
	warning: createToast('warning'),
};

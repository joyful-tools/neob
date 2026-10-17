import { XIcon } from '@phosphor-icons/react';
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

function ToastContent({ id, title, variant, options }: ToastContentProperties) {
	const inlineAction = Boolean(options?.action && !options.description);
	const actionButton = options?.action && (
		<Button
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
			aria-label="Close notification"
			variant="ghost"
			size="icon"
			className="-m-2 shrink-0"
			action={() => {
				sonnerToast.dismiss(id);
			}}
		>
			<XIcon className="size-4" />
		</Button>
	);

	return (
		<div
			className={cn(
				'w-full rounded-lg border-2 border-edge p-4 font-sans shadow-sm select-none',
				inlineAction ? 'flex flex-wrap items-center gap-3' : 'grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4',
				toastStyles[variant].background,
			)}
		>
			<h3 className={cn('min-w-0 text-base/snug font-bold wrap-anywhere text-black dark:text-white', inlineAction && 'flex-auto')}>
				{title}
			</h3>
			{inlineAction ? (
				<div className="ml-auto flex max-w-full items-center gap-4">
					{actionButton}
					{closeButton}
				</div>
			) : (
				<>
					{closeButton}
					{options?.description && (
						<p className={cn('col-span-2 mt-1 text-sm/snug wrap-anywhere', toastStyles[variant].description)}>{options.description}</p>
					)}
					{actionButton && <div className="col-span-2 mt-3 flex min-w-0 justify-end">{actionButton}</div>}
				</>
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

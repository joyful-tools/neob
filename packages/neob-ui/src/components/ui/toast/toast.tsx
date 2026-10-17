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

	return (
		<div
			className={cn(
				'grid min-h-12 w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 rounded-lg border-2 border-edge px-3 py-1 font-sans shadow-sm select-none',
				toastStyles[variant].background,
			)}
		>
			<div className={cn('flex min-h-10 min-w-0 flex-col justify-center gap-2', inlineAction && 'flex-row flex-wrap items-center')}>
				<div className={cn('flex min-w-0 flex-col gap-1 py-2 wrap-anywhere', inlineAction && 'flex-1 basis-2/3')}>
					<h3 className="text-base/snug font-bold text-black dark:text-white">{title}</h3>
					{options?.description && <p className={cn('text-sm/snug', toastStyles[variant].description)}>{options.description}</p>}
				</div>
				{options?.action && (
					<Button
						variant="default"
						size="sm"
						className={cn('self-end', inlineAction && 'ml-auto h-auto min-h-8 max-w-full self-center wrap-anywhere whitespace-normal')}
						action={options.action.action}
					>
						{options.action.label}
					</Button>
				)}
			</div>
			<Button
				aria-label="Close notification"
				variant="ghost"
				size="icon"
				action={() => {
					sonnerToast.dismiss(id);
				}}
			>
				<XIcon className="size-4" />
			</Button>
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

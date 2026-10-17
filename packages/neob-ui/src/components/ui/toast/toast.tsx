import { XIcon } from '@phosphor-icons/react';
import { toast as sonnerToast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';

interface ToastOptions {
	description?: string;
	action?: { label: string; action: Action };
}

export const toast = {
	custom: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div
				className={cn(
					'relative flex min-h-12 w-full flex-col gap-2 rounded-lg border-2 border-edge bg-white px-3 py-2.5 font-sans shadow-sm select-none dark:bg-zinc',
					options?.action && !options.description && 'flex-row flex-wrap items-center pr-12',
				)}
			>
				<div className={cn('flex min-w-0 items-start pr-10', options?.action && !options.description && 'flex-1 basis-2/3 pr-0')}>
					<div className="flex min-w-0 flex-col gap-1 wrap-anywhere">
						<h3 className="text-base/snug font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-muted-foreground">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="absolute top-0.5 right-0.5"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button
						variant="default"
						size="sm"
						className={cn(
							'self-end',
							!options.description && 'ml-auto h-auto min-h-8 max-w-full self-center wrap-anywhere whitespace-normal',
						)}
						action={options.action.action}
					>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	success: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div
				className={cn(
					'relative flex min-h-12 w-full flex-col gap-2 rounded-lg border-2 border-edge bg-green-light px-3 py-2.5 font-sans shadow-sm select-none dark:bg-green-dark',
					options?.action && !options.description && 'flex-row flex-wrap items-center pr-12',
				)}
			>
				<div className={cn('flex min-w-0 items-start pr-10', options?.action && !options.description && 'flex-1 basis-2/3 pr-0')}>
					<div className="flex min-w-0 flex-col gap-1 wrap-anywhere">
						<h3 className="text-base/snug font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-green-darkest dark:text-green-lightest">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="absolute top-0.5 right-0.5"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button
						variant="default"
						size="sm"
						className={cn(
							'self-end',
							!options.description && 'ml-auto h-auto min-h-8 max-w-full self-center wrap-anywhere whitespace-normal',
						)}
						action={options.action.action}
					>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	error: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div
				className={cn(
					'relative flex min-h-12 w-full flex-col gap-2 rounded-lg border-2 border-edge bg-red-light px-3 py-2.5 font-sans shadow-sm select-none dark:bg-red-dark',
					options?.action && !options.description && 'flex-row flex-wrap items-center pr-12',
				)}
			>
				<div className={cn('flex min-w-0 items-start pr-10', options?.action && !options.description && 'flex-1 basis-2/3 pr-0')}>
					<div className="flex min-w-0 flex-col gap-1 wrap-anywhere">
						<h3 className="text-base/snug font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-red-darkest dark:text-red-lightest">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="absolute top-0.5 right-0.5"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button
						variant="default"
						size="sm"
						className={cn(
							'self-end',
							!options.description && 'ml-auto h-auto min-h-8 max-w-full self-center wrap-anywhere whitespace-normal',
						)}
						action={options.action.action}
					>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	info: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div
				className={cn(
					'relative flex min-h-12 w-full flex-col gap-2 rounded-lg border-2 border-edge bg-blue-light px-3 py-2.5 font-sans shadow-sm select-none dark:bg-blue-dark',
					options?.action && !options.description && 'flex-row flex-wrap items-center pr-12',
				)}
			>
				<div className={cn('flex min-w-0 items-start pr-10', options?.action && !options.description && 'flex-1 basis-2/3 pr-0')}>
					<div className="flex min-w-0 flex-col gap-1 wrap-anywhere">
						<h3 className="text-base/snug font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-blue-darkest dark:text-blue-lightest">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="absolute top-0.5 right-0.5"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button
						variant="default"
						size="sm"
						className={cn(
							'self-end',
							!options.description && 'ml-auto h-auto min-h-8 max-w-full self-center wrap-anywhere whitespace-normal',
						)}
						action={options.action.action}
					>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	warning: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div
				className={cn(
					'relative flex min-h-12 w-full flex-col gap-2 rounded-lg border-2 border-edge bg-yellow-light px-3 py-2.5 font-sans shadow-sm select-none dark:bg-yellow-dark',
					options?.action && !options.description && 'flex-row flex-wrap items-center pr-12',
				)}
			>
				<div className={cn('flex min-w-0 items-start pr-10', options?.action && !options.description && 'flex-1 basis-2/3 pr-0')}>
					<div className="flex min-w-0 flex-col gap-1 wrap-anywhere">
						<h3 className="text-base/snug font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-yellow-darkest dark:text-yellow-lightest">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="absolute top-0.5 right-0.5"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button
						variant="default"
						size="sm"
						className={cn(
							'self-end',
							!options.description && 'ml-auto h-auto min-h-8 max-w-full self-center wrap-anywhere whitespace-normal',
						)}
						action={options.action.action}
					>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
};

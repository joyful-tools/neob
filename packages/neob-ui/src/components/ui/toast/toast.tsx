import { XIcon } from '@phosphor-icons/react';
import { toast as sonnerToast } from 'sonner';

import { Button } from '@/components/ui/button';

import type { Action } from '@/lib/actions';

interface ToastOptions {
	description?: string;
	action?: { label: string; action: Action };
}

export const toast = {
	custom: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-edge bg-white p-5 font-sans shadow-sm select-none dark:bg-zinc">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-muted-foreground">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" action={options.action.action}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	success: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-edge bg-green-light p-5 font-sans shadow-sm select-none dark:bg-green-dark">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-green-darkest dark:text-green-lightest">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" action={options.action.action}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	error: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-edge bg-red-light p-5 font-sans shadow-sm select-none dark:bg-red-dark">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-red-darkest dark:text-red-lightest">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" action={options.action.action}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	info: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-edge bg-blue-light p-5 font-sans shadow-sm select-none dark:bg-blue-dark">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-blue-darkest dark:text-blue-lightest">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" action={options.action.action}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	warning: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-edge bg-yellow-light p-5 font-sans shadow-sm select-none dark:bg-yellow-dark">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-white">{title}</h3>
						{options?.description && <p className="text-sm/snug text-yellow-darkest dark:text-yellow-lightest">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						action={() => {
							sonnerToast.dismiss(t);
						}}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" action={options.action.action}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
};

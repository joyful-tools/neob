import { XIcon } from '@phosphor-icons/react';
import { toast as sonnerToast } from 'sonner';

import { Button } from '@/components/ui/button';

interface ToastOptions {
	description?: string;
	action?: { label: string; onClick: () => void };
}

export const toast = {
	custom: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-black bg-white p-5 font-sans shadow-sm select-none dark:bg-zinc">
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
						onClick={() => sonnerToast.dismiss(t)}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" onClick={options.action.onClick}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	success: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-black bg-green-light p-5 font-sans shadow-sm select-none dark:bg-green-dark">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-green-light">{title}</h3>
						{options?.description && <p className="text-sm/snug text-black dark:text-green-light">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						onClick={() => sonnerToast.dismiss(t)}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" onClick={options.action.onClick}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	error: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-black bg-red-light p-5 font-sans shadow-sm select-none dark:bg-red-dark">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-red-light">{title}</h3>
						{options?.description && <p className="text-sm/snug text-black dark:text-red-light">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						onClick={() => sonnerToast.dismiss(t)}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" onClick={options.action.onClick}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	info: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-black bg-blue-light p-5 font-sans shadow-sm select-none dark:bg-blue-dark">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-blue-light">{title}</h3>
						{options?.description && <p className="text-sm/snug text-black dark:text-blue-light">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						onClick={() => sonnerToast.dismiss(t)}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" onClick={options.action.onClick}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
	warning: (title: string, options?: ToastOptions) => {
		sonnerToast.custom((t) => (
			<div className="flex w-full min-w-80 flex-col gap-2 rounded-lg border-2 border-black bg-yellow-light p-5 font-sans shadow-sm select-none dark:bg-yellow-dark">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg/tight font-bold text-black dark:text-yellow-light">{title}</h3>
						{options?.description && <p className="text-sm/snug text-black dark:text-yellow-light">{options.description}</p>}
					</div>
					<Button
						aria-label="Close notification"
						variant="ghost"
						size="icon"
						className="-mt-3 -mr-3 shrink-0"
						onClick={() => sonnerToast.dismiss(t)}
					>
						<XIcon className="size-4" />
					</Button>
				</div>
				{options?.action && (
					<Button variant="default" size="sm" onClick={options.action.onClick}>
						{options.action.label}
					</Button>
				)}
			</div>
		));
	},
};

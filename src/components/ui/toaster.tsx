import * as React from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProperties = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...properties }: ToasterProperties) {
	return (
		<Sonner
			className="group"
			toastOptions={{
				classNames: {
					toast:
						'group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-zinc group-[.toaster]:text-black dark:group-[.toaster]:text-white group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-brutal group-[.toaster]:rounded-lg group-[.toaster]:p-5 group-[.toaster]:gap-4 group-[.toaster]:flex group-[.toaster]:items-start group-[.toaster]:w-full group-[.toaster]:font-sans',
					title:
						'group-[.toast]:font-bold group-[.toast]:text-lg group-[.toast]:text-black dark:group-[.toast]:text-white group-[.toast]:leading-tight',
					description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:leading-snug',
					actionButton:
						'group-[.toast]:bg-black dark:group-[.toast]:bg-white group-[.toast]:text-white dark:group-[.toast]:text-black group-[.toast]:font-bold group-[.toast]:font-sans group-[.toast]:rounded-md group-[.toast]:text-sm group-[.toast]:border-2 group-[.toast]:border-transparent group-[.toast]:transition-transform group-[.toast]:active:translate-y-0.5 group-[.toast]:shadow-brutal-sm hover:group-[.toast]:bg-black/90 dark:hover:group-[.toast]:bg-white/90',
					cancelButton:
						'group-[.toast]:bg-white dark:group-[.toast]:bg-zinc group-[.toast]:text-black dark:group-[.toast]:text-white group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:font-bold group-[.toast]:font-sans group-[.toast]:rounded-md group-[.toast]:text-sm group-[.toast]:transition-transform group-[.toast]:active:translate-y-0.5 group-[.toast]:shadow-brutal-sm hover:group-[.toast]:bg-gray-100 dark:hover:group-[.toast]:bg-zinc/80',
					closeButton:
						'group-[.toast]:!bg-transparent group-[.toast]:!border-2 group-[.toast]:!border-transparent group-[.toast]:!text-black dark:group-[.toast]:!text-white group-[.toast]:!rounded-md group-[.toast]:!size-10 group-[.toast]:!p-0 group-[.toast]:!opacity-100 group-[.toast]:!-right-3 group-[.toast]:!-top-3 group-[.toast]:!transition-transform group-[.toast]:!shadow-none hover:group-[.toast]:!bg-muted/80 focus-visible:group-[.toast]:!outline-none focus-visible:group-[.toast]:!ring-0',
					error:
						'group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-900 dark:group-[.toaster]:!bg-red-dark dark:group-[.toaster]:!text-red-light',
					success:
						'group-[.toaster]:!bg-green-50 group-[.toaster]:!text-green-900 dark:group-[.toaster]:!bg-green-dark dark:group-[.toaster]:!text-green-light',
					warning:
						'group-[.toaster]:!bg-yellow-50 group-[.toaster]:!text-yellow-900 dark:group-[.toaster]:!bg-yellow-dark dark:group-[.toaster]:!text-yellow-light',
					info: 'group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-900 dark:group-[.toaster]:!bg-blue-dark dark:group-[.toaster]:!text-blue-light',
				},
			}}
			{...properties}
		/>
	);
}

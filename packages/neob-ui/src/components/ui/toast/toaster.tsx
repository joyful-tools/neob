import { ComponentProps } from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProperties = ComponentProps<typeof Sonner>;

export function Toaster({ ...properties }: ToasterProperties) {
	return (
		<Sonner
			className="group"
			toastOptions={{
				classNames: {
					toast:
						'group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-zinc group-[.toaster]:text-black dark:group-[.toaster]:text-white group-[.toaster]:border-2 group-[.toaster]:border-edge group-[.toaster]:shadow-cel group-[.toaster]:rounded-lg group-[.toaster]:p-5 group-[.toaster]:gap-4 group-[.toaster]:flex group-[.toaster]:items-start group-[.toaster]:w-full group-[.toaster]:font-sans',
					title:
						'group-[.toast]:font-bold group-[.toast]:text-lg group-[.toast]:text-black dark:group-[.toast]:text-white group-[.toast]:leading-tight',
					description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:leading-snug',
					actionButton:
						'group-[.toast]:button-physical group-[.toast]:rounded-md group-[.toast]:border-2 group-[.toast]:border-transparent group-[.toast]:bg-black group-[.toast]:font-sans group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:text-white hover:group-[.toast]:bg-black/90 dark:group-[.toast]:bg-white dark:group-[.toast]:text-black dark:hover:group-[.toast]:bg-white/90',
					cancelButton:
						'group-[.toast]:button-physical group-[.toast]:rounded-md group-[.toast]:border-2 group-[.toast]:border-edge group-[.toast]:bg-white group-[.toast]:font-sans group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:text-black hover:group-[.toast]:bg-muted dark:group-[.toast]:bg-zinc dark:group-[.toast]:text-white dark:hover:group-[.toast]:bg-zinc/80',
					closeButton:
						'group-[.toast]:neo-focus-ring group-[.toast]:isolate group-[.toast]:!bg-transparent group-[.toast]:!border-2 group-[.toast]:!border-transparent group-[.toast]:!text-black dark:group-[.toast]:!text-white group-[.toast]:!rounded-md group-[.toast]:!size-10 group-[.toast]:!p-0 group-[.toast]:!opacity-100 group-[.toast]:!-right-3 group-[.toast]:!-top-3 group-[.toast]:!outline-none group-[.toast]:!transition-transform group-[.toast]:!shadow-none hover:group-[.toast]:!bg-muted/80',
					error:
						'group-[.toaster]:!bg-red-light group-[.toaster]:!text-red-dark dark:group-[.toaster]:!bg-red-dark dark:group-[.toaster]:!text-red-light',
					success:
						'group-[.toaster]:!bg-green-light group-[.toaster]:!text-green-dark dark:group-[.toaster]:!bg-green-dark dark:group-[.toaster]:!text-green-light',
					warning:
						'group-[.toaster]:!bg-yellow-light group-[.toaster]:!text-yellow-dark dark:group-[.toaster]:!bg-yellow-dark dark:group-[.toaster]:!text-yellow-light',
					info: 'group-[.toaster]:!bg-blue-light group-[.toaster]:!text-blue-dark dark:group-[.toaster]:!bg-blue-dark dark:group-[.toaster]:!text-blue-light',
				},
			}}
			{...properties}
		/>
	);
}
Toaster.displayName = 'Toaster';

import { HTMLAttributes, Ref } from 'react';

import { cn } from '@/lib/utilities';

function CardRoot({ className, ref, ...properties }: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
	return (
		<div
			ref={ref}
			className={cn(
				`rounded-xl border-2 border-edge bg-white text-card-foreground shadow-cel-md transition-all duration-75 ease-out dark:bg-zinc`,
				className,
			)}
			{...properties}
		/>
	);
}
CardRoot.displayName = 'Card';

function CardHeader({ className, ref, ...properties }: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
	return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...properties} />;
}
CardHeader.displayName = 'Card.Header';

function CardTitle({ className, ref, ...properties }: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
	return <div ref={ref} className={cn('font-display text-xl leading-none font-bold tracking-tight', className)} {...properties} />;
}
CardTitle.displayName = 'Card.Title';

function CardContent({ className, ref, ...properties }: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
	return <div ref={ref} className={cn('p-6 pt-0', className)} {...properties} />;
}
CardContent.displayName = 'Card.Content';

export const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Title: CardTitle,
	Content: CardContent,
});

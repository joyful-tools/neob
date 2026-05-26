import * as React from 'react';

import { cn } from '@/lib/utilities';

interface SkeletonProperties extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export function Skeleton({ className, ...properties }: SkeletonProperties) {
	return <div className={cn('animate-pulse rounded-lg border border-black/5 bg-muted', className)} {...properties} />;
}

interface ListSkeletonProperties extends React.HTMLAttributes<HTMLDivElement> {
	itemCount?: number;
	className?: string;
	showLeadingIcon?: boolean;
}

export function ListSkeleton({ itemCount = 4, className, showLeadingIcon = true, ...properties }: ListSkeletonProperties) {
	return (
		<div className={cn('flex flex-col gap-3', className)} {...properties}>
			{Array.from({ length: itemCount }, (_, index) => (
				<div key={index} className="flex items-center gap-4 rounded-xl border-2 border-black bg-white p-4 shadow-brutal-sm dark:bg-zinc">
					{showLeadingIcon ? <Skeleton className="size-10 shrink-0 rounded-full" /> : null}
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-3 w-1/2" />
					</div>
					<Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
				</div>
			))}
		</div>
	);
}
export type { SkeletonProperties, ListSkeletonProperties };

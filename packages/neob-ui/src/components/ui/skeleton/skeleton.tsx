import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utilities';

interface SkeletonProperties extends HTMLAttributes<HTMLDivElement> {
	readonly className?: string;
}

function SkeletonRoot({ className, ...properties }: SkeletonProperties) {
	return <div className={cn('animate-pulse rounded-lg border border-edge/5 bg-muted', className)} {...properties} />;
}
SkeletonRoot.displayName = 'Skeleton';

interface ListSkeletonProperties extends HTMLAttributes<HTMLDivElement> {
	readonly itemCount?: number;
	readonly className?: string;
	readonly showLeadingIcon?: boolean;
}

function ListSkeleton({ itemCount = 4, className, showLeadingIcon = true, ...properties }: ListSkeletonProperties) {
	return (
		<div className={cn('flex flex-col gap-3', className)} {...properties}>
			{Array.from({ length: itemCount }, (_, index) => (
				<div key={index} className="flex items-center gap-4 rounded-xl border-2 border-edge bg-white p-4 shadow-cel-sm dark:bg-zinc">
					{showLeadingIcon ? <SkeletonRoot className="size-10 shrink-0 rounded-full" /> : null}
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<SkeletonRoot className="h-4 w-1/3" />
						<SkeletonRoot className="h-3 w-1/2" />
					</div>
					<SkeletonRoot className="h-8 w-20 shrink-0 rounded-lg" />
				</div>
			))}
		</div>
	);
}
ListSkeleton.displayName = 'Skeleton.List';

export const Skeleton = Object.assign(SkeletonRoot, {
	List: ListSkeleton,
});

export type { SkeletonProperties, ListSkeletonProperties };

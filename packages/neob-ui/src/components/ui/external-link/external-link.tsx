import { ArrowSquareOutIcon } from '@phosphor-icons/react';
import { type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react';

import { cn } from '@/lib/utilities';

export interface ExternalLinkProperties extends AnchorHTMLAttributes<HTMLAnchorElement> {
	readonly ref?: Ref<HTMLAnchorElement>;
	readonly children: ReactNode;
	readonly openInNewTab?: boolean;
	readonly showIcon?: boolean;
}

/**
 * ExternalLink is an anchor link that defaults to opening in a new tab,
 * applying the brutalist underline slide animation and rendering a sliding icon on hover/focus.
 */
export function ExternalLink({ children, openInNewTab = true, showIcon = true, className, ref, ...properties }: ExternalLinkProperties) {
	return (
		<a
			ref={ref}
			target={openInNewTab ? '_blank' : undefined}
			rel={openInNewTab ? 'noopener noreferrer' : undefined}
			className={cn(
				'group neo-focus-ring relative inline-flex items-center underline-slide font-semibold text-black outline-hidden dark:text-white',
				className,
			)}
			{...properties}
		>
			<span>{children}</span>
			{showIcon && (
				<span className="inline-flex w-0 items-center overflow-hidden opacity-0 transition-[width,opacity,margin] duration-150 ease-out group-hover:ml-1 group-hover:w-4 group-hover:opacity-100 group-focus-visible:ml-1 group-focus-visible:w-4 group-focus-visible:opacity-100">
					<ArrowSquareOutIcon className="size-3.5 shrink-0" weight="bold" data-testid="icon" />
				</span>
			)}
		</a>
	);
}
ExternalLink.displayName = 'ExternalLink';

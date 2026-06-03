import { CaretRightIcon, CheckIcon, CopyIcon, DotsThreeIcon } from '@phosphor-icons/react';
import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	Children,
	cloneElement,
	HTMLAttributes,
	isValidElement,
	MouseEvent,
	ReactElement,
	ReactNode,
	useEffect,
	useState,
} from 'react';

import { cn } from '@/lib/utilities';

import { Button } from './button';
import { Skeleton } from './skeleton';

type BreadcrumbItemElement = ReactElement<BreadcrumbLinkProps | BreadcrumbCurrentProps>;

export type BreadcrumbSize = 'sm' | 'default';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
	readonly children: ReactNode;
	readonly size?: BreadcrumbSize;
}

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	readonly href: string;
	readonly icon?: ReactNode;
}

export interface BreadcrumbCurrentProps extends HTMLAttributes<HTMLDivElement> {
	readonly icon?: ReactNode;
	readonly loading?: boolean;
}

export type BreadcrumbSeparatorProps = HTMLAttributes<HTMLSpanElement>;

export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export interface BreadcrumbClipboardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	readonly text: string;
}

function breadcrumbVariants(size: BreadcrumbSize = 'default') {
	if (size === 'sm') {
		return 'h-10 gap-0.5 text-sm';
	}

	return 'h-12 gap-1 text-base';
}

function BreadcrumbLink({ href, icon, className, children, ...props }: BreadcrumbLinkProps) {
	return (
		<a
			data-slot="breadcrumb-link"
			href={href}
			className={cn(
				'inline-flex max-w-full min-w-0 items-center gap-1 rounded-[2px] font-bold text-muted-foreground no-underline transition-colors hover:text-foreground focus:outline-hidden focus-visible:neo-focus-ring',
				className,
			)}
			{...props}
		>
			{icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
			<span className="truncate">{children}</span>
		</a>
	);
}

function BreadcrumbCurrent({ icon, loading = false, className, children, ...props }: BreadcrumbCurrentProps) {
	if (loading) {
		return (
			<div
				data-slot="breadcrumb-current"
				className={cn('inline-flex w-[125px] min-w-0 items-center gap-1', className)}
				aria-current="page"
				{...props}
			>
				{icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
				<Skeleton className="h-6 w-32" />
			</div>
		);
	}

	return (
		<div
			data-slot="breadcrumb-current"
			className={cn('inline-flex max-w-full min-w-0 items-center gap-1 font-black text-foreground', className)}
			aria-current="page"
			{...props}
		>
			{icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
			<span className="truncate">{children}</span>
		</div>
	);
}

function BreadcrumbSeparator({ className, ...props }: BreadcrumbSeparatorProps) {
	return (
		<span
			data-slot="breadcrumb-separator"
			className={cn('inline-flex shrink-0 items-center text-foreground/45 dark:text-white/45', className)}
			aria-hidden="true"
			{...props}
		>
			<CaretRightIcon className="size-4" weight="bold" />
		</span>
	);
}

function BreadcrumbEllipsis({ className, ...props }: BreadcrumbEllipsisProps) {
	return (
		<span
			data-slot="breadcrumb-ellipsis"
			className={cn('inline-flex shrink-0 items-center text-muted-foreground', className)}
			aria-hidden="true"
			{...props}
		>
			<DotsThreeIcon className="size-4" weight="bold" />
		</span>
	);
}

function BreadcrumbClipboard({ text, className, onClick, ...props }: BreadcrumbClipboardProps) {
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (!isCopied) {
			return;
		}

		const timeoutId = globalThis.setTimeout(() => setIsCopied(false), 2000);
		return () => globalThis.clearTimeout(timeoutId);
	}, [isCopied]);

	const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
		onClick?.(event);
		if (event.defaultPrevented || !text) {
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			setIsCopied(true);
		} catch {
			return;
		}
	};

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			className={cn(
				'size-7 border text-black/60 opacity-0 transition-opacity [--focus-ring-inner-size:0] [--focus-ring-outer-size:2px] hover:text-black focus-visible:opacity-100 active:opacity-100 dark:text-white/60 dark:hover:text-white group-hover-always:opacity-100',
				className,
			)}
			onClick={handleClick}
			aria-label="Copy breadcrumb text"
			title="Copy"
			{...props}
		>
			{isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
		</Button>
	);
}

function isBreadcrumbItemElement<P>(child: ReactNode, component: (props: P) => ReactElement | null): child is ReactElement<P> {
	return isValidElement<P>(child) && child.type === component;
}

function cloneBreadcrumbItemElement(element: BreadcrumbItemElement, key: string) {
	return cloneElement(element, { key });
}

function isBreadcrumbItem(child: ReactNode): child is BreadcrumbItemElement {
	return isBreadcrumbItemElement(child, BreadcrumbLink) || isBreadcrumbItemElement(child, BreadcrumbCurrent);
}

function getMobileBreadcrumbChildren(children: ReactNode[]) {
	const breadcrumbItems = children.filter((child) => isBreadcrumbItem(child));

	if (breadcrumbItems.length <= 2) {
		return children;
	}

	const parentItem = breadcrumbItems.at(-2);
	const currentItem = breadcrumbItems.at(-1);

	if (!parentItem || !currentItem) {
		return children;
	}

	const extras = children.filter(
		(child) =>
			!isBreadcrumbItemElement(child, BreadcrumbLink) &&
			!isBreadcrumbItemElement(child, BreadcrumbCurrent) &&
			!isBreadcrumbItemElement(child, BreadcrumbSeparator),
	);

	return [
		<BreadcrumbEllipsis key="breadcrumb-mobile-ellipsis" />,
		<BreadcrumbSeparator key="breadcrumb-mobile-separator-leading" />,
		cloneBreadcrumbItemElement(parentItem, 'breadcrumb-mobile-parent'),
		<BreadcrumbSeparator key="breadcrumb-mobile-separator-trailing" />,
		cloneBreadcrumbItemElement(currentItem, 'breadcrumb-mobile-current'),
		...extras,
	];
}

function BreadcrumbRoot({ children, size = 'default', className, ...props }: BreadcrumbProps) {
	const childArray = Children.toArray(children);
	const mobileChildren = getMobileBreadcrumbChildren(childArray);

	return (
		<nav
			data-slot="breadcrumb"
			aria-label="breadcrumb"
			className={cn(
				'group flex max-w-full min-w-0 grow items-center overflow-hidden py-1 font-bold whitespace-nowrap text-foreground',
				breadcrumbVariants(size),
				className,
			)}
			{...props}
		>
			<div className="contents sm:hidden">{mobileChildren}</div>
			<div className="hidden sm:contents">{childArray}</div>
		</nav>
	);
}

BreadcrumbLink.displayName = 'Breadcrumb.Link';
BreadcrumbCurrent.displayName = 'Breadcrumb.Current';
BreadcrumbSeparator.displayName = 'Breadcrumb.Separator';
BreadcrumbEllipsis.displayName = 'Breadcrumb.Ellipsis';
BreadcrumbClipboard.displayName = 'Breadcrumb.Clipboard';
BreadcrumbRoot.displayName = 'Breadcrumb';

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
	Link: BreadcrumbLink,
	Current: BreadcrumbCurrent,
	Separator: BreadcrumbSeparator,
	Ellipsis: BreadcrumbEllipsis,
	Clipboard: BreadcrumbClipboard,
});

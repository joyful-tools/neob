import { useRender } from '@base-ui/react';
import { CSSProperties, HTMLAttributes, Ref } from 'react';

import { useEdgeFade } from '@/hooks/use-edge-fade';
import { cn } from '@/lib/utilities';

import type { EdgeFadeAxis } from '@/hooks/use-edge-fade';

export interface EdgeFadeProperties extends HTMLAttributes<HTMLElement> {
	/** Scroll axis to fade. Defaults to vertical. */
	readonly axis?: EdgeFadeAxis;
	/** Enable fades at edges with hidden content. Defaults to true. */
	readonly enabled?: boolean;
	/** Fade length in pixels, or a CSS length/percentage. Inherits 24px by default. */
	readonly size?: number | string;
	/** Replace the default div with an element or a component that forwards its props and ref. */
	readonly render?: useRender.RenderProp;
	readonly ref?: Ref<HTMLElement>;
}

export function EdgeFade({
	axis = 'y',
	enabled = true,
	size,
	render,
	ref,
	className,
	style,
	tabIndex = 0,
	...properties
}: EdgeFadeProperties) {
	const edgeFadeRef = useEdgeFade({ axis, enabled, ref });
	const fadeStyle: CSSProperties & { '--edge-fade-size'?: string } = {
		...style,
		...(size === undefined ? {} : { '--edge-fade-size': typeof size === 'number' ? `${Math.max(0, size)}px` : size }),
	};

	return useRender({
		defaultTagName: 'div',
		render,
		ref: edgeFadeRef,
		props: {
			...properties,
			tabIndex,
			className: cn(
				'min-h-0 min-w-0',
				axis === 'both' ? 'overflow-auto' : axis === 'x' ? 'overflow-x-auto' : 'overflow-y-auto',
				enabled && (axis === 'both' ? 'edge-fade-both' : axis === 'x' ? 'edge-fade-x' : 'edge-fade-y'),
				className,
			),
			style: fadeStyle,
		},
	});
}
EdgeFade.displayName = 'EdgeFade';

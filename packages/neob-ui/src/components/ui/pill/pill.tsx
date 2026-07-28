import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utilities';

import { pillVariants } from './pill-variants';

import type { HTMLAttributes, Ref } from 'react';

interface PillProperties extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof pillVariants> {
	readonly ref?: Ref<HTMLSpanElement>;
}

function Pill({ className, size, rounded, color, ref, ...properties }: PillProperties) {
	return <span className={cn(pillVariants({ size, rounded, color }), className)} ref={ref} {...properties} />;
}

Pill.displayName = 'Pill';

export { Pill };
export type { PillProperties };

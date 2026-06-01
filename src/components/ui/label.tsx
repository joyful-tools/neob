import { type VariantProps, cva } from 'class-variance-authority';
import { LabelHTMLAttributes, Ref } from 'react';

import { cn } from '@/lib/utilities';

const labelVariants = cva(`
	text-sm leading-none font-medium
	peer-disabled:cursor-not-allowed peer-disabled:opacity-70
`);

export function Label({
	className,
	ref,
	...properties
}: LabelHTMLAttributes<HTMLLabelElement> &
	VariantProps<typeof labelVariants> & {
		ref?: Ref<HTMLLabelElement>;
	}) {
	return <label ref={ref} className={cn(labelVariants(), className)} {...properties} />;
}
Label.displayName = 'Label';
export { labelVariants };

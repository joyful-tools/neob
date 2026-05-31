import { Radio } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { Check } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

const RADIO_ITEM_CLASS_NAME = `
	aspect-square size-5 shrink-0 cursor-pointer rounded-full border-2
	border-black bg-white shadow-cel-sm transition-all duration-300 ease-spring
	neo-focus-ring isolate outline-hidden
	disabled:cursor-not-allowed disabled:opacity-50
	data-[checked]:bg-black data-[checked]:text-white
	dark:bg-zinc dark:data-[checked]:bg-white
	dark:data-[checked]:text-black
`;

interface RadioGroupProperties extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive> {
	readonly ref?: React.Ref<HTMLDivElement>;
}

interface RadioGroupItemProperties {
	readonly ref?: React.Ref<HTMLButtonElement>;
	readonly value: string;
	readonly id?: string;
	readonly className?: string;
	readonly disabled?: boolean;
	readonly style?: React.CSSProperties & Record<string, string>;
}

/** Radio group container. Wraps Base UI RadioGroup primitive. */
function RadioGroupRoot({ className, ref, ...properties }: RadioGroupProperties) {
	return <RadioGroupPrimitive className={cn('grid gap-2', className)} {...properties} ref={ref} />;
}
RadioGroupRoot.displayName = 'RadioGroup';

/** Individual radio button item. Must be used within RadioGroup. */
function RadioGroupItem({ className, ref, ...properties }: RadioGroupItemProperties) {
	return (
		<Radio.Root ref={ref} className={cn(RADIO_ITEM_CLASS_NAME, className)} nativeButton render={<button type="button" />} {...properties}>
			<Radio.Indicator className="flex items-center justify-center text-current select-none" keepMounted>
				<Check className="size-3" />
			</Radio.Indicator>
		</Radio.Root>
	);
}
RadioGroupItem.displayName = 'RadioGroup.Item';

export const RadioGroup = Object.assign(RadioGroupRoot, {
	Item: RadioGroupItem,
});

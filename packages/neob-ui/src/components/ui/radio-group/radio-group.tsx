import { Radio } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { CheckIcon } from '@phosphor-icons/react';
import { ComponentPropsWithoutRef, CSSProperties, Ref } from 'react';

import { useOptimisticAction } from '@/hooks/use-optimistic-action';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';

const RADIO_ITEM_CLASS_NAME = `
	aspect-square size-5 shrink-0 cursor-pointer rounded-full border-2
	border-edge bg-white shadow-cel-sm transition-all duration-[var(--duration-control)] ease-spring
	neo-focus-ring isolate outline-hidden
	disabled:cursor-not-allowed disabled:opacity-disabled
	data-[checked]:bg-black data-[checked]:text-white
	dark:bg-zinc dark:data-[checked]:bg-white
	dark:data-[checked]:text-black
`;

interface RadioGroupProperties extends Omit<
	ComponentPropsWithoutRef<typeof RadioGroupPrimitive>,
	'value' | 'defaultValue' | 'onValueChange'
> {
	readonly ref?: Ref<HTMLDivElement>;
	readonly value?: string;
	readonly defaultValue?: string;
	readonly action?: Action<[value: string, eventDetails: RadioGroupPrimitive.ChangeEventDetails]>;
}

interface RadioGroupItemProperties {
	readonly ref?: Ref<HTMLButtonElement>;
	readonly value: string;
	readonly id?: string;
	readonly className?: string;
	readonly disabled?: boolean;
	readonly style?: CSSProperties & Record<string, string>;
}

/** Radio group container. Wraps Base UI RadioGroup primitive. */
function RadioGroupRoot({ className, ref, value, defaultValue = '', action, ...properties }: RadioGroupProperties) {
	const { optimisticValue, runAction, isPending } = useOptimisticAction({ value, defaultValue, action });
	return (
		<RadioGroupPrimitive
			className={cn('grid gap-2', className)}
			{...properties}
			ref={ref}
			value={optimisticValue}
			onValueChange={runAction}
			aria-busy={isPending || undefined}
			data-pending={isPending ? '' : undefined}
		/>
	);
}
RadioGroupRoot.displayName = 'RadioGroup';

/** Individual radio button item. Must be used within RadioGroup. */
function RadioGroupItem({ className, ref, ...properties }: RadioGroupItemProperties) {
	return (
		<Radio.Root ref={ref} className={cn(RADIO_ITEM_CLASS_NAME, className)} nativeButton render={<button type="button" />} {...properties}>
			<Radio.Indicator className="flex items-center justify-center text-current select-none" keepMounted>
				<CheckIcon className="size-3" />
			</Radio.Indicator>
		</Radio.Root>
	);
}
RadioGroupItem.displayName = 'RadioGroup.Item';

export const RadioGroup = Object.assign(RadioGroupRoot, {
	Item: RadioGroupItem,
});

import { Select as BaseSelect } from '@base-ui/react/select';
import { CaretUpDown, Check } from '@phosphor-icons/react';
import { ReactNode, Ref, RefObject, useId } from 'react';

import { cn } from '@/lib/utilities';

import { buttonVariants } from './button';
import { Input } from './input';
import { Skeleton } from './skeleton';

/** Shape for items that carry extra metadata (disabled state). */
export interface SelectItemDescriptor {
	/** Display label for the option. */
	label: ReactNode;
	/** When `true`, the option cannot be selected. */
	disabled?: boolean;
}

/** Value type accepted by the `items` object-map prop. */
export type SelectItemValue = ReactNode | SelectItemDescriptor;

export interface SelectProps<T = unknown, Multiple extends boolean | undefined = false> extends Omit<
	BaseSelect.Root.Props<T, Multiple>,
	'items'
> {
	'aria-label'?: string;
	'aria-labelledby'?: string;
	multiple?: Multiple;
	renderValue?: (value: Multiple extends true ? T[] : T) => ReactNode;
	className?: string;
	size?: 'default' | 'sm' | 'lg' | 'xl';
	label?: ReactNode;
	hideLabel?: boolean;
	placeholder?: string;
	loading?: boolean;
	labelTooltip?: ReactNode;
	description?: ReactNode;
	error?: string;
	container?: HTMLElement | null | RefObject<HTMLElement | null>;
	containerClassName?: string;
	items?: Record<string, SelectItemValue> | ReadonlyArray<{ label: ReactNode; value: T }>;
}

function isItemDescriptor(value: SelectItemValue): value is SelectItemDescriptor {
	if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Promise)) {
		if ('$$typeof' in value) {
			return false;
		}
		if ('label' in value) {
			return value.label !== undefined && value.label !== null;
		}
	}
	return false;
}

function normalizeItems<T>(
	items: Record<string, SelectItemValue> | ReadonlyArray<{ label: ReactNode; value: T }>,
): ReadonlyArray<{ label: ReactNode; value: T }> {
	if (Array.isArray(items)) {
		return items;
	}
	return Object.entries(items).map(([key, entry]) => {
		const label = isItemDescriptor(entry) ? entry.label : entry;
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		const value = key as unknown as T;
		return {
			value,
			label,
		};
	});
}

function renderOptionsFromItems<T>(items: Record<string, SelectItemValue> | ReadonlyArray<{ label: ReactNode; value: T }>): ReactNode {
	const normalizedItems = normalizeItems(items);
	const disabledLookup = new Map<string, { disabled?: boolean }>();
	if (!Array.isArray(items)) {
		for (const [key, entry] of Object.entries(items)) {
			if (isItemDescriptor(entry)) {
				disabledLookup.set(key, { disabled: entry.disabled });
			}
		}
	}

	return normalizedItems
		.filter((item) => item.value !== null)
		.map((item, index) => {
			const key = typeof item.value === 'string' ? item.value : `option-${index}`;
			const meta = typeof item.value === 'string' ? disabledLookup.get(item.value) : undefined;

			return (
				<Option key={key} value={item.value} disabled={meta?.disabled}>
					{item.label}
				</Option>
			);
		});
}

export function Select<T = unknown, Multiple extends boolean | undefined = false>({
	children,
	className,
	renderValue,
	label,
	hideLabel,
	placeholder,
	loading,
	size = 'default',
	labelTooltip,
	description,
	error,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledby,
	required,
	container,
	containerClassName,
	...props
}: SelectProps<T, Multiple>) {
	const normalizedItems = props.items ? normalizeItems(props.items) : undefined;
	const renderedChildren = children || (props.items ? renderOptionsFromItems(props.items) : null);

	const valueChildrenFn = renderValue
		? (value: unknown) => {
				const placeholderNode = placeholder == null ? null : <span className="text-muted-foreground">{placeholder}</span>;

				if (value == null || value === '') {
					return placeholderNode;
				}

				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
				const rendered = renderValue(value as any);

				if (rendered == null) {
					return placeholderNode;
				}

				return rendered;
			}
		: undefined;

	const { items: _items, ...baseProps } = props;

	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const selectControl = (
		<BaseSelect.Root {...baseProps} items={normalizedItems} disabled={loading || props.disabled}>
			<BaseSelect.Trigger
				className={cn(
					buttonVariants({ size }),
					'neo-focus-ring-focus isolate outline-hidden',
					'w-full justify-between bg-white font-bold text-black dark:bg-zinc dark:text-white',
					'hover:-translate-y-0.5 hover:shadow-cel-md active:translate-y-0.5 active:shadow-cel-inset-md',
					props.disabled && 'cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-cel-sm',
					error && 'border-red dark:border-red',
					className,
				)}
				aria-describedby={describedBy}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				aria-invalid={hasError ? true : undefined}
			>
				{loading ? (
					<Skeleton className="h-4 w-24" />
				) : (
					<BaseSelect.Value placeholder={placeholder} className="min-w-0 truncate data-placeholder:text-muted-foreground">
						{valueChildrenFn}
					</BaseSelect.Value>
				)}
				<BaseSelect.Icon className="ml-2 flex shrink-0 items-center opacity-70">
					<CaretUpDown className="size-4" />
				</BaseSelect.Icon>
			</BaseSelect.Trigger>
			<BaseSelect.Portal container={container}>
				<BaseSelect.Positioner side="bottom" align="start" sideOffset={6} className="z-50">
					<BaseSelect.Popup
						className={cn(
							'flex flex-col overflow-hidden rounded-xl border-2 border-black bg-white p-2 text-black shadow-sm dark:bg-zinc dark:text-white',
							'max-h-[min(300px,var(--available-height))] min-w-[calc(var(--anchor-width)+4px)]',
							containerClassName,
						)}
					>
						<BaseSelect.List className="flex min-h-0 flex-1 scroll-py-2 flex-col gap-1 overflow-y-auto overscroll-none">
							{renderedChildren}
						</BaseSelect.List>
					</BaseSelect.Popup>
				</BaseSelect.Positioner>
			</BaseSelect.Portal>
		</BaseSelect.Root>
	);

	if (label || description || error || labelTooltip) {
		return (
			<Input.Wrapper
				label={label}
				description={description}
				error={error}
				required={required}
				labelTooltip={labelTooltip}
				hideLabel={hideLabel}
				descriptionId={descriptionId}
				errorId={errorId}
				className={containerClassName}
			>
				{selectControl}
			</Input.Wrapper>
		);
	}

	return selectControl;
}

export interface SelectOptionProps<T = unknown> {
	children: ReactNode;
	value: T;
	disabled?: boolean;
	className?: string;
}

function Option<T>({ children, value, disabled, className }: SelectOptionProps<T>) {
	return (
		<BaseSelect.Item
			value={value}
			disabled={disabled}
			className={cn(
				'relative flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-sm font-bold text-black outline-hidden transition-colors select-none',
				'data-disabled:pointer-events-none data-disabled:opacity-50',
				'data-highlighted:bg-black data-highlighted:text-white dark:text-white dark:data-highlighted:bg-white dark:data-highlighted:text-black',
				className,
			)}
		>
			<BaseSelect.ItemText className="truncate">{children}</BaseSelect.ItemText>
			<BaseSelect.ItemIndicator className="ml-2 shrink-0">
				<Check className="size-4 stroke-3" />
			</BaseSelect.ItemIndicator>
		</BaseSelect.Item>
	);
}
Option.displayName = 'Select.Option';

export interface SelectGroupProps {
	children: ReactNode;
	className?: string;
	ref?: Ref<HTMLDivElement>;
}

function Group({ children, className, ref }: SelectGroupProps) {
	return (
		<BaseSelect.Group ref={ref} className={cn(className)}>
			{children}
		</BaseSelect.Group>
	);
}
Group.displayName = 'Select.Group';

export interface SelectGroupLabelProps {
	children: ReactNode;
	className?: string;
	ref?: Ref<HTMLDivElement>;
}

function GroupLabel({ children, className, ref }: SelectGroupLabelProps) {
	return (
		<BaseSelect.GroupLabel
			ref={ref}
			className={cn('px-3.5 py-1.5 text-xs font-black tracking-wider text-muted-foreground uppercase', className)}
		>
			{children}
		</BaseSelect.GroupLabel>
	);
}
GroupLabel.displayName = 'Select.GroupLabel';

export interface SelectSeparatorProps {
	className?: string;
	ref?: Ref<HTMLDivElement>;
}

function Separator({ className, ref }: SelectSeparatorProps) {
	return <BaseSelect.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-black/10 dark:bg-white/10', className)} />;
}
Separator.displayName = 'Select.Separator';

Select.Option = Option;
Select.Group = Group;
Select.GroupLabel = GroupLabel;
Select.Separator = Separator;

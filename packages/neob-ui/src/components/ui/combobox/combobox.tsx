import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CaretDownIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import {
	ComponentPropsWithoutRef,
	createContext,
	Fragment,
	JSX,
	ReactNode,
	Ref,
	RefCallback,
	RefObject,
	useContext,
	useId,
	useMemo,
	useState,
} from 'react';

import { Input as NeoInput } from '@/components/ui/input';
import { cn } from '@/lib/utilities';

export type ComboboxSize = 'xs' | 'sm' | 'base' | 'lg';

const ComboboxContext = createContext<{
	readonly size: ComboboxSize;
	readonly hasError: boolean;
	readonly multiple: boolean;
	readonly anchorRef: RefCallback<HTMLDivElement | null>;
	readonly anchorElement: HTMLDivElement | null;
	readonly describedBy?: string;
	readonly ariaInvalid?: boolean;
	readonly ariaLabel?: string;
	readonly ariaLabelledby?: string;
}>({
	size: 'base',
	hasError: false,
	multiple: false,
	anchorRef: () => {},
	anchorElement: null,
});

function getInputStyles(size: ComboboxSize, hasError: boolean, focusRingClass = 'neo-focus-ring-focus') {
	const sizeClasses = {
		xs: 'h-6 text-xs px-2 py-0.5 rounded-md border-[1.5px]',
		sm: 'h-8 text-sm px-3 py-1 rounded-md border-2',
		base: 'h-10 text-base px-4 py-2 rounded-lg border-2',
		lg: 'h-12 text-lg px-5 py-2.5 rounded-lg border-2',
	};

	return cn(
		focusRingClass,
		`isolate flex w-full items-center justify-between bg-white font-bold text-black outline-hidden transition-all duration-300 ease-spring select-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc dark:text-white`,
		hasError ? 'border-red [--color-ring:var(--color-red)] dark:border-red' : 'border-black dark:border-black',
		sizeClasses[size],
	);
}

export interface ComboboxProps<Value = unknown, Multiple extends boolean | undefined = false> extends BaseCombobox.Root.Props<
	Value,
	Multiple
> {
	readonly 'aria-label'?: string;
	readonly 'aria-labelledby'?: string;
	readonly label?: ReactNode;
	readonly required?: boolean;
	readonly labelTooltip?: ReactNode;
	readonly description?: ReactNode;
	readonly error?: string;
	readonly size?: ComboboxSize;
	readonly containerClassName?: string;
}

/**
 * Root Combobox component.
 * Wraps Base UI Combobox.Root and integrates with Field wrapper.
 */
function Root<Value, Multiple extends boolean | undefined = false>({
	label,
	required,
	labelTooltip,
	description,
	error,
	children,
	size = 'base',
	containerClassName,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledby,
	...props
}: ComboboxProps<Value, Multiple>) {
	const hasError = Boolean(error);
	const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);

	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const comboboxControl = (
		<ComboboxContext.Provider
			value={{
				size,
				hasError,
				multiple: Boolean(props.multiple),
				anchorRef: setAnchorElement,
				anchorElement,
				describedBy,
				ariaInvalid: hasError,
				ariaLabel,
				ariaLabelledby,
			}}
		>
			<BaseCombobox.Root {...props}>{children}</BaseCombobox.Root>
		</ComboboxContext.Provider>
	);

	if (label || description || error || labelTooltip) {
		return (
			<NeoInput.Wrapper
				label={label}
				required={required}
				labelTooltip={labelTooltip}
				description={description}
				error={error}
				descriptionId={descriptionId}
				errorId={errorId}
				className={containerClassName}
			>
				{comboboxControl}
			</NeoInput.Wrapper>
		);
	}

	return comboboxControl;
}
Root.displayName = 'Combobox.Root';

export interface ComboboxContentProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Popup> {
	readonly align?: BaseCombobox.Positioner.Props['align'];
	readonly alignOffset?: BaseCombobox.Positioner.Props['alignOffset'];
	readonly side?: BaseCombobox.Positioner.Props['side'];
	readonly sideOffset?: BaseCombobox.Positioner.Props['sideOffset'];
	readonly container?: HTMLElement | null | RefObject<HTMLElement | null>;
	readonly ref?: Ref<HTMLDivElement>;
}

/**
 * Content component.
 * Positioned dropdown content wrapper.
 */
function Content({
	children,
	className,
	align = 'start',
	sideOffset = 8,
	alignOffset,
	side = 'bottom',
	container,
	ref,
	...properties
}: ComboboxContentProps) {
	const { multiple, anchorElement } = useContext(ComboboxContext);

	const resolvedSideOffset = useMemo(() => {
		const extraOffset = multiple ? 6 : 0;

		if (typeof sideOffset === 'function') {
			return (data: Parameters<typeof sideOffset>[0]) => sideOffset(data) + extraOffset;
		}

		return (sideOffset ?? 8) + extraOffset;
	}, [multiple, sideOffset]);
	return (
		<BaseCombobox.Portal container={container}>
			<BaseCombobox.Positioner
				align={align}
				sideOffset={resolvedSideOffset}
				alignOffset={alignOffset}
				side={side}
				anchor={anchorElement}
				className="z-50"
			>
				<BaseCombobox.Popup
					ref={ref}
					className={cn(
						`flex max-h-[min(var(--available-height),24rem)] w-[max(var(--anchor-width),150px)] min-w-0 animate-popover-in flex-col overflow-hidden rounded-xl border-2 border-black bg-white px-0 py-1.5 text-black shadow-sm outline-hidden select-none data-closed:animate-popover-out dark:bg-zinc dark:text-white`,
						`origin-(--transform-origin)`,
						`data-[side=bottom]:[--tw-enter-translate-y:-0.5rem] data-[side=left]:[--tw-enter-translate-x:0.5rem] data-[side=right]:[--tw-enter-translate-x:-0.5rem] data-[side=top]:[--tw-enter-translate-y:0.5rem]`,
						className,
					)}
					{...properties}
				>
					{children}
				</BaseCombobox.Popup>
			</BaseCombobox.Positioner>
		</BaseCombobox.Portal>
	);
}
Content.displayName = 'Combobox.Content';

const triggerValueIconStyles: Record<ComboboxSize, { padding: string; iconSize: number; iconRight: string }> = {
	xs: { padding: 'pr-6', iconSize: 12, iconRight: 'right-1' },
	sm: { padding: 'pr-8', iconSize: 14, iconRight: 'right-1.5' },
	base: { padding: 'pr-10', iconSize: 16, iconRight: 'right-2' },
	lg: { padding: 'pr-12', iconSize: 18, iconRight: 'right-3' },
};

export interface ComboboxTriggerValueProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Trigger> {
	readonly placeholder?: string;
	readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * TriggerValue component.
 * Dropdown trigger button displaying the selected value.
 */
function TriggerValue({ className, ref, placeholder, ...props }: ComboboxTriggerValueProps) {
	const { size, hasError, describedBy, ariaInvalid, anchorRef, ariaLabel, ariaLabelledby } = useContext(ComboboxContext);
	const iconStyles = triggerValueIconStyles[size];

	return (
		<div ref={anchorRef} className={cn('inline-flex', className)}>
			<BaseCombobox.Trigger
				ref={ref}
				className={cn(
					getInputStyles(size, hasError, 'neo-focus-ring'),
					'relative flex w-full cursor-pointer items-center shadow-cel-sm transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-cel-md active:translate-y-0.5 active:shadow-cel-inset-md disabled:hover:translate-y-0 disabled:hover:shadow-cel-sm aria-expanded:translate-y-0.5 aria-expanded:shadow-cel-inset-md data-pressed:translate-y-0.5 data-pressed:shadow-cel-inset-md',
					iconStyles.padding,
				)}
				aria-describedby={describedBy}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				aria-invalid={ariaInvalid ? true : undefined}
				onKeyDown={(e) => {
					if (e.key === ' ') {
						e.preventDefault();
						e.stopPropagation();
						e.currentTarget.click();
					}
					props.onKeyDown?.(e);
				}}
				onKeyUp={(e) => {
					if (e.key === ' ' || e.key === 'Enter') {
						e.preventDefault();
						e.stopPropagation();
					}
					props.onKeyUp?.(e);
				}}
				{...props}
			>
				<span className="min-w-0 flex-1 truncate text-left">
					<BaseCombobox.Value placeholder={placeholder} />
				</span>
				<BaseCombobox.Icon
					className={cn('absolute top-1/2 flex -translate-y-1/2 items-center text-black/60 dark:text-white/60', iconStyles.iconRight)}
				>
					<CaretDownIcon size={iconStyles.iconSize} className="fill-current" />
				</BaseCombobox.Icon>
			</BaseCombobox.Trigger>
		</div>
	);
}
TriggerValue.displayName = 'Combobox.TriggerValue';

export interface ComboboxTriggerProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Trigger> {
	readonly ref?: Ref<HTMLButtonElement>;
}

function Trigger({ children, ref, ...props }: ComboboxTriggerProps) {
	const { ariaLabel, ariaLabelledby } = useContext(ComboboxContext);

	return (
		<BaseCombobox.Trigger ref={ref} aria-label={ariaLabel} aria-labelledby={ariaLabelledby} {...props}>
			{children}
		</BaseCombobox.Trigger>
	);
}
Trigger.displayName = 'Combobox.Trigger';

const triggerInputIconStyles: Record<ComboboxSize, { padding: string; iconSize: number; clearRight: string; caretRight: string }> = {
	xs: {
		padding: 'pr-7',
		iconSize: 12,
		clearRight: 'right-5',
		caretRight: 'right-1',
	},
	sm: {
		padding: 'pr-9',
		iconSize: 14,
		clearRight: 'right-6',
		caretRight: 'right-1.5',
	},
	base: {
		padding: 'pr-12',
		iconSize: 16,
		clearRight: 'right-8',
		caretRight: 'right-2',
	},
	lg: {
		padding: 'pr-14',
		iconSize: 18,
		clearRight: 'right-9',
		caretRight: 'right-3',
	},
};

export interface ComboboxTriggerInputProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Input> {
	readonly ref?: Ref<HTMLInputElement>;
	readonly clearLabel?: string;
	readonly showOptionsLabel?: string;
}

/**
 * TriggerInput component.
 * Text input control that opens the dropdown and filters options.
 */
function TriggerInput({
	className,
	ref,
	placeholder,
	clearLabel = 'Clear selection',
	showOptionsLabel = 'Show options',
	...props
}: ComboboxTriggerInputProps) {
	const { size, hasError, describedBy, ariaInvalid, anchorRef } = useContext(ComboboxContext);
	const iconStyles = triggerInputIconStyles[size];

	return (
		<div ref={anchorRef} className={cn('relative inline-block', className)}>
			<BaseCombobox.Input
				ref={ref}
				placeholder={placeholder}
				className={cn(getInputStyles(size, hasError), 'w-full shadow-cel-inset-md', iconStyles.padding)}
				aria-describedby={describedBy}
				aria-invalid={ariaInvalid ? true : undefined}
				{...props}
			/>

			<BaseCombobox.Clear
				aria-label={clearLabel}
				className={cn(
					'neo-focus-ring absolute top-1/2 isolate flex -translate-y-1/2 cursor-pointer rounded-sm border-0 bg-transparent p-0 text-black/60 outline-hidden transition-opacity hover:text-black data-disabled:pointer-events-none data-disabled:opacity-0 dark:text-white/60 dark:hover:text-white',
					iconStyles.clearRight,
				)}
			>
				<XIcon size={iconStyles.iconSize} className="stroke-3" />
			</BaseCombobox.Clear>

			<BaseCombobox.Trigger
				aria-label={showOptionsLabel}
				className={cn(
					'neo-focus-ring absolute top-1/2 isolate m-0 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-black/60 outline-hidden hover:text-black disabled:pointer-events-none dark:text-white/60 dark:hover:text-white',
					iconStyles.caretRight,
				)}
			>
				<BaseCombobox.Icon>
					<CaretDownIcon size={iconStyles.iconSize} className="stroke-3" />
				</BaseCombobox.Icon>
			</BaseCombobox.Trigger>
		</div>
	);
}
TriggerInput.displayName = 'Combobox.TriggerInput';

function getChipsContainerStyles(size: ComboboxSize, hasError: boolean) {
	const sizeClasses = {
		xs: 'min-h-6 text-xs rounded-md border-[1.5px] px-1 py-0.5',
		sm: 'min-h-8 text-sm rounded-md border-2 px-1.5 py-0.5',
		base: 'min-h-10 text-base rounded-lg border-2 px-2 py-1',
		lg: 'min-h-12 text-lg rounded-lg border-2 px-2.5 py-1',
	};

	return cn(
		`neo-focus-ring-focus isolate flex w-full flex-col gap-1 bg-white font-bold text-black shadow-cel-inset-md outline-hidden transition-all duration-300 ease-spring select-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc dark:text-white`,
		hasError ? 'border-red [--color-ring:var(--color-red)] dark:border-red' : 'border-black dark:border-black',
		sizeClasses[size],
	);
}

export interface ComboboxTriggerMultipleWithInputProps<ValueType> {
	readonly placeholder?: string;
	readonly renderItem: (value: ValueType) => ReactNode;
	readonly className?: string;
	readonly inputSide?: 'right' | 'top';
	readonly value?: ValueType[];
}

/**
 * TriggerMultipleWithInput component.
 * Multi-select control with inline chips and input field.
 */
function TriggerMultipleWithInput<ValueType>({
	placeholder,
	renderItem,
	className,
	inputSide = 'right',
	value: controlledValue,
}: ComboboxTriggerMultipleWithInputProps<ValueType>) {
	const { size, hasError, describedBy, ariaInvalid } = useContext(ComboboxContext);
	const chipsToRender = controlledValue;

	const sizeToMinHeight: Record<ComboboxSize, string> = {
		xs: 'min-h-5',
		sm: 'min-h-6.5',
		base: 'min-h-9',
		lg: 'min-h-10',
	};

	return (
		<BaseCombobox.Chips
			className={cn(
				getChipsContainerStyles(size, hasError),
				'h-auto data-disabled:cursor-not-allowed data-disabled:opacity-50',
				sizeToMinHeight[size],
				className,
			)}
			aria-describedby={describedBy}
			aria-invalid={ariaInvalid ? true : undefined}
		>
			{inputSide === 'top' && (
				<BaseCombobox.Input
					placeholder={placeholder}
					className="w-full border-0 bg-transparent px-1 py-0.5 text-sm font-medium text-black outline-hidden dark:text-white"
					aria-describedby={describedBy}
					aria-invalid={ariaInvalid ? true : undefined}
				/>
			)}
			<div className="flex flex-1 flex-wrap items-center gap-1">
				{chipsToRender !== undefined && chipsToRender.length > 0 && chipsToRender.map((item) => renderItem(item))}
				<BaseCombobox.Value>
					{(internalValue: ValueType[]) => {
						if (chipsToRender !== undefined) return null;
						return <Fragment>{internalValue.map((item) => renderItem(item))}</Fragment>;
					}}
				</BaseCombobox.Value>
				{inputSide === 'right' && (
					<BaseCombobox.Input
						placeholder={placeholder}
						className="min-w-20 flex-1 border-0 bg-transparent px-1 py-0.5 text-sm font-medium text-black outline-hidden dark:text-white"
						aria-describedby={describedBy}
						aria-invalid={ariaInvalid ? true : undefined}
					/>
				)}
			</div>
		</BaseCombobox.Chips>
	);
}
TriggerMultipleWithInput.displayName = 'Combobox.TriggerMultipleWithInput';

export interface ComboboxChipProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Chip> {
	readonly removeLabel?: string;
	readonly ref?: Ref<HTMLDivElement>;
}

/**
 * Chip component.
 * Selected item visual chip tag.
 */
function Chip({ removeLabel = 'Remove', className, children, ref, ...props }: ComboboxChipProps) {
	return (
		<BaseCombobox.Chip
			ref={ref}
			className={cn(
				'flex h-6 items-center gap-1.5 rounded-md border border-black bg-muted pr-0.75 pl-2 text-xs font-bold text-black shadow-cel-sm dark:border-white dark:bg-zinc dark:text-white',
				className,
			)}
			{...props}
		>
			<span className="truncate">{children}</span>
			<BaseCombobox.ChipRemove
				aria-label={removeLabel}
				className="flex cursor-pointer rounded-sm border-0 bg-transparent p-0.5 hover:bg-black/10 data-disabled:pointer-events-none dark:hover:bg-white/10"
			>
				<XIcon size={10} className="stroke-3" />
			</BaseCombobox.ChipRemove>
		</BaseCombobox.Chip>
	);
}
Chip.displayName = 'Combobox.Chip';

export interface ComboboxItemProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Item> {
	readonly ref?: Ref<HTMLDivElement>;
}

/**
 * Item component.
 * Individual option inside the dropdown popup list.
 */
function Item({ children, className, ref, ...props }: ComboboxItemProps) {
	return (
		<BaseCombobox.Item
			ref={ref}
			className={cn(
				'relative mx-1.5 flex cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-sm font-bold text-black outline-hidden select-none dark:text-white',
				'data-highlighted:bg-black data-highlighted:text-white dark:data-highlighted:bg-white dark:data-highlighted:text-black [&[data-highlighted]_*]:text-white dark:[&[data-highlighted]_*]:text-black',
				'data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:data-highlighted:bg-transparent data-disabled:data-highlighted:text-black dark:data-disabled:data-highlighted:text-white',
				className,
			)}
			{...props}
		>
			<span className="min-w-0 flex-1 wrap-break-word">{children}</span>
			<BaseCombobox.ItemIndicator className="ml-2 shrink-0">
				<CheckIcon className="size-4 stroke-3" />
			</BaseCombobox.ItemIndicator>
		</BaseCombobox.Item>
	);
}
Item.displayName = 'Combobox.Item';

export interface ComboboxEmptyProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Empty> {
	readonly ref?: Ref<HTMLDivElement>;
}

/**
 * Empty component.
 * Rendered when no results match the filter.
 */
function Empty({ className, children, ref, ...props }: ComboboxEmptyProps) {
	return (
		<BaseCombobox.Empty
			ref={ref}
			className={cn('mx-1.5 px-3 py-2 text-sm font-medium text-muted-foreground empty:m-0 empty:p-0', className)}
			{...props}
		>
			{children ?? 'No results found.'}
		</BaseCombobox.Empty>
	);
}
Empty.displayName = 'Combobox.Empty';

export interface ComboboxInputProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Input> {
	readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Input component.
 * Search input placed inside the dropdown popup.
 */
function Input({ className, ref, ...props }: ComboboxInputProps) {
	return (
		<BaseCombobox.Input
			ref={ref}
			className={cn(
				'neo-focus-ring-focus isolate mx-2 mt-1 mb-2 flex h-9 min-w-0 self-stretch overflow-hidden rounded-md border-2 border-black bg-white px-3 py-1.5 text-sm font-medium shadow-cel-inset-md outline-hidden dark:bg-zinc dark:text-white',
				className,
			)}
			{...props}
		/>
	);
}
Input.displayName = 'Combobox.Input';

export interface ComboboxListProps extends ComponentPropsWithoutRef<typeof BaseCombobox.List> {
	readonly ref?: Ref<HTMLDivElement>;
}

/**
 * List component.
 * Scrollable list container inside the dropdown popup.
 */
function List({ className, children, ref, ...props }: ComboboxListProps) {
	return (
		<BaseCombobox.List
			ref={ref}
			className={cn('flex min-h-0 flex-1 scroll-py-2 flex-col gap-1 overflow-y-auto overscroll-contain', className)}
			{...props}
		>
			{children}
		</BaseCombobox.List>
	);
}
List.displayName = 'Combobox.List';

export interface ComboboxGroupProps extends ComponentPropsWithoutRef<typeof BaseCombobox.Group> {
	readonly ref?: Ref<HTMLDivElement>;
}

/**
 * Group component.
 * Category group container.
 */
function Group({ className, ref, ...props }: ComboboxGroupProps) {
	return (
		<BaseCombobox.Group
			ref={ref}
			className={cn('mt-2 border-t border-black/10 pt-2 first:mt-0 first:border-t-0 first:pt-0 dark:border-white/10', className)}
			{...props}
		/>
	);
}
Group.displayName = 'Combobox.Group';

export interface ComboboxGroupLabelProps extends ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel> {
	readonly ref?: Ref<HTMLDivElement>;
}

/**
 * GroupLabel component.
 * Category label header.
 */
function GroupLabel({ className, ref, ...props }: ComboboxGroupLabelProps) {
	return (
		<BaseCombobox.GroupLabel
			ref={ref}
			className={cn('mx-1.5 px-3 py-1.5 text-xs font-black tracking-wider text-muted-foreground uppercase', className)}
			{...props}
		/>
	);
}
GroupLabel.displayName = 'Combobox.GroupLabel';

export interface ComboboxComponent {
	<Value, Multiple extends boolean | undefined = false>(props: ComboboxProps<Value, Multiple>): JSX.Element;
	Content: typeof Content;
	TriggerValue: typeof TriggerValue;
	TriggerInput: typeof TriggerInput;
	TriggerMultipleWithInput: <ValueType>(props: ComboboxTriggerMultipleWithInputProps<ValueType>) => JSX.Element;
	Chip: typeof Chip;
	Item: typeof Item;
	Input: typeof Input;
	Empty: typeof Empty;
	GroupLabel: typeof GroupLabel;
	Group: typeof Group;
	List: typeof List;
	Collection: typeof BaseCombobox.Collection;
	Trigger: typeof Trigger;
	Value: typeof BaseCombobox.Value;
	Icon: typeof BaseCombobox.Icon;
}

export const Combobox: ComboboxComponent = Object.assign(Root, {
	Content,
	TriggerValue,
	TriggerInput,
	TriggerMultipleWithInput,
	Chip,
	Item,
	Input,
	Empty,
	GroupLabel,
	Group,
	List,
	Collection: BaseCombobox.Collection,
	Trigger,
	Value: BaseCombobox.Value,
	Icon: BaseCombobox.Icon,
});

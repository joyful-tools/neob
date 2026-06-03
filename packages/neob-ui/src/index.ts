// Entrypoint for the neob component library

// Styles (Vite will bundle this into index.css)
import './index.css';

// Utilities
export { cn, getThemeColor } from './lib/utilities';

// Components
export { Button, buttonVariants } from './components/ui/button';
export type { ButtonProperties } from './components/ui/button';

export { Card } from './components/ui/card';

export { Dialog } from './components/ui/dialog';

export { AlertDialog } from './components/ui/alert-dialog';

export { InputArea } from './components/ui/input-area';
export type { InputAreaProperties } from './components/ui/input-area';
export { InputGroup } from './components/ui/input-group';
export type {
	InputGroupRootProps,
	InputGroupInputProps,
	InputGroupAddonProps,
	InputGroupButtonProps,
	InputGroupSuffixProps,
} from './components/ui/input-group';

export { Label, labelVariants } from './components/ui/label';

export { OTPField } from './components/ui/otp-field';

export { Popover } from './components/ui/popover';

export { RadioGroup } from './components/ui/radio-group';

export { Spinner } from './components/ui/spinner';

export { toast } from './components/ui/toast';
export { Toaster } from './components/ui/toaster';

export { Toggle } from './components/ui/toggle';

export { AnimatedNumber } from './components/ui/animated-number';

export { GridBackground } from './components/ui/grid-background';

export { Tooltip } from './components/ui/tooltip';

export { DropdownMenu } from './components/ui/dropdown-menu';

export { Meter } from './components/ui/meter';
export type { MeterProperties } from './components/ui/meter';

export { Skeleton } from './components/ui/skeleton';
export type { SkeletonProperties, ListSkeletonProperties } from './components/ui/skeleton';

export { Collapsible } from './components/ui/collapsible';
export type { CollapsibleProperties } from './components/ui/collapsible';

export { ResizablePanel } from './components/ui/resizable-panel';
export type { ResizablePanelProperties } from './components/ui/resizable-panel';

export { BorderBeam } from './components/ui/border-beam';
export type { BorderBeamProperties } from './components/ui/border-beam';

export { ConfirmDialog } from './components/ui/confirm-dialog';
export type { ConfirmDialogProperties } from './components/ui/confirm-dialog';

export { ConfirmButton } from './components/ui/confirm-button';

export { SplitButton } from './components/ui/split-button';
export type { SplitButtonProperties } from './components/ui/split-button';

export { NumericSlider } from './components/ui/numeric-slider';
export type { NumericSliderProperties } from './components/ui/numeric-slider';

export { InlineConfirmGroup } from './components/ui/inline-confirm-group';
export { LoadingBars } from './components/ui/loading-bars';

export { Pill } from './components/ui/pill';
export type { PillProperties } from './components/ui/pill';

export { GlobalDialogBackdrop } from './components/ui/global-dialog-backdrop';
export { useDialogStackPresence, closeTopDialog } from './components/ui/dialog-stack';

export { useInputAreaAutoResize } from './hooks/use-input-area-auto-resize';
export type { UseInputAreaAutoResizeOptions } from './hooks/use-input-area-auto-resize';
export { useTransformOrigin } from './hooks/use-transform-origin';

export { SensitiveInput } from './components/ui/sensitive-input';
export type { SensitiveInputProperties } from './components/ui/sensitive-input';

export { Checkbox } from './components/ui/checkbox';
export type { CheckboxProperties, CheckboxItemProperties, CheckboxGroupProperties } from './components/ui/checkbox';

export { Input } from './components/ui/input';
export type { InputProperties, InputWrapperProperties, FieldsetProperties } from './components/ui/input';

export { Switch } from './components/ui/switch';
export type { SwitchProperties } from './components/ui/switch';

export { Select } from './components/ui/select';
export type { SelectProps, SelectOptionProps } from './components/ui/select';

export { Combobox } from './components/ui/combobox';
export type { ComboboxProps, ComboboxSize } from './components/ui/combobox';

export { Tabs } from './components/ui/tabs';

export { Table } from './components/ui/table';
export type {
	TableProperties,
	TableHeaderProperties,
	TableBodyProperties,
	TableFooterProperties,
	TableRowProperties,
	TableHeadProperties,
	TableCellProperties,
} from './components/ui/table';

export { DatePicker } from './components/ui/date-picker';
export type { DatePickerProps } from './components/ui/date-picker';

export { Pagination } from './components/ui/pagination';
export type {
	PaginationProps,
	PaginationInfoProps,
	PaginationPageSizeProps,
	PaginationControlsProps,
	PaginationSeparatorProps,
	PaginationLabels,
} from './components/ui/pagination';

export { Breadcrumb } from './components/ui/breadcrumb';
export type {
	BreadcrumbProps,
	BreadcrumbLinkProps,
	BreadcrumbCurrentProps,
	BreadcrumbSeparatorProps,
	BreadcrumbEllipsisProps,
	BreadcrumbClipboardProps,
	BreadcrumbSize,
} from './components/ui/breadcrumb';

export { VirtualizedViewport } from './components/ui/virtualized-viewport';
export type { VirtualizedViewportProps } from './components/ui/virtualized-viewport';

export { Accordion } from './components/ui/accordion';
export { ButtonGroup } from './components/ui/button-group';
export type { ButtonGroupButtonProperties } from './components/ui/button-group';
export { HoverPreview } from './components/ui/hover-preview';
export type { HoverPreviewProps } from './components/ui/hover-preview';
export { DropZone } from './components/ui/drop-zone';
export type { DropZoneProps, DropZoneResult, FileRejection, FileRejectionCode, ValidationOptions } from './components/ui/drop-zone';
export { SmartSticky } from './components/ui/smart-sticky';
export type { SmartStickyProps } from './components/ui/smart-sticky';
export { HumanizedTime } from './components/ui/humanized-time';
export type { HumanizedTimeProps } from './components/ui/humanized-time';
export { Marquee } from './components/ui/marquee';
export type { MarqueeProps } from './components/ui/marquee';

// Entrypoint for the neob component library

// Styles (Vite will bundle this into index.css)
import './index.css';

// Utilities
export { cn, getThemeColor } from './lib/utilities';

// Components
export { Button, buttonVariants } from './components/ui/button';
export type { ButtonProperties } from './components/ui/button';

export { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

export {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogClose,
	DialogBody,
} from './components/ui/dialog';

export {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from './components/ui/alert-dialog';

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

export { OTPFieldRoot, OTPFieldInput } from './components/ui/otp-field';

export {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverAnchor,
	PopoverClose,
	PopoverDescription,
	PopoverTitle,
} from './components/ui/popover';

export { RadioGroup, RadioGroupItem } from './components/ui/radio-group';

export { Spinner } from './components/ui/spinner';

export { toast } from './components/ui/toast';
export { Toaster } from './components/ui/toaster';

export { Toggle } from './components/ui/toggle';

export { AnimatedNumber } from './components/ui/animated-number';

export { GridBackground } from './components/ui/grid-background';

export { Tooltip, TooltipProvider } from './components/ui/tooltip';

export {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

export { Meter } from './components/ui/meter';
export type { MeterProperties } from './components/ui/meter';

export { Skeleton, ListSkeleton } from './components/ui/skeleton';
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

export { SensitiveInput } from './components/ui/sensitive-input';
export type { SensitiveInputProperties } from './components/ui/sensitive-input';

export { Checkbox, CheckboxItem, CheckboxGroup } from './components/ui/checkbox';
export type { CheckboxProperties, CheckboxItemProperties, CheckboxGroupProperties } from './components/ui/checkbox';

export { Input, InputWrapper, Fieldset, TextInput } from './components/ui/input';
export type { InputProperties, InputWrapperProperties, FieldsetProperties, TextInputProperties } from './components/ui/input';

export { Switch } from './components/ui/switch';
export type { SwitchProperties } from './components/ui/switch';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectGroupLabel } from './components/ui/select';

export { Combobox, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxGroup, ComboboxGroupLabel } from './components/ui/combobox';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

export { TableContainer, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell } from './components/ui/table';
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

export { Pagination, PaginationInfo, PaginationPageSize, PaginationControls, PaginationSeparator } from './components/ui/pagination';
export type {
	PaginationProps,
	PaginationInfoProps,
	PaginationPageSizeProps,
	PaginationControlsProps,
	PaginationSeparatorProps,
	PaginationLabels,
} from './components/ui/pagination';

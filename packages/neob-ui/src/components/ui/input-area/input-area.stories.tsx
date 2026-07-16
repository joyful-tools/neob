import { expect, userEvent, waitFor, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { InputArea } from './input-area';

import type { InputAreaProperties } from './input-area';
import type { Meta, StoryObj } from '@storybook/react-vite';

type StoryProps = InputAreaProperties & {
	autoResizeEnabled?: boolean;
	maxRows?: number;
	animate?: boolean;
};

/**
 * InputArea is an auto-resizing brutalist textarea component.
 *
 * ### Usage
 * ```tsx
 * import { InputArea } from '@joyful-tools/neob';
 *
 * <InputArea value={text} onChange={(e) => setText(e.target.value)} maxRows={10} />
 * ```
 */
const meta: Meta<StoryProps> = {
	title: 'Inputs/InputArea',
	component: InputArea,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: {
			control: 'boolean',
		},
		placeholder: {
			control: 'text',
		},
	},
};

export default meta;
type Story = StoryObj<StoryProps>;

export const Default: Story = {
	args: {
		placeholder: 'Write your thoughts here...',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textarea = canvas.getByRole('textbox');
		await userEvent.type(textarea, 'Hello world');
		await expect(textarea).toHaveValue('Hello world');
	}),
};

export const AutoResize: Story = {
	args: {
		placeholder: 'Say something...',
		rows: 1,
	},
	argTypes: {
		autoResizeEnabled: {
			name: 'autoResize',
			control: 'boolean',
			description: 'Enable auto-resizing',
			table: {
				category: 'AutoResize Options',
			},
		},
		maxRows: {
			control: 'number',
			description: 'Maximum visible rows when auto-resizing is active',
			table: {
				category: 'AutoResize Options',
			},
		},
		animate: {
			control: 'boolean',
			description: 'Animate resizing adjustments',
			table: {
				category: 'AutoResize Options',
			},
		},
	},
	render: (args: StoryProps) => {
		// Extract custom control args so they don't pollute DOM properties on the textarea
		const { autoResizeEnabled = true, maxRows = 5, animate = true, ...textareaProps } = args;

		const autoResize = autoResizeEnabled ? { maxRows, animate } : false;

		return (
			<div className="w-96">
				<div className="flex flex-col gap-2">
					<label htmlFor="biography-input-area" className="text-sm font-bold text-black dark:text-white">
						Biography
					</label>
					<InputArea
						{...textareaProps}
						id="biography-input-area"
						aria-describedby="biography-input-area-description"
						autoResize={autoResize}
					/>
					<p id="biography-input-area-description" className="text-xs/normal text-muted-foreground">
						Tell us a bit about yourself.
					</p>
				</div>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textarea = canvas.getByRole('textbox', { name: 'Biography' });
		const resizeContainer = textarea.parentElement;

		await expect(resizeContainer).not.toBeNull();
		const initialHeight = Number.parseFloat(resizeContainer?.getAttribute('style')?.match(/height:\s*([\d.]+)px/)?.[1] ?? '0');

		await userEvent.type(textarea, 'A short bio{enter}with multiple{enter}lines to trigger resizing');
		await expect(textarea).toHaveValue('A short bio\nwith multiple\nlines to trigger resizing');

		await waitFor(() => {
			const resizedHeight = Number.parseFloat(resizeContainer?.getAttribute('style')?.match(/height:\s*([\d.]+)px/)?.[1] ?? '0');
			expect(resizedHeight).toBeGreaterThan(initialHeight);
		});
	}),
};

export const WithValidationWrapper: Story = {
	args: {
		id: 'project-notes-input-area',
		label: 'Project Notes',
		description: 'Add the internal context for this release.',
		error: 'Notes must include at least one deployment step.',
		required: true,
		placeholder: 'Write release notes...',
	},
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: (args) => (
		<div className="w-96">
			<InputArea {...args} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textarea = canvas.getByRole('textbox');
		const describedBy = textarea.getAttribute('aria-describedby');

		await expect(canvas.queryByText('Add the internal context for this release.')).not.toBeInTheDocument();
		await expect(canvas.queryByText('Notes must include at least one deployment step.')).not.toBeInTheDocument();
		await expect(textarea).toHaveAttribute('aria-invalid', 'true');
		await expect(textarea).toBeRequired();
		await expect(describedBy).toBeTruthy();
		await userEvent.type(textarea, 'Deploy API before worker rollout');
		await expect(textarea).toHaveValue('Deploy API before worker rollout');
	}),
};

export const AutoResizeMaxRows: Story = {
	args: {
		placeholder: 'Capture deployment steps...',
		rows: 1,
	},
	render: (args: StoryProps) => (
		<div className="w-96">
			<InputArea {...args} aria-label="Deployment Notes" autoResize={{ maxRows: 2, animate: false }} />
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textarea = canvas.getByRole('textbox', { name: 'Deployment Notes' });
		const resizeContainer = textarea.parentElement;

		await expect(resizeContainer).not.toBeNull();
		await userEvent.type(textarea, 'Step 1{enter}Step 2{enter}Step 3{enter}Step 4');
		await expect(textarea).toHaveValue('Step 1\nStep 2\nStep 3\nStep 4');

		await waitFor(() => {
			expect(resizeContainer?.getAttribute('style')).toContain('height');
			expect(textarea.style.overflowY).toBe('auto');
		});
	}),
};

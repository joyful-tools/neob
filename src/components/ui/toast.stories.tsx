import { Button } from './button';
import { toast } from './toast';
import { Toaster } from './toaster';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Components/Toast',
	parameters: {
		layout: 'centered',
	},
	decorators: [
		(Story) => (
			<>
				<Toaster />
				<Story />
			</>
		),
	],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button
				variant="default"
				onClick={() =>
					toast.custom('Default Toast', {
						description: 'This is a standard notification.',
					})
				}
			>
				Default
			</Button>
			<Button
				variant="accent"
				onClick={() =>
					toast.success('Success!', {
						description: 'Your changes have been saved.',
					})
				}
			>
				Success
			</Button>
			<Button
				variant="danger"
				onClick={() =>
					toast.error('Something went wrong', {
						description: 'Please try again later.',
					})
				}
			>
				Error
			</Button>
			<Button
				variant="subtle"
				onClick={() =>
					toast.info('Did you know?', {
						description: 'You can drag toasts to dismiss them.',
					})
				}
			>
				Info
			</Button>
			<Button
				variant="default"
				onClick={() =>
					toast.warning('Careful!', {
						description: 'This action may have side effects.',
					})
				}
			>
				Warning
			</Button>
		</div>
	),
};

export const WithActions: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button
				variant="default"
				onClick={() =>
					toast.custom('File uploaded', {
						description: 'document.pdf has been uploaded successfully.',
						action: {
							label: 'View File',
							onClick: () => alert('Viewing file...'),
						},
					})
				}
			>
				Default + Action
			</Button>
			<Button
				variant="accent"
				onClick={() =>
					toast.success('Team created', {
						description: 'Your new team is ready to go.',
						action: {
							label: 'Invite Members',
							onClick: () => alert('Opening invite...'),
						},
					})
				}
			>
				Success + Action
			</Button>
			<Button
				variant="danger"
				onClick={() =>
					toast.error('Connection failed', {
						description: 'Could not reach the server.',
						action: {
							label: 'Retry',
							onClick: () => alert('Retrying...'),
						},
					})
				}
			>
				Error + Action
			</Button>
		</div>
	),
};

export const Minimal: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="default" onClick={() => toast.custom('Copied to clipboard')}>
				Title Only
			</Button>
			<Button variant="accent" onClick={() => toast.success('Saved')}>
				Success Title Only
			</Button>
			<Button variant="danger" onClick={() => toast.error('Failed')}>
				Error Title Only
			</Button>
		</div>
	),
};

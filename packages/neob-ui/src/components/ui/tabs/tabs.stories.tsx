import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { Tabs } from './tabs';

import type { Meta, StoryObj } from '@storybook/react-vite';

type TabsStoryProperties = {
	initialValue: string;
	listVariant: 'segmented' | 'subtle';
};

/**
 * Tabs is an animated tab switcher list.
 *
 * ### Usage
 * ```tsx
 * import { Tabs } from '@joyful-tools/neob';
 *
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
 *     <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="tab1">Content One</Tabs.Content>
 *   <Tabs.Content value="tab2">Content Two</Tabs.Content>
 * </Tabs>
 * ```
 */
const meta = {
	title: 'Navigation/Tabs',
	component: Tabs,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<TabsStoryProperties>;

export const Segmented: Story = {
	args: {
		initialValue: 'account',
		listVariant: 'segmented',
	},
	render: (args) => {
		const [value, setValue] = useState<string | null>(args.initialValue);
		return (
			<div className="flex w-96 flex-col items-center gap-5">
				<Tabs
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('tabs-segmented-change')(nextValue);
					}}
				>
					<Tabs.List variant={args.listVariant}>
						<Tabs.Trigger value="account">Account</Tabs.Trigger>
						<Tabs.Trigger value="password">Password</Tabs.Trigger>
						<Tabs.Trigger value="settings">A very long option</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="account" className="py-4">
						<p className="text-sm font-medium text-muted-foreground">Make changes to your account here.</p>
					</Tabs.Content>
					<Tabs.Content value="password" className="py-4">
						<p className="text-sm font-medium text-muted-foreground">Change your password details here.</p>
					</Tabs.Content>
					<Tabs.Content value="settings" className="py-4">
						<p className="text-sm font-medium text-muted-foreground">Manage your system preferences here.</p>
					</Tabs.Content>
				</Tabs>
				<Button onClick={() => setValue(null)}>Reset</Button>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('tab', { name: 'Password' }));
		await expect(canvas.getByText('Change your password details here.')).toBeInTheDocument();
	}),
};

export const Subtle: Story = {
	args: {
		initialValue: 'account',
		listVariant: 'subtle',
	},
	render: (args) => {
		const [value, setValue] = useState<string | null>(args.initialValue);
		return (
			<div className="w-96">
				<Tabs
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('tabs-subtle-change')(nextValue);
					}}
				>
					<Tabs.List variant={args.listVariant}>
						<Tabs.Trigger value="account">Account</Tabs.Trigger>
						<Tabs.Trigger value="password">Password</Tabs.Trigger>
						<Tabs.Trigger value="settings">A very long option</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="account" className="py-4">
						<p className="text-sm font-medium text-muted-foreground">Make changes to your account here.</p>
					</Tabs.Content>
					<Tabs.Content value="password" className="py-4">
						<p className="text-sm font-medium text-muted-foreground">Change your password details here.</p>
					</Tabs.Content>
					<Tabs.Content value="settings" className="py-4">
						<p className="text-sm font-medium text-muted-foreground">Manage your system preferences here.</p>
					</Tabs.Content>
				</Tabs>
				<Button onClick={() => setValue(null)}>Reset</Button>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('tab', { name: 'A very long option' }));
		await expect(canvas.getByText('Manage your system preferences here.')).toBeInTheDocument();
	}),
};

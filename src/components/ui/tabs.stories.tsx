import * as React from 'react';

import { Tabs } from './tabs';

import type { Meta } from '@storybook/react-vite';

const meta = {
	title: 'Navigation/Tabs',
	component: Tabs,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;

export const Segmented = {
	render: () => {
		return (
			<div className="w-96">
				<Tabs defaultValue="account">
					<Tabs.List variant="segmented">
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
			</div>
		);
	},
};

export const Subtle = {
	render: () => {
		return (
			<div className="w-96">
				<Tabs defaultValue="account">
					<Tabs.List variant="subtle">
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
			</div>
		);
	},
};

import * as React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

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

export const Default = {
	render: () => {
		return (
			<div className="w-96">
				<Tabs defaultValue="account">
					<TabsList>
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="password">Password</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>
					<TabsContent value="account" className="py-4">
						<p className="text-sm font-medium">Make changes to your account here.</p>
					</TabsContent>
					<TabsContent value="password" className="py-4">
						<p className="text-sm font-medium">Change your password details here.</p>
					</TabsContent>
					<TabsContent value="settings" className="py-4">
						<p className="text-sm font-medium">Manage your system preferences here.</p>
					</TabsContent>
				</Tabs>
			</div>
		);
	},
};

export const CardLayout = {
	render: () => {
		return (
			<div className="w-96">
				<Tabs defaultValue="tab1">
					<TabsList>
						<TabsTrigger value="tab1">Overview</TabsTrigger>
						<TabsTrigger value="tab2">Specifications</TabsTrigger>
						<TabsTrigger value="tab3">Reviews</TabsTrigger>
					</TabsList>
					<div className="mt-2 rounded-lg border-2 border-black bg-white p-6 text-black shadow-brutal-sm dark:bg-zinc dark:text-white">
						<TabsContent value="tab1">
							<h3 className="mb-2 font-display text-lg font-bold">Project Overview</h3>
							<p className="text-sm/relaxed text-muted-foreground">
								This is a premium React component library designed with neobrutalist aesthetics, high contrast elements, and solid user
								accessibility patterns.
							</p>
						</TabsContent>
						<TabsContent value="tab2">
							<h3 className="mb-2 font-display text-lg font-bold">Specs</h3>
							<ul className="list-inside list-disc space-y-1 text-sm/relaxed text-muted-foreground">
								<li>React 19 React Router 7</li>
								<li>Base UI components</li>
								<li>Tailwind CSS v4.0</li>
								<li>TypeScript + Vite compilation</li>
							</ul>
						</TabsContent>
						<TabsContent value="tab3">
							<h3 className="mb-2 font-display text-lg font-bold">User Reviews</h3>
							<p className="text-sm/relaxed text-muted-foreground">
								"The Stark brutalist design looks incredibly premium. Highly recommended!" — Timo W.
							</p>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		);
	},
};

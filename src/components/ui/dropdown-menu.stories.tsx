import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';

import { Button } from './button';
import { DropdownMenu } from './dropdown-menu';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Navigation/DropdownMenu',
	component: DropdownMenu,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		return (
			<DropdownMenu>
				<DropdownMenu.Trigger>
					<Button variant="default">Open Account Menu</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="center">
					<DropdownMenu.Label>Account Settings</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item onSelect={() => action('dropdown-view-profile')()}>View Profile</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={() => action('dropdown-open-billing-plans')()}>Open Billing & Plans</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={() => action('dropdown-open-security-settings')()}>Open Security Settings</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Item disabled>Developer API (Beta)</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item className="text-red focus:bg-red focus:text-white" onSelect={() => action('dropdown-sign-out')()}>
						Sign Out
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Open Account Menu' }));
		await expect(body.getByText('Account Settings')).toBeInTheDocument();
		await expect(body.getByText('View Profile')).toBeInTheDocument();
	}),
};

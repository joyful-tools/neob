import * as React from 'react';

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
	render: () => {
		return (
			<DropdownMenu>
				<DropdownMenu.Trigger>
					<Button variant="default">Options Menu</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="center">
					<DropdownMenu.Label>Account Settings</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item onSelect={() => alert('Profile clicked')}>View Profile</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={() => alert('Billing clicked')}>Billing & Plans</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={() => alert('Security clicked')}>Security Settings</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Item disabled>Developer API (Beta)</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item className="text-red focus:bg-red focus:text-white" onSelect={() => alert('Logout clicked')}>
						Sign Out
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu>
		);
	},
};

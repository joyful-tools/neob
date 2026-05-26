import * as React from 'react';

import { Button } from './button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './dropdown-menu';

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
				<DropdownMenuTrigger>
					<Button variant="default">Options Menu</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="center">
					<DropdownMenuLabel>Account Settings</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={() => alert('Profile clicked')}>View Profile</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => alert('Billing clicked')}>Billing & Plans</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => alert('Security clicked')}>Security Settings</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem disabled>Developer API (Beta)</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-red focus:bg-red focus:text-white" onSelect={() => alert('Logout clicked')}>
						Sign Out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

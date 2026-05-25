import * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from './card';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Components/Card',
	component: Card,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		className: 'w-96',
		children: (
			<>
				<CardHeader>
					<CardTitle>Neo-Brutalist Card</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm">
						This is a premium card built with a bold black border and a thick drop shadow that defines the neo-brutalism design system.
					</p>
				</CardContent>
			</>
		),
	},
};

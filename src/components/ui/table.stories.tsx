import * as React from 'react';

import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from './table';

import type { Meta } from '@storybook/react-vite';

const meta = {
	title: 'Data Display/Table',
	component: TableContainer,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof TableContainer>;

export default meta;

const INVOICES = [
	{ id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
	{ id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
	{ id: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
	{ id: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
];

export const Default = {
	render: () => {
		return (
			<div className="w-[500px]">
				<TableContainer>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Method</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{INVOICES.map((invoice) => (
							<TableRow key={invoice.id}>
								<TableCell className="font-mono">{invoice.id}</TableCell>
								<TableCell>{invoice.status}</TableCell>
								<TableCell>{invoice.method}</TableCell>
								<TableCell className="text-right font-bold">{invoice.amount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</TableContainer>
			</div>
		);
	},
};

export const WithFooter = {
	render: () => {
		return (
			<div className="w-[500px]">
				<TableContainer>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Method</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{INVOICES.map((invoice) => (
							<TableRow key={invoice.id}>
								<TableCell className="font-mono">{invoice.id}</TableCell>
								<TableCell>{invoice.status}</TableCell>
								<TableCell>{invoice.method}</TableCell>
								<TableCell className="text-right">{invoice.amount}</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right font-black">$1,200.00</TableCell>
						</TableRow>
					</TableFooter>
				</TableContainer>
			</div>
		);
	},
};

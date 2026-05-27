import * as React from 'react';

import { Table } from './table';

import type { Meta } from '@storybook/react-vite';

const meta = {
	title: 'Data Display/Table',
	component: Table,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Table>;

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
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.Head>Invoice</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head>Method</Table.Head>
							<Table.Head className="text-right">Amount</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{INVOICES.map((invoice) => (
							<Table.Row key={invoice.id}>
								<Table.Cell className="font-mono">{invoice.id}</Table.Cell>
								<Table.Cell>{invoice.status}</Table.Cell>
								<Table.Cell>{invoice.method}</Table.Cell>
								<Table.Cell className="text-right font-bold">{invoice.amount}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
		);
	},
};

export const WithFooter = {
	render: () => {
		return (
			<div className="w-[500px]">
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.Head>Invoice</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head>Method</Table.Head>
							<Table.Head className="text-right">Amount</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{INVOICES.map((invoice) => (
							<Table.Row key={invoice.id}>
								<Table.Cell className="font-mono">{invoice.id}</Table.Cell>
								<Table.Cell>{invoice.status}</Table.Cell>
								<Table.Cell>{invoice.method}</Table.Cell>
								<Table.Cell className="text-right">{invoice.amount}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
					<Table.Footer>
						<Table.Row>
							<Table.Cell colSpan={3}>Total</Table.Cell>
							<Table.Cell className="text-right font-black">$1,200.00</Table.Cell>
						</Table.Row>
					</Table.Footer>
				</Table>
			</div>
		);
	},
};

import { Table } from './table';

import type { Meta } from '@storybook/react-vite';

type TableStoryProperties = {
	invoices: typeof INVOICES;
	showFooter?: boolean;
	total?: string;
};

/**
 * Table is a tabular data container with brutalist borders.
 *
 * ### General Usage
 * ```tsx
 * import { Table } from 'neob';
 *
 * <Table>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Name</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>Alice</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 */
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

export const Default: import('@storybook/react-vite').StoryObj<TableStoryProperties> = {
	args: {
		invoices: INVOICES,
		showFooter: false,
	},
	render: (args) => {
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
						{args.invoices.map((invoice) => (
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

export const WithFooter: import('@storybook/react-vite').StoryObj<TableStoryProperties> = {
	args: {
		invoices: INVOICES,
		showFooter: true,
		total: '$1,200.00',
	},
	render: (args) => {
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
						{args.invoices.map((invoice) => (
							<Table.Row key={invoice.id}>
								<Table.Cell className="font-mono">{invoice.id}</Table.Cell>
								<Table.Cell>{invoice.status}</Table.Cell>
								<Table.Cell>{invoice.method}</Table.Cell>
								<Table.Cell className="text-right">{invoice.amount}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
					{args.showFooter && (
						<Table.Footer>
							<Table.Row>
								<Table.Cell colSpan={3}>Total</Table.Cell>
								<Table.Cell className="text-right font-black">{args.total}</Table.Cell>
							</Table.Row>
						</Table.Footer>
					)}
				</Table>
			</div>
		);
	},
};

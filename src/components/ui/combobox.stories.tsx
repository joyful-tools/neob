import { CaretUpDown } from '@phosphor-icons/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import * as React from 'react';
import { action } from 'storybook/actions';

import { guardPlay } from '@/lib/storybook-interactions';
import { cn } from '@/lib/utilities';

import { Button } from './button';
import { Combobox } from './combobox';

import type { Meta, StoryObj } from '@storybook/react-vite';

function Text({
	children,
	variant,
	size,
	className,
	as: Component = 'span',
}: {
	readonly children: React.ReactNode;
	readonly variant?: 'secondary';
	readonly size?: 'xs';
	readonly className?: string;
	readonly as?: 'span' | 'div';
}) {
	return (
		<Component
			className={cn(
				'text-sm font-bold text-black dark:text-white',
				variant === 'secondary' && 'font-normal text-muted-foreground',
				size === 'xs' && 'text-xs',
				className,
			)}
		>
			{children}
		</Component>
	);
}

const meta = {
	title: 'Inputs/Combobox',
	component: Combobox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Data
// ============================================================================

const fruits = [
	'Apple',
	'Apricot',
	'Avocado',
	'Banana',
	'Blackberry',
	'Blueberry',
	'Cantaloupe',
	'Cherry',
	'Coconut',
	'Cranberry',
	'Date',
	'Dragon Fruit',
	'Fig',
	'Grape',
	'Grapefruit',
	'Guava',
	'Honeydew',
	'Kiwi',
	'Lemon',
	'Lime',
	'Lychee',
	'Mango',
	'Nectarine',
	'Orange',
	'Papaya',
	'Passion Fruit',
	'Peach',
	'Pear',
	'Persimmon',
	'Pineapple',
	'Plum',
	'Pomegranate',
	'Raspberry',
	'Starfruit',
	'Strawberry',
	'Tangerine',
	'Watermelon',
];

type Language = {
	value: string;
	label: string;
	emoji: string;
};

const languages: Language[] = [
	{ value: 'en', label: 'English', emoji: '🇬🇧' },
	{ value: 'fr', label: 'French', emoji: '🇫🇷' },
	{ value: 'de', label: 'German', emoji: '🇩🇪' },
	{ value: 'es', label: 'Spanish', emoji: '🇪🇸' },
	{ value: 'it', label: 'Italian', emoji: '🇮🇹' },
	{ value: 'pt', label: 'Portuguese', emoji: '🇵🇹' },
	{ value: 'nl', label: 'Dutch', emoji: '🇳🇱' },
	{ value: 'pl', label: 'Polish', emoji: '🇵🇱' },
	{ value: 'ru', label: 'Russian', emoji: '🇷🇺' },
	{ value: 'ja', label: 'Japanese', emoji: '🇯🇵' },
	{ value: 'zh', label: 'Chinese', emoji: '🇨🇳' },
	{ value: 'ko', label: 'Korean', emoji: '🇰🇷' },
	{ value: 'ar', label: 'Arabic', emoji: '🇸🇦' },
	{ value: 'hi', label: 'Hindi', emoji: '🇮🇳' },
	{ value: 'tr', label: 'Turkish', emoji: '🇹🇷' },
	{ value: 'vi', label: 'Vietnamese', emoji: '🇻🇳' },
	{ value: 'th', label: 'Thai', emoji: '🇹🇭' },
	{ value: 'sv', label: 'Swedish', emoji: '🇸🇪' },
	{ value: 'no', label: 'Norwegian', emoji: '🇳🇴' },
	{ value: 'da', label: 'Danish', emoji: '🇩🇰' },
	{ value: 'fi', label: 'Finnish', emoji: '🇫🇮' },
	{ value: 'el', label: 'Greek', emoji: '🇬🇷' },
	{ value: 'cs', label: 'Czech', emoji: '🇨🇿' },
	{ value: 'ro', label: 'Romanian', emoji: '🇷🇴' },
	{ value: 'hu', label: 'Hungarian', emoji: '🇭🇺' },
	{ value: 'uk', label: 'Ukrainian', emoji: '🇺🇦' },
	{ value: 'id', label: 'Indonesian', emoji: '🇮🇩' },
	{ value: 'ms', label: 'Malay', emoji: '🇲🇾' },
	{ value: 'he', label: 'Hebrew', emoji: '🇮🇱' },
	{ value: 'fa', label: 'Persian', emoji: '🇮🇷' },
];

type ServerLocation = {
	label: string;
	value: string;
};

type ServerLocationGroup = {
	value: string;
	items: ServerLocation[];
};

const servers: ServerLocationGroup[] = [
	{
		value: 'Asia',
		items: [
			{ label: 'Japan', value: 'japan' },
			{ label: 'China', value: 'china' },
			{ label: 'Singapore', value: 'singapore' },
			{ label: 'South Korea', value: 'south-korea' },
			{ label: 'India', value: 'india' },
			{ label: 'Hong Kong', value: 'hong-kong' },
			{ label: 'Taiwan', value: 'taiwan' },
			{ label: 'Thailand', value: 'thailand' },
		],
	},
	{
		value: 'Europe',
		items: [
			{ label: 'Germany', value: 'germany' },
			{ label: 'France', value: 'france' },
			{ label: 'Italy', value: 'italy' },
			{ label: 'United Kingdom', value: 'uk' },
			{ label: 'Netherlands', value: 'netherlands' },
			{ label: 'Spain', value: 'spain' },
			{ label: 'Poland', value: 'poland' },
			{ label: 'Sweden', value: 'sweden' },
		],
	},
	{
		value: 'North America',
		items: [
			{ label: 'United States (East)', value: 'us-east' },
			{ label: 'United States (West)', value: 'us-west' },
			{ label: 'Canada', value: 'canada' },
			{ label: 'Mexico', value: 'mexico' },
		],
	},
	{
		value: 'South America',
		items: [
			{ label: 'Brazil', value: 'brazil' },
			{ label: 'Argentina', value: 'argentina' },
			{ label: 'Chile', value: 'chile' },
		],
	},
	{
		value: 'Oceania',
		items: [
			{ label: 'Australia', value: 'australia' },
			{ label: 'New Zealand', value: 'new-zealand' },
		],
	},
];

type DatabaseItem = {
	value: string;
	label: string;
};

const databases: DatabaseItem[] = [
	{ value: 'postgres', label: 'PostgreSQL' },
	{ value: 'mysql', label: 'MySQL' },
	{ value: 'mariadb', label: 'MariaDB' },
	{ value: 'mongodb', label: 'MongoDB' },
	{ value: 'redis', label: 'Redis' },
	{ value: 'sqlite', label: 'SQLite' },
	{ value: 'cassandra', label: 'Apache Cassandra' },
	{ value: 'dynamodb', label: 'Amazon DynamoDB' },
	{ value: 'couchdb', label: 'CouchDB' },
	{ value: 'neo4j', label: 'Neo4j' },
	{ value: 'elasticsearch', label: 'Elasticsearch' },
	{ value: 'cockroachdb', label: 'CockroachDB' },
	{ value: 'timescaledb', label: 'TimescaleDB' },
	{ value: 'clickhouse', label: 'ClickHouse' },
	{ value: 'firestore', label: 'Google Firestore' },
	{ value: 'supabase', label: 'Supabase' },
	{ value: 'planetscale', label: 'PlanetScale' },
	{ value: 'fauna', label: 'Fauna' },
	{ value: 'surrealdb', label: 'SurrealDB' },
	{ value: 'turso', label: 'Turso' },
];

type WorkspaceAppItem = {
	value: string;
	label: string;
	vendor: string;
};

const workspaceApps: WorkspaceAppItem[] = [
	{ value: 'notion', label: 'Notion', vendor: 'Notion' },
	{ value: 'linear', label: 'Linear', vendor: 'Linear' },
	{ value: 'figma', label: 'Figma', vendor: 'Figma' },
	{ value: 'slack', label: 'Slack', vendor: 'Slack' },
	{ value: 'discord', label: 'Discord', vendor: 'Discord' },
	{ value: 'miro', label: 'Miro', vendor: 'Miro' },
	{ value: 'loom', label: 'Loom', vendor: 'Atlassian' },
	{ value: 'raycast', label: 'Raycast', vendor: 'Raycast' },
	{ value: 'framer', label: 'Framer', vendor: 'Framer' },
	{ value: 'jira', label: 'Jira', vendor: 'Atlassian' },
	{ value: 'github', label: 'GitHub', vendor: 'GitHub' },
	{ value: 'gitlab', label: 'GitLab', vendor: 'GitLab' },
	{ value: 'airtable', label: 'Airtable', vendor: 'Airtable' },
	{ value: 'zapier', label: 'Zapier', vendor: 'Zapier' },
	{ value: 'dropbox', label: 'Dropbox', vendor: 'Dropbox' },
	{ value: 'todoist', label: 'Todoist', vendor: 'Doist' },
	{ value: 'canva', label: 'Canva', vendor: 'Canva' },
	{ value: 'clickup', label: 'ClickUp', vendor: 'ClickUp' },
	{ value: 'trello', label: 'Trello', vendor: 'Atlassian' },
	{ value: 'zoom', label: 'Zoom', vendor: 'Zoom' },
];

// ============================================================================
// Demos
// ============================================================================

export const Default: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [value, setValue] = React.useState<string | null>('Apple');

		return (
			<div className="w-[300px]">
				<Combobox
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-default-change')(nextValue);
					}}
					items={fruits}
				>
					<Combobox.TriggerInput placeholder="Please select" />
					<Combobox.Content>
						<Combobox.Empty />
						<Combobox.List>
							{(item: string) => (
								<Combobox.Item key={item} value={item}>
									{item}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox');
		const body = within(document.body);
		await userEvent.click(combobox);
		await userEvent.clear(combobox);
		await userEvent.type(combobox, 'Ban');
		await expect(await body.findByRole('option', { name: 'Banana' })).toBeInTheDocument();
		await expect(body.queryByRole('option', { name: 'Apple' })).toBeNull();
	}),
};

export const SearchableInside = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [value, setValue] = React.useState<Language | null>(languages[0]);

		return (
			<div className="size-[300px]">
				<Combobox
					aria-label="Language selection"
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-searchable-inside-change')(nextValue);
					}}
					items={languages}
				>
					<Combobox.TriggerValue className="w-[200px]" />
					<Combobox.Content>
						<Combobox.Input placeholder="Search languages" />
						<Combobox.Empty />
						<Combobox.List>
							{(item: Language) => (
								<Combobox.Item key={item.value} value={item}>
									{item.emoji} {item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: /language selection/i });
		const body = within(document.body);
		await userEvent.click(combobox);

		const searchInput = await body.findByPlaceholderText('Search languages');
		await userEvent.type(searchInput, 'fr');
		await expect(searchInput).toHaveValue('fr');
		await expect(await body.findByRole('option', { name: /French/ })).toBeInTheDocument();
		await expect(body.queryByRole('option', { name: /English/ })).toBeNull();
	}),
};

export const SearchableSelect: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [value, setValue] = React.useState<Language | null>(null);

		return (
			<div className="size-[300px]">
				<Combobox
					aria-label="Select a language"
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-searchable-select-change')(nextValue);
					}}
					items={languages}
				>
					<Combobox.TriggerValue className="w-[200px]" placeholder="Select a language" />
					<Combobox.Content>
						<Combobox.Input placeholder="Search languages" />
						<Combobox.Empty />
						<Combobox.List>
							{(item: Language) => (
								<Combobox.Item key={item.value} value={item}>
									{item.emoji} {item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: /select a language/i });
		const body = within(document.body);
		await userEvent.click(combobox);

		const searchInput = await body.findByPlaceholderText('Search languages');
		await userEvent.type(searchInput, 'ja');
		await expect(searchInput).toHaveValue('ja');
		await expect(await body.findByRole('option', { name: /Japanese/ })).toBeInTheDocument();
		await expect(body.queryByRole('option', { name: /French/ })).toBeNull();
	}),
};

export const Grouped = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [value, setValue] = React.useState<ServerLocation | null>(null);

		return (
			<div className="size-[300px]">
				<Combobox
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-grouped-change')(nextValue);
					}}
					items={servers}
				>
					<Combobox.TriggerInput className="w-[200px]" placeholder="Select server" />
					<Combobox.Content>
						<Combobox.Empty />
						<Combobox.List>
							{(group: ServerLocationGroup) => (
								<Combobox.Group key={group.value} items={group.items}>
									<Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
									<Combobox.Collection>
										{(item: ServerLocation) => (
											<Combobox.Item key={item.value} value={item}>
												{item.label}
											</Combobox.Item>
										)}
									</Combobox.Collection>
								</Combobox.Group>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox');
		const body = within(document.body);
		await userEvent.click(combobox);
		await expect(await body.findByText('Asia')).toBeInTheDocument();
		await expect(await body.findByText('Europe')).toBeInTheDocument();
		await userEvent.type(combobox, 'ger');
		await expect(await body.findByRole('option', { name: 'Germany' })).toBeInTheDocument();
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await waitFor(() => expect(combobox).toHaveValue('Germany'));
	}),
};

export const Multiple: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [value, setValue] = React.useState<WorkspaceAppItem[]>([]);

		return (
			<div className="w-[400px]">
				<Combobox
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-multiple-change')(nextValue);
					}}
					items={workspaceApps}
					isItemEqualToValue={(app: WorkspaceAppItem, selected: WorkspaceAppItem) => app.value === selected.value}
					multiple
				>
					<Combobox.TriggerMultipleWithInput
						className="w-full"
						placeholder="Select apps"
						renderItem={(selected: WorkspaceAppItem) => <Combobox.Chip key={selected.value}>{selected.label}</Combobox.Chip>}
						inputSide="right"
					/>
					<Combobox.Content className="max-h-[200px] overflow-y-auto">
						<Combobox.Empty />
						<Combobox.List>
							{(item: WorkspaceAppItem) => (
								<Combobox.Item key={item.value} value={item}>
									<div className="flex gap-2">
										<Text>{item.label}</Text>
										<Text variant="secondary">{item.vendor}</Text>
									</div>
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox');
		const body = within(document.body);
		await userEvent.click(combobox);
		await userEvent.type(combobox, 'Not');
		await expect(await body.findByRole('option', { name: /Notion/ })).toBeInTheDocument();
		await expect(body.queryByRole('option', { name: /Slack/ })).toBeNull();
	}),
};

export const WithField = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [value, setValue] = React.useState<DatabaseItem | null>(null);

		return (
			<div className="w-80">
				<Combobox
					items={databases}
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-with-field-change')(nextValue);
					}}
					label="Database"
					description="Select your preferred database"
				>
					<Combobox.TriggerInput placeholder="Select database" />
					<Combobox.Content>
						<Combobox.Empty />
						<Combobox.List>
							{(item: DatabaseItem) => (
								<Combobox.Item key={item.value} value={item}>
									{item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByPlaceholderText('Select database');
		const body = within(document.body);
		await expect(canvas.getByText('Select your preferred database')).toBeInTheDocument();
		await userEvent.click(combobox);
		await userEvent.type(combobox, 'Post');
		await expect(await body.findByRole('option', { name: 'PostgreSQL' })).toBeInTheDocument();
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await waitFor(() => expect(combobox).toHaveValue('PostgreSQL'));
	}),
};

export const Disabled = {
	render: () => {
		return (
			<div className="flex w-[500px] flex-wrap items-start gap-4">
				<Combobox value="Apple" items={fruits} disabled>
					<Combobox.TriggerInput className="w-[200px]" placeholder="Select fruit" />
					<Combobox.Content>
						<Combobox.Empty />
						<Combobox.List>
							{(item: string) => (
								<Combobox.Item key={item} value={item}>
									{item}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>

				<Combobox aria-label="Disabled language selection" value={languages[0]} items={languages} disabled>
					<Combobox.TriggerValue className="w-[200px]" />
					<Combobox.Content>
						<Combobox.Input placeholder="Search" />
						<Combobox.Empty />
						<Combobox.List>
							{(item: Language) => (
								<Combobox.Item key={item.value} value={item}>
									{item.emoji} {item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
};

export const DisabledItems = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		type DatabaseItemWithDisabled = DatabaseItem & {
			disabled?: boolean;
			reason?: string;
		};

		const items: DatabaseItemWithDisabled[] = [
			{ value: 'postgres', label: 'PostgreSQL' },
			{ value: 'mysql', label: 'MySQL' },
			{ value: 'mariadb', label: 'MariaDB', disabled: true, reason: 'Beta' },
			{ value: 'mongodb', label: 'MongoDB' },
			{
				value: 'cassandra',
				label: 'Apache Cassandra',
				disabled: true,
				reason: 'Coming soon',
			},
			{ value: 'redis', label: 'Redis' },
			{ value: 'firebase-rt', label: 'Firebase Realtime Database' },
		];

		const [value, setValue] = React.useState<DatabaseItemWithDisabled | null>(null);

		return (
			<div className="h-[300px] w-80">
				<Combobox
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-disabled-items-change')(nextValue);
					}}
					items={items}
				>
					<Combobox.TriggerInput placeholder="Select database" />
					<Combobox.Content>
						<Combobox.Empty />
						<Combobox.List>
							{(item: DatabaseItemWithDisabled) => (
								<Combobox.Item key={item.value} value={item} disabled={item.disabled}>
									<span>
										{item.label}
										{item.reason && (
											<Text variant="secondary" size="xs" as="span">
												{' — '}
												{item.reason}
											</Text>
										)}
									</span>
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByPlaceholderText('Select database');
		const body = within(document.body);
		await userEvent.click(combobox);

		const disabledOption = await body.findByRole('option', { name: /MariaDB/ });
		await expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
		await expect(combobox).toHaveValue('');

		await userEvent.clear(combobox);
		await userEvent.type(combobox, 'Red');
		await expect(await body.findByRole('option', { name: /Redis/ })).toBeInTheDocument();
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await waitFor(() => expect(combobox).toHaveValue('Redis'));
	}),
};

export const Error = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [value, setValue] = React.useState<DatabaseItem | null>(null);

		return (
			<div className="w-80">
				<Combobox
					items={databases}
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-error-change')(nextValue);
					}}
					label="Database"
					error="Please select a database"
				>
					<Combobox.TriggerInput placeholder="Select database" />
					<Combobox.Content>
						<Combobox.Empty />
						<Combobox.List>
							{(item: DatabaseItem) => (
								<Combobox.Item key={item.value} value={item}>
									{item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByPlaceholderText('Select database');
		const body = within(document.body);
		await expect(combobox).toHaveAttribute('aria-invalid', 'true');
		await userEvent.click(combobox);
		await userEvent.type(combobox, 'My');
		await expect(await body.findByRole('option', { name: 'MySQL' })).toBeInTheDocument();
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await waitFor(() => expect(combobox).toHaveValue('MySQL'));
	}),
};

export const Sizes = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [smValue, setSmValue] = React.useState<string | null>(null);
		const [baseValue, setBaseValue] = React.useState<string | null>(null);

		return (
			<div className="flex w-[500px] flex-wrap items-center gap-4">
				<Combobox
					size="sm"
					value={smValue}
					onValueChange={(nextValue) => {
						setSmValue(nextValue);
						action('combobox-size-sm-change')(nextValue);
					}}
					items={fruits.slice(0, 8)}
				>
					<Combobox.TriggerInput placeholder="Small (sm)" />
					<Combobox.Content>
						<Combobox.Empty />
						<Combobox.List>
							{(item: string) => (
								<Combobox.Item key={item} value={item}>
									{item}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
				<Combobox
					size="base"
					value={baseValue}
					onValueChange={(nextValue) => {
						setBaseValue(nextValue);
						action('combobox-size-base-change')(nextValue);
					}}
					items={fruits.slice(0, 8)}
				>
					<Combobox.TriggerInput placeholder="Base (default)" />
					<Combobox.Content>
						<Combobox.Empty />
						<Combobox.List>
							{(item: string) => (
								<Combobox.Item key={item} value={item}>
									{item}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const comboboxes = canvas.getAllByRole('combobox');
		const body = within(document.body);
		await userEvent.click(comboboxes[0]);
		await expect(await body.findByRole('option', { name: 'Banana' })).toBeInTheDocument();
	}),
};

export const SizesSearchableInside = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [smValue, setSmValue] = React.useState<Language | null>(languages[0]);
		const [baseValue, setBaseValue] = React.useState<Language | null>(languages[1]);

		return (
			<div className="flex h-[300px] w-[500px] flex-wrap items-center gap-4">
				<Combobox
					aria-label="Small language selection"
					size="sm"
					value={smValue}
					onValueChange={(nextValue) => {
						setSmValue(nextValue);
						action('combobox-size-searchable-sm-change')(nextValue);
					}}
					items={languages}
				>
					<Combobox.TriggerValue className="w-[160px]" />
					<Combobox.Content>
						<Combobox.Input placeholder="Search" />
						<Combobox.Empty />
						<Combobox.List>
							{(item: Language) => (
								<Combobox.Item key={item.value} value={item}>
									{item.emoji} {item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
				<Combobox
					aria-label="Base language selection"
					size="base"
					value={baseValue}
					onValueChange={(nextValue) => {
						setBaseValue(nextValue);
						action('combobox-size-searchable-base-change')(nextValue);
					}}
					items={languages}
				>
					<Combobox.TriggerValue className="w-[180px]" />
					<Combobox.Content>
						<Combobox.Input placeholder="Search" />
						<Combobox.Empty />
						<Combobox.List>
							{(item: Language) => (
								<Combobox.Item key={item.value} value={item}>
									{item.emoji} {item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: /small language selection/i });
		const body = within(document.body);
		await userEvent.click(combobox);
		await expect(await body.findByRole('option', { name: /French/ })).toBeInTheDocument();
	}),
};

export const CustomTrigger: Story = {
	parameters: {
		a11y: {
			test: 'off',
		},
	},
	render: () => {
		const [value, setValue] = React.useState<Language | null>(languages[0]);

		return (
			<div className="size-[300px]">
				<Combobox
					aria-label="Custom language selection"
					value={value}
					onValueChange={(nextValue) => {
						setValue(nextValue);
						action('combobox-custom-trigger-change')(nextValue);
					}}
					items={languages}
				>
					<Combobox.Trigger
						render={
							<Button
								variant="ghost"
								size="default"
								className={cn('justify-between overflow-hidden transition-[width] duration-300 ease-spring')}
							/>
						}
					>
						<Combobox.Value>
							<span className="truncate">{value ? `${value.emoji} ${value.label}` : 'Select a language'}</span>
						</Combobox.Value>
						<CaretUpDown size={14} className="shrink-0 text-black/60 dark:text-white/60" />
					</Combobox.Trigger>
					<Combobox.Content>
						<Combobox.Input placeholder="Search languages" />
						<Combobox.Empty />
						<Combobox.List>
							{(item: Language) => (
								<Combobox.Item key={item.value} value={item}>
									{item.emoji} {item.label}
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Content>
				</Combobox>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: /custom language selection/i });
		const body = within(document.body);
		await userEvent.click(combobox);
		await expect(await body.findByRole('option', { name: /French/ })).toBeInTheDocument();
	}),
};

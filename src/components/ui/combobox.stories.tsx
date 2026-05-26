import { CaretUpDown } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Button } from './button';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxItem,
	ComboboxInput,
	ComboboxList,
	ComboboxTriggerValue,
	ComboboxTriggerMultipleWithInput,
	ComboboxChip,
} from './combobox';

import type { Meta } from '@storybook/react-vite';

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
	{ value: 'd1', label: 'Cloudflare D1' },
	{ value: 'turso', label: 'Turso' },
];

type BotItem = {
	value: string;
	label: string;
	author: string;
};

const bots: BotItem[] = [
	{ value: 'googlebot', label: 'Googlebot', author: 'Google' },
	{ value: 'bingbot', label: 'Bingbot', author: 'Microsoft' },
	{ value: 'yandexbot', label: 'YandexBot', author: 'Yandex' },
	{ value: 'duckduckbot', label: 'DuckDuckBot', author: 'DuckDuckGo' },
	{ value: 'baiduspider', label: 'Baiduspider', author: 'Baidu' },
	{ value: 'slurp', label: 'Yahoo Slurp', author: 'Yahoo' },
	{ value: 'applebot', label: 'Applebot', author: 'Apple' },
	{ value: 'facebookbot', label: 'Facebookbot', author: 'Meta' },
	{ value: 'twitterbot', label: 'Twitterbot', author: 'X' },
	{ value: 'linkedinbot', label: 'LinkedInBot', author: 'LinkedIn' },
	{ value: 'pinterestbot', label: 'Pinterest', author: 'Pinterest' },
	{ value: 'discordbot', label: 'Discordbot', author: 'Discord' },
	{ value: 'slackbot', label: 'Slackbot', author: 'Slack' },
	{ value: 'telegrambot', label: 'TelegramBot', author: 'Telegram' },
	{ value: 'whatsapp', label: 'WhatsApp', author: 'Meta' },
	{ value: 'semrushbot', label: 'SemrushBot', author: 'Semrush' },
	{ value: 'ahrefsbot', label: 'AhrefsBot', author: 'Ahrefs' },
	{ value: 'mj12bot', label: 'MJ12bot', author: 'Majestic' },
	{ value: 'dotbot', label: 'DotBot', author: 'Moz' },
	{ value: 'petalbot', label: 'PetalBot', author: 'Huawei' },
];

// ============================================================================
// Demos
// ============================================================================

export const Default = {
	render: () => {
		const [value, setValue] = React.useState<string | null>('Apple');

		return (
			<div className="w-[300px]">
				<Combobox value={value} onValueChange={(v) => setValue(v)} items={fruits}>
					<ComboboxInput placeholder="Please select" />
					<ComboboxContent>
						<ComboboxEmpty />
						<ComboboxList>
							{(item: string) => (
								<ComboboxItem key={item} value={item}>
									{item}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const SearchableInside = {
	render: () => {
		const [value, setValue] = React.useState<Language | null>(languages[0]);

		return (
			<div className="size-[300px]">
				<Combobox value={value} onValueChange={(v) => setValue(v)} items={languages}>
					<ComboboxTriggerValue className="w-[200px]" />
					<ComboboxContent>
						<Combobox.Input placeholder="Search languages" />
						<ComboboxEmpty />
						<ComboboxList>
							{(item: Language) => (
								<ComboboxItem key={item.value} value={item}>
									{item.emoji} {item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const SearchableSelect = {
	render: () => {
		const [value, setValue] = React.useState<Language | null>(null);

		return (
			<div className="size-[300px]">
				<Combobox value={value} onValueChange={(v) => setValue(v)} items={languages}>
					<ComboboxTriggerValue className="w-[200px]" placeholder="Select a language" />
					<ComboboxContent>
						<Combobox.Input placeholder="Search languages" />
						<ComboboxEmpty />
						<ComboboxList>
							{(item: Language) => (
								<ComboboxItem key={item.value} value={item}>
									{item.emoji} {item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const Grouped = {
	render: () => {
		const [value, setValue] = React.useState<ServerLocation | null>(null);

		return (
			<div className="size-[300px]">
				<Combobox value={value} onValueChange={(v) => setValue(v)} items={servers}>
					<ComboboxInput className="w-[200px]" placeholder="Select server" />
					<ComboboxContent>
						<ComboboxEmpty />
						<ComboboxList>
							{(group: ServerLocationGroup) => (
								<ComboboxGroup key={group.value} items={group.items}>
									<ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
									<Combobox.Collection>
										{(item: ServerLocation) => (
											<ComboboxItem key={item.value} value={item}>
												{item.label}
											</ComboboxItem>
										)}
									</Combobox.Collection>
								</ComboboxGroup>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const Multiple = {
	render: () => {
		const [value, setValue] = React.useState<BotItem[]>([]);

		return (
			<div className="w-[400px]">
				<Combobox
					value={value}
					onValueChange={setValue}
					items={bots}
					isItemEqualToValue={(bot: BotItem, selected: BotItem) => bot.value === selected.value}
					multiple
				>
					<ComboboxTriggerMultipleWithInput
						className="w-full"
						placeholder="Select bots"
						renderItem={(selected: BotItem) => <ComboboxChip key={selected.value}>{selected.label}</ComboboxChip>}
						inputSide="right"
					/>
					<ComboboxContent className="max-h-[200px] overflow-y-auto">
						<ComboboxEmpty />
						<ComboboxList>
							{(item: BotItem) => (
								<ComboboxItem key={item.value} value={item}>
									<div className="flex gap-2">
										<Text>{item.label}</Text>
										<Text variant="secondary">{item.author}</Text>
									</div>
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const WithField = {
	render: () => {
		const [value, setValue] = React.useState<DatabaseItem | null>(null);

		return (
			<div className="w-80">
				<Combobox items={databases} value={value} onValueChange={setValue} label="Database" description="Select your preferred database">
					<ComboboxInput placeholder="Select database" />
					<ComboboxContent>
						<ComboboxEmpty />
						<ComboboxList>
							{(item: DatabaseItem) => (
								<ComboboxItem key={item.value} value={item}>
									{item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const Disabled = {
	render: () => {
		return (
			<div className="flex w-[500px] flex-wrap items-start gap-4">
				<Combobox value="Apple" items={fruits} disabled>
					<ComboboxInput className="w-[200px]" placeholder="Select fruit" />
					<ComboboxContent>
						<ComboboxEmpty />
						<ComboboxList>
							{(item: string) => (
								<ComboboxItem key={item} value={item}>
									{item}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>

				<Combobox value={languages[0]} items={languages} disabled>
					<ComboboxTriggerValue className="w-[200px]" />
					<ComboboxContent>
						<Combobox.Input placeholder="Search" />
						<ComboboxEmpty />
						<ComboboxList>
							{(item: Language) => (
								<ComboboxItem key={item.value} value={item}>
									{item.emoji} {item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const DisabledItems = {
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
			{ value: 'd1', label: 'Cloudflare D1' },
		];

		const [value, setValue] = React.useState<DatabaseItemWithDisabled | null>(null);

		return (
			<div className="h-[300px] w-80">
				<Combobox value={value} onValueChange={setValue} items={items}>
					<ComboboxInput placeholder="Select database" />
					<ComboboxContent>
						<ComboboxEmpty />
						<ComboboxList>
							{(item: DatabaseItemWithDisabled) => (
								<ComboboxItem key={item.value} value={item} disabled={item.disabled}>
									<span>
										{item.label}
										{item.reason && (
											<Text variant="secondary" size="xs" as="span">
												{' — '}
												{item.reason}
											</Text>
										)}
									</span>
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const Error = {
	render: () => {
		const [value, setValue] = React.useState<DatabaseItem | null>(null);

		return (
			<div className="w-80">
				<Combobox
					items={databases}
					value={value}
					onValueChange={setValue}
					label="Database"
					error={{ message: 'Please select a database', match: true }}
				>
					<ComboboxInput placeholder="Select database" />
					<ComboboxContent>
						<ComboboxEmpty />
						<ComboboxList>
							{(item: DatabaseItem) => (
								<ComboboxItem key={item.value} value={item}>
									{item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const Sizes = {
	render: () => {
		const [smValue, setSmValue] = React.useState<string | null>(null);
		const [baseValue, setBaseValue] = React.useState<string | null>(null);

		return (
			<div className="flex w-[500px] flex-wrap items-center gap-4">
				<Combobox size="sm" value={smValue} onValueChange={(v) => setSmValue(v)} items={fruits.slice(0, 8)}>
					<ComboboxInput placeholder="Small (sm)" />
					<ComboboxContent>
						<ComboboxEmpty />
						<ComboboxList>
							{(item: string) => (
								<ComboboxItem key={item} value={item}>
									{item}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
				<Combobox size="base" value={baseValue} onValueChange={(v) => setBaseValue(v)} items={fruits.slice(0, 8)}>
					<ComboboxInput placeholder="Base (default)" />
					<ComboboxContent>
						<ComboboxEmpty />
						<ComboboxList>
							{(item: string) => (
								<ComboboxItem key={item} value={item}>
									{item}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const SizesSearchableInside = {
	render: () => {
		const [smValue, setSmValue] = React.useState<Language | null>(languages[0]);
		const [baseValue, setBaseValue] = React.useState<Language | null>(languages[1]);

		return (
			<div className="flex h-[300px] w-[500px] flex-wrap items-center gap-4">
				<Combobox size="sm" value={smValue} onValueChange={(v) => setSmValue(v)} items={languages}>
					<ComboboxTriggerValue className="w-[160px]" />
					<ComboboxContent>
						<Combobox.Input placeholder="Search" />
						<ComboboxEmpty />
						<ComboboxList>
							{(item: Language) => (
								<ComboboxItem key={item.value} value={item}>
									{item.emoji} {item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
				<Combobox size="base" value={baseValue} onValueChange={(v) => setBaseValue(v)} items={languages}>
					<ComboboxTriggerValue className="w-[180px]" />
					<ComboboxContent>
						<Combobox.Input placeholder="Search" />
						<ComboboxEmpty />
						<ComboboxList>
							{(item: Language) => (
								<ComboboxItem key={item.value} value={item}>
									{item.emoji} {item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

export const CustomTrigger = {
	render: () => {
		const [value, setValue] = React.useState<Language | null>(languages[0]);

		return (
			<div className="size-[300px]">
				<Combobox value={value} onValueChange={(v) => setValue(v)} items={languages}>
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
					<ComboboxContent>
						<Combobox.Input placeholder="Search languages" />
						<ComboboxEmpty />
						<ComboboxList>
							{(item: Language) => (
								<ComboboxItem key={item.value} value={item}>
									{item.emoji} {item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};
